# Resume Builder Application

Professional resume builder with guided workflow, real-time preview, authentication, and export features.

## ✨ Features
- **Multi-Step Workflow**: Organized resume building process
- **Live Preview**: Real-time updates as you build
- **Authentication**: Secure user accounts
- **Export**: Download your resume
- **Responsive Design**: Works on all devices

## 🚀 Getting Started
```bash
pip install -r requirements.txt
python app.py
```

## 📁 Project Structure
```
├── app.py                 # Application core
├── requirements.txt       # Dependencies
├── data/
│   └── templates.json     # Configuration
├── instance/              # Application data (auto-created)
├── static/                # Frontend assets
│   ├── css/
│   └── js/
├── templates/             # HTML views
│   ├── index.html        # Landing w/ template showcase
│   ├── builder.html      # 7-step builder + glassmorphic style
│   ├── signin.html       # Auth page
│   └── about.html
├── static/
│   ├── css/styles.css    # Glassmorphism + animations
│   └── js/script.js      # Live preview + stepper
├── data/templates.json   # Template configs
├── uploads/              # File uploads
└── README.md
```

## 🎯 New Style Features (Step 7)
```
Templates: Modern/Classic/Creative/Bold/Minimal (hover previews)
Colors: 8 swatches + custom picker + bg color
Typography: Inter/Georgia/Space Grotesk + more
Layout: Single/Dual column toggle
Spacing: Compact/Normal/Generous slider
Borders: None/Solid/Dashed/Double
Text Align: Left/Center/Right
Font Size: Slider (12px-20px)
```

## 🔧 Setup
```bash
pip install -r requirements.txt
python app.py
```

**Google OAuth** (optional): Add to `app.py` env vars

## 📱 Responsive
- Desktop: Full grid layouts
- Tablet: Stacked previews  
- Mobile: Single column stepper

## 🚀 Deployment
```bash
gunicorn app:app
# Or Railway/Render/Heroku
```

**Production ready** - Zero config deployment.

## 🎉 Result
Modern glassmorphic resume builder w/ **unique style step** + **high-conversion landing**. Live at localhost:3000!
