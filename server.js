const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./resumecraft.db');

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Passport Google OAuth
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
        callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        db.get('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, user) => {
            if (err) return done(err);
            if (user) {
                return done(null, user);
            } else {
                db.run('INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)', [profile.id, profile.emails[0].value, profile.displayName],
                    function(err) {
                        if (err) return done(err);
                        db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
                            return done(null, newUser);
                        });
                    });
            }
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin.html' }),
    (req, res) => {
        res.redirect('/builder.html');
    }
);

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // For demo purposes, accept any email/password
    // In production, implement proper authentication
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) {
            // Create user if doesn't exist (demo mode)
            db.run('INSERT INTO users (email, name) VALUES (?, ?)', [email, email.split('@')[0]], function(err) {
                if (err) return res.status(500).json({ error: 'Failed to create user' });
                req.login({ id: this.lastID, email, name: email.split('@')[0] }, (err) => {
                    if (err) return res.status(500).json({ error: 'Login failed' });
                    res.json({ success: true });
                });
            });
        } else {
            req.login(user, (err) => {
                if (err) return res.status(500).json({ error: 'Login failed' });
                res.json({ success: true });
            });
        }
    });
});

// Signup route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        db.run('INSERT INTO users (email, name) VALUES (?, ?)', [email, name], function(err) {
            if (err) return res.status(500).json({ error: 'Failed to create user' });
            req.login({ id: this.lastID, email, name }, (err) => {
                if (err) return res.status(500).json({ error: 'Login failed' });
                res.json({ success: true });
            });
        });
    });
});

// Save resume data
app.post('/api/resume', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data } = req.body;
    db.run('INSERT INTO resumes (user_id, data) VALUES (?, ?)', [req.user.id, JSON.stringify(data)], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to save resume' });
        } else {
            res.json({ success: true });
        }
    });
});

// Get user's resumes
app.get('/api/resumes', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    db.all('SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch resumes' });
        } else {
            res.json({ resumes: rows });
        }
    });
});

// Generate Word document
app.post('/api/generate-docx', (req, res) => {
    const resumeData = req.body;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: resumeData.fullName || 'Full Name',
                    heading: HeadingLevel.TITLE,
                }),
                new Paragraph({
                    children: [
                        new TextRun(resumeData.jobTitle || 'Professional Title'),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun(`Email: ${resumeData.email || 'email@example.com'}`),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun(`Phone: ${resumeData.phone || '+91 12345 67890'}`),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun(`Location: ${resumeData.location || 'City, Country'}`),
                    ],
                }),
                new Paragraph({
                    text: 'Professional Summary',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun(resumeData.summary || 'Professional summary here'),
                    ],
                }),
                new Paragraph({
                    text: 'Work Experience',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun(`${resumeData.role || 'Role'} at ${resumeData.company || 'Company'}`),
                        new TextRun(` (${resumeData.experienceStart || 'Start'} - ${resumeData.experienceEnd || 'End'})`),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun(resumeData.experienceDetails || 'Experience details'),
                    ],
                }),
                new Paragraph({
                    text: 'Education',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun(resumeData.education || 'Education details'),
                    ],
                }),
                new Paragraph({
                    text: 'Skills',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun(resumeData.skills || 'Skills list'),
                    ],
                }),
                new Paragraph({
                    text: 'Certifications',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun(resumeData.certifications || 'Certifications'),
                    ],
                }),
            ],
        }],
    });

    Packer.toBuffer(doc).then((buffer) => {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.docx');
        res.send(buffer);
    }).catch((error) => {
        console.error('Error generating document:', error);
        res.status(500).json({ error: 'Failed to generate document' });
    });
});

// File upload for existing resumes
const upload = multer({ dest: 'uploads/' });
app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ filename: req.file.filename, path: req.file.path });
});

app.listen(PORT, () => {
    console.log(`ResumeCraft server running on http://localhost:${PORT}`);
});