# ResumeCraft 2026 🚀 Modern Flask Resume Builder

Professional 7-step resume builder with **live preview**, **glassmorphic style customization**, **authentication**, and **DOCX export**.

## ✨ Features Added
- **7-Step Guided Flow**: Personal → Experience → Education → Achievements → Languages → Projects → **Style**
- **Live Preview**: Real-time updates as you type
- **Style Magic ✨**: 5 templates, fonts, colors, layout, spacing, borders
- **Glassmorphic UI**: Neon glows, particle effects, hover animations
- **Landing Upgrades**: Template showcase, trust stats, 3-step \"How it Works\"
- **Auth**: Email + Google OAuth, save resumes
- **Export**: Word DOCX download
- **Responsive**: Mobile-first design

## 🐍 Quick Start
```bash
pip install -r requirements.txt
python app.py
```
**Open**: http://localhost:3000

**Flow**: Sign in → Builder → Step 7 Style → Live preview → Download DOCX

## 📁 Structure
```
.
├── app.py                 # Flask app + auth + DOCX
├── requirements.txt       # Dependencies
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
