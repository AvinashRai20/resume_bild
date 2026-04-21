# ResumeCraft - Professional Resume Builder

## Completed Features

### 1. Live Preview with Real-Time DOM Updates
- Instant preview as you type
- DOM updates dynamically reflect changes
- Professional resume rendering

### 2. Personal Information Section
- Full Name, Job Title, Email, Phone, Location
- Professional Summary
- **Social Media Links** - GitHub, LinkedIn, Twitter, Instagram, Portfolio, Dribbble, Behance

### 3. Work Experience Management
- Add/Edit/Delete multiple experience entries
- Company, Role, Start/End Dates, Details, Projects
- Easy entry management with delete buttons

### 4. Education & Skills (Enhanced)
- **Degree Selection** - B.Tech, B.Sc, M.Tech, M.Sc, B.E, Diploma, Other
- College/University Name, Year, Percentage/CGPA
- Add multiple education entries
- **Tag-Based Skills System**:
  - Technical Skills and Soft Skills tabs
  - Press Enter to add skills as tags
  - Click × to remove skills

### 5. Resume Templates
- ATS Friendly (Simple)
- Modern Colored
- Side Border
- Professional Clean

### 6. Font & Styling
- 6 Font Options - Inter, Georgia, Space Grotesk, Segoe UI, Roboto, Open Sans
- 8+ Accent Colors
- Border Styles - None, Solid, Dashed, Double
- Text Alignment - Left, Center, Right
- Font Size Control - 12px to 20px

### 7. UI Theme System
- Dark Mode (Default)
- Light Mode toggle
- Theme persistence

### 8. Demo Data
- "Load Demo Data" button
- Sample resume with experiences, education, skills

### 9. Download Resume
- Download as Word (.docx)
- Download as PDF (.pdf)
- One-click export buttons

### 10. Edit/Delete Functionality
- Edit buttons for each section
- Delete with confirmation dialogs
- Non-destructive editing

### 11. Professional UI
- 6-step guided form wizard
- Sticky preview panel
- Responsive design
- Smooth animations
- Dark theme with gradients

### 12. Achievements, Certifications & Languages
- Achievements section
- Certifications list
- Language proficiency input

---

## How to Run

'
python app.py

Then visit: http://localhost:3000

---

## Project Structure

resume/
+-- app.py                 # Flask app with PDF/Word export
+-- templates/builder.html # Main form with all features
+-- static/
¦   +-- js/script.js      # Live preview & data sync
¦   +-- css/styles.css    # Professional styling
+-- requirements.txt
+-- README_FEATURES.md    # This file

---

## API Endpoints

POST /api/generate-docx  - Export as Word
POST /api/generate-pdf   - Export as PDF
POST /api/resume         - Save resume

---

## Technologies

Frontend: HTML5, CSS3, JavaScript (ES6+), Responsive Design
Backend: Flask, SQLAlchemy, python-docx, ReportLab
Database: SQLite

---

Built with ResumeCraft - Professional Resume Builder
