# ResumeCraft 2026 - Advanced Resume Builder

A modern, professional resume builder with authentication, Google sign-in, and Word document export capabilities.

## 🚀 Quick Start

1. **Run the project**: Double-click `run.bat` or run `npm start` in terminal
2. **Open browser**: Go to `http://localhost:3000`
3. **Sign up/Sign in**: Create account or use Google OAuth
4. **Build resume**: Follow the 4-step guided process
5. **Download**: Export as Word document (.docx)

## ✨ Features

- **Step-by-step Resume Builder**: Guided process to create professional resumes
- **Multiple Templates**: Choose from modern, classic, and bold templates
- **Live Preview**: See changes instantly as you type
- **User Authentication**: Sign up and sign in with email or Google OAuth
- **Word Document Export**: Generate and download resumes as .docx files
- **Responsive Design**: Works on desktop and mobile devices
- **File Upload**: Upload existing resumes for reference
- **Save Progress**: Auto-save resume data for logged-in users

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Authentication**: Passport.js with Google OAuth
- **Database**: SQLite3
- **Document Generation**: docx library
- **File Upload**: Multer

## 📁 Project Structure

```
/
├── run.bat             # Windows batch file to start server
├── README.md           # This file
├── package.json        # Dependencies and scripts
├── server.js           # Express server with authentication and API
├── index.html          # Landing page
├── builder.html        # Resume builder interface
├── signin.html         # Authentication page
├── about.html          # About page
├── assets/
│   ├── css/
│   │   └── styles.css  # Main stylesheet
│   └── js/
│       └── script.js   # Client-side JavaScript
├── data/
│   └── templates.json  # Resume templates configuration
├── uploads/            # Uploaded files directory
└── resumecraft.db      # SQLite database (created automatically)
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)

### Installation
```bash
# Clone or download the project
# Navigate to project directory
npm install
```

### Running
```bash
# Start server
npm start

# Or for development
npm run dev
```

## 🌐 Google OAuth Setup (Optional)

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URIs to: `http://localhost:3000/auth/google/callback`
6. Create a `.env` file in the project root:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 📡 API Endpoints

- `GET /` - Landing page
- `GET /auth/google` - Google OAuth login
- `POST /api/login` - Email/password login
- `POST /api/signup` - User registration
- `POST /api/resume` - Save resume data
- `GET /api/resumes` - Get user's saved resumes
- `POST /api/generate-docx` - Generate Word document
- `POST /api/upload-resume` - Upload existing resume

## 🎯 Usage Guide

1. **Home Page**: Overview of features and call-to-action
2. **Sign In/Sign Up**: Create account or login with Google
3. **Resume Builder**: 4-step process:
   - **Step 1**: Personal Information (name, contact, summary)
   - **Step 2**: Work Experience (company, role, dates, details)
   - **Step 3**: Education & Skills (education, skills, certifications)
   - **Step 4**: Style & Template (choose template, customize appearance)
4. **Live Preview**: See resume update in real-time
5. **Download**: Click "Download as Word" to export .docx file

## 🚀 Deployment

For production deployment:

1. Set environment variables for Google OAuth
2. Use a production database (PostgreSQL, MySQL, etc.)
3. Implement proper password hashing
4. Set up HTTPS
5. Configure proper session storage
6. Deploy to platforms like Heroku, Vercel, or AWS

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is for educational purposes.</content>
