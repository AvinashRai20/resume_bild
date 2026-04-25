const form = document.querySelector('#resumeForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const stepButtons = Array.from(document.querySelectorAll('.step'));
const nextButtons = document.querySelectorAll('.next-step');
const prevButtons = document.querySelectorAll('.prev-step');
const resumePreview = document.querySelector('#resumePreview');
const templateGrid = document.querySelector('#templateGrid');
const fontOptions = Array.from(document.querySelectorAll('.font-option'));
const colorOptions = Array.from(document.querySelectorAll('.color-option'));
const borderOptions = Array.from(document.querySelectorAll('.border-option'));
const alignOptions = Array.from(document.querySelectorAll('.align-option'));
const fontSizeRange = document.querySelector('#fontSize');
const fontSizeValue = document.querySelector('#fontSizeValue');
const editResumeButton = document.querySelector('#editResume');
const downloadDocxButton = document.querySelector('#downloadDocx');
const downloadPdfButton = document.querySelector('#downloadPdf');
let currentStep = 0;
let resumeData = {
    fullName: 'Aman Kumar',
    jobTitle: 'UI/UX Designer',
    email: 'aman@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    summary: 'A creative resume builder enthusiast with strong eye for modern design and layout.',
    github: 'github.com/amankumar',
    linkedin: 'linkedin.com/in/amankumar',
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
    communication: 'Excellent verbal and written communication skills, able to present ideas clearly to diverse audiences.',
    company: 'Tech Studio',
    role: 'Product Designer',
    experienceStart: 'Jan 2024',
    experienceEnd: 'Present',
    experienceDetails: 'Designed product experiences, iterated fast with user feedback, and delivered polished UI systems.',
    education: 'B.Sc. Computer Science, National University, 2023',
    skills: 'Figma, HTML/CSS, JavaScript, Communication, Teamwork',
    certifications: 'Certified UX Specialist, Google Career Certificate',
    achievements: '• Increased sales by 30%\n• Led team project to completion',
    certificates: '• AWS Certified Developer\n• Google Data Analytics Certificate',
    languages: 'English, Hindi, Spanish',
    languageLevels: 'English: Native\nHindi: Fluent\nSpanish: Intermediate',
    profilePhoto: '',
    bgColor: '#0b1220'
};
let styleSettings = {
    template: 'modern',
    fontFamily: 'Inter, sans-serif',
    accentColor: '#1f6feb',
    borderStyle: 'none',
    fontSize: '16px',
    align: 'left',
    layout: 'single',
    spacing: '1.2'
};
const fallbackTemplates = [{
        id: 'modern',
        name: 'Modern Classic',
        description: 'Clean, crisp layout with bright accent highlights and strong typography.',
        accentColor: '#1f6feb',
        fontFamily: 'Inter, sans-serif',
        borderStyle: 'solid'
    },
    {
        id: 'classic',
        name: 'Classic Minimal',
        description: 'Elegant resume style with soft edges, refined spacing, and a calm palette.',
        accentColor: '#ff9b67',
        fontFamily: 'Georgia, serif',
        borderStyle: 'double'
    },
    {
        id: 'creative',
        name: 'Creative Edge',
        description: 'Bold section headers, modern energy, and vivid accent colors for standout profiles.',
        accentColor: '#42e0d9',
        fontFamily: "'Space Grotesk', sans-serif",
        borderStyle: 'dashed'
    }
];

function setStep(step) {
    currentStep = Math.max(0, Math.min(step, steps.length - 1));
    steps.forEach((panel, index) => panel.classList.toggle('active', index === currentStep));
    stepButtons.forEach((button, index) => button.classList.toggle('active', index === currentStep));
}

function loadTemplates() {
    fetch('/data/templates.json')
        .then((response) => response.json())
        .then((templates) => buildTemplateButtons(templates))
        .catch(() => buildTemplateButtons(fallbackTemplates));
}

function buildTemplateButtons(templates) {
    templateGrid.innerHTML = '';
    templates.forEach((template, index) => {
        const templateButton = document.createElement('button');
        templateButton.type = 'button';
        templateButton.className = 'template-option';
        templateButton.dataset.template = template.id;
        templateButton.dataset.color = template.accentColor;
        templateButton.innerHTML = `
            <div class="template-preview" style="background: linear-gradient(135deg, ${template.accentColor}22, ${template.accentColor}10); border: 1px solid ${template.accentColor}44;">
                <div class="template-name">${template.name}</div>
                <div class="template-desc">${template.description}</div>
            </div>
        `;
        if (index === 0) templateButton.classList.add('active');
        templateGrid.appendChild(templateButton);
    });
    document.querySelectorAll('.template-option').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.template-option').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            syncStyleInputs();
            renderPreview();
        });
    });
}

function collectData() {
    if (!form) return;
    const data = new FormData(form);
    data.forEach((value, key) => {
        if (key === 'profilePhoto') return;
        resumeData[key] = value;
    });
    const bgColorInput = document.querySelector('#bgColor');
    resumeData.bgColor = bgColorInput ? bgColorInput.value || resumeData.bgColor : resumeData.bgColor;
    resumeData.skillsList = parseSkills(resumeData.skills || '');
    resumeData.experiences = [];
    let expCount = 0;
    while (true) {
        const company = form.querySelector(`[name="exp_company_${expCount}"]`);
        if (!company) break;
        if (company.value.trim()) {
            resumeData.experiences.push({
                company: company.value,
                role: form.querySelector(`[name="exp_role_${expCount}"]`).value,
                start: form.querySelector(`[name="exp_start_${expCount}"]`).value,
                end: form.querySelector(`[name="exp_end_${expCount}"]`).value,
                details: form.querySelector(`[name="exp_details_${expCount}"]`).value
            });
        }
        expCount++;
    }
    resumeData.projects = [];
    let projCount = 0;
    while (true) {
        const name = form.querySelector(`[name="proj_name_${projCount}"]`);
        if (!name) break;
        if (name.value.trim()) {
            resumeData.projects.push({
                name: name.value,
                tech: form.querySelector(`[name="proj_tech_${projCount}"]`).value,
                start: form.querySelector(`[name="proj_start_${projCount}"]`).value,
                end: form.querySelector(`[name="proj_end_${projCount}"]`).value,
                desc: form.querySelector(`[name="proj_desc_${projCount}"]`).value
            });
        }
        projCount++;
    }
}

function parseSkills(rawSkills) {
    return rawSkills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((skill) => {
            const [name, value] = skill.split(':').map((part) => part.trim());
            const numeric = value ? Number(value.replace('%', '').trim()) : 0;
            return {
                name: name || skill,
                value: !Number.isNaN(numeric) && numeric > 0 ? Math.min(100, Math.max(10, numeric)) : 80
            };
        });
}

function applyStyleSettings() {
    if (!resumePreview) return;
    resumePreview.style.fontFamily = styleSettings.fontFamily;
    resumePreview.style.color = styleSettings.template === 'classic' ? '#e5e9ff' : '#f6f8ff';
    resumePreview.style.textAlign = styleSettings.align;
    resumePreview.style.fontSize = styleSettings.fontSize;
    resumePreview.style.setProperty('--accent-color', styleSettings.accentColor);
    resumePreview.style.setProperty('--bg-color', resumeData.bgColor);
    resumePreview.style.borderStyle = styleSettings.borderStyle;
    resumePreview.style.borderWidth = styleSettings.borderStyle === 'none' ? '0px' : '1px';
    resumePreview.style.borderColor = styleSettings.accentColor;
    resumePreview.style.background = `linear-gradient(180deg, ${hexToRgba(resumeData.bgColor, 0.95)}, ${hexToRgba(resumeData.bgColor, 1)})`;
    resumePreview.style.setProperty('--layout', styleSettings.layout);
    resumePreview.style.setProperty('--spacing', styleSettings.spacing);
    resumePreview.style.setProperty('--line-height', `${parseFloat(styleSettings.spacing) * 1.6}px`);
    if (styleSettings.layout === 'dual') {
        resumePreview.classList.add('dual-column');
    } else {
        resumePreview.classList.remove('dual-column');
    }
}

function getThemeToggleButton() {
    return document.querySelector('#theme-toggle');
}

function updateThemeIcon() {
    const themeToggle = getThemeToggleButton();
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    if (themeIcon) {
        themeIcon.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
    }
}

function initializeThemeToggle() {
    const themeToggle = getThemeToggleButton();
    if (!themeToggle) return;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    document.body.classList.toggle('light', savedTheme === 'light');
    updateThemeIcon();
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        document.body.classList.toggle('light', !isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    });
}

function hexToRgba(hex, alpha) {
    const cleaned = hex.replace('#', '');
    const bigint = parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderPreview() {
    if (!resumePreview) return;
    collectData();
    const templateClass = `template-${styleSettings.template}`;
    resumePreview.className = `resume-preview ${templateClass}`;
    const skillBlocks = resumeData.skillsList.length ? resumeData.skillsList.map((skill) => `
            <div class="skill-block">
              <div class="skill-row">
                <span class="skill-chip">${skill.name}</span>
                <span class="skill-progress">${skill.value}%</span>
              </div>
              <div class="skill-bar"><div class="skill-bar-inner" style="width: ${skill.value}%; background: ${styleSettings.accentColor};"></div></div>
            </div>
          `).join('') : '';
    const experienceHTML = resumeData.experiences.length ? resumeData.experiences.map((exp) => `
            <div class="resume-experience">
              <p class="resume-meta">${exp.role || 'Role'} • ${exp.company || 'Company'} • ${exp.start || 'Start'} - ${exp.end || 'End'}</p>
              <p>${exp.details || 'Details'}</p>
            </div>
          `).join('') : '<p>Add your work experiences.</p>';
    const projectHTML = resumeData.projects.length ? resumeData.projects.map((proj) => `
            <div class="resume-project">
              <p class="resume-meta">${proj.name || 'Project Name'} • ${proj.tech || 'Technologies'} • ${proj.start || 'Start'} - ${proj.end || 'End'}</p>
              <p>${proj.desc || 'Description'}</p>
            </div>
          `).join('') : '<p>Add your projects.</p>';
    resumePreview.innerHTML = `
      <div class="resume-card">
        <div class="resume-heading">
          <div style="display: flex; gap: 18px; align-items: center; flex-wrap: wrap;">
            ${resumeData.profilePhoto ? `<div class="profile-photo" style="background-image:url('${resumeData.profilePhoto}')"></div>` : ''}
            <div>
              <h1 class="resume-title">${resumeData.fullName || 'Full Name'}</h1>
              <p class="resume-subtitle">${resumeData.jobTitle || 'Professional Title'}</p>
            </div>
          </div>
          <div class="resume-meta">
            <p>${resumeData.email || 'email@example.com'}</p>
            <p>${resumeData.phone || '+91 12345 67890'}</p>
            <p>${resumeData.location || 'City, Country'}</p>
          </div>
        </div>
        <div class="resume-section">
          <h3>Professional summary</h3>
          <p>${resumeData.summary || 'Write a short summary that explains your strengths, experience, and career focus.'}</p>
        </div>
        <div class="resume-section">
          <h3>Communication Skills</h3>
          <p>${resumeData.communication || 'Describe your communication abilities.'}</p>
        </div>
        <div class="resume-section">
          <h3>Work Experience</h3>
          ${experienceHTML}
        </div>
        <div class="resume-section">
          <h3>Education</h3>
          <p>${resumeData.education || 'Degree, Institution, Year'}</p>
        </div>
        <div class="resume-section">
          <h3>Skills</h3>
          ${skillBlocks || '<p>Add your strongest skills separated by commas.</p>'}
        </div>
        <div class="resume-section">
          <h3>Certificates & Training</h3>
          <pre class="resume-cert-list">${resumeData.certificates || resumeData.certifications || 'Add certificates, awards, or training programs.'}</pre>
        </div>
        <div class="resume-section">
          <h3>Achievements</h3>
          <pre class="resume-achievements">${resumeData.achievements || 'Add your achievements (one per line).'}</pre>
        </div>
        <div class="resume-section">
          <h3>Languages</h3>
          <p>${resumeData.languages || 'English, Hindi'}</p>
          <pre class="resume-language-levels">${resumeData.languageLevels || 'Proficiency levels'}</pre>
        </div>
        <div class="resume-section">
          <h3>Projects</h3>
          ${projectHTML}
        </div>
      </div>
    `;
    applyStyleSettings();
}

function syncStyleInputs() {
    const activeTemplate = document.querySelector('.template-option.active');
    styleSettings.template = activeTemplate ? activeTemplate.dataset.template : 'modern';
    const activeFont = document.querySelector('.font-option.active');
    styleSettings.fontFamily = activeFont ? activeFont.dataset.font : 'Inter, sans-serif';
    const activeColor = document.querySelector('.color-option.active');
    styleSettings.accentColor = activeColor ? activeColor.dataset.color : '#1f6feb';
    const activeBorder = document.querySelector('.border-option.active');
    styleSettings.borderStyle = activeBorder ? activeBorder.dataset.border : 'none';
    styleSettings.fontSize = `${fontSizeRange.value}px`;
    fontSizeValue.textContent = `${fontSizeRange.value}px`;
    const activeAlign = document.querySelector('.align-option.active');
    styleSettings.align = activeAlign ? activeAlign.dataset.align : 'left';
    const activeLayout = document.querySelector('.layout-option.active');
    styleSettings.layout = activeLayout ? activeLayout.dataset.layout : 'single';
    const spacingRange = document.querySelector('#spacingRange');
    if (spacingRange) {
        const value = parseFloat(spacingRange.value);
        styleSettings.spacing = value.toString();
        document.querySelector('#spacingValue').textContent = ['Compact', 'Normal', 'Generous', 'Spacious'][Math.round((value - 0.8) / 0.33)];
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function preparePhotoCrop(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
            const size = 280;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const ratio = Math.max(size / image.width, size / image.height);
            const width = image.width * ratio;
            const height = image.height * ratio;
            const x = (size - width) / 2;
            const y = (size - height) / 2;
            ctx.drawImage(image, x, y, width, height);
            const cropped = canvas.toDataURL('image/jpeg', 0.95);
            resumeData.profilePhoto = cropped;
            updatePhotoPreview(cropped);
            renderPreview();
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function updatePhotoPreview(imageDataUrl) {
    const preview = document.querySelector('#photoPreview');
    if (preview && imageDataUrl) {
        preview.style.backgroundImage = `url('${imageDataUrl}')`;
        preview.style.borderStyle = 'solid';
    }
}

function generateSummary() {
    const title = resumeData.jobTitle || 'motivated professional';
    const skillNames = resumeData.skillsList.map((skill) => skill.name).slice(0, 4);
    const skillSummary = skillNames.length ? `with experience in ${skillNames.join(', ')}` : 'with proven expertise in modern design and product delivery';
    const summary = `Results-driven ${title} ${skillSummary}. Skilled at leading high-impact initiatives, optimizing workflows, and delivering polished outcomes for business and user growth.`;
    const summaryField = document.querySelector('#summary');
    if (summaryField) {
        summaryField.value = summary;
        resumeData.summary = summary;
        renderPreview();
    }
}

function toggleTheme() {
    const body = document.body;
    const button = document.querySelector('#themeToggle');
    body.classList.toggle('light');
    if (button) {
        button.textContent = body.classList.contains('light') ? 'Dark Mode' : 'Light Mode';
    }
}

function startResumeBuilder() {
    loadTemplates();
    renderPreview();
    const profilePhotoInput = document.querySelector('#profilePhoto');
    const cropPhotoButton = document.querySelector('#cropPhoto');
    const generateSummaryButton = document.querySelector('#generateSummary');
    const bgColorInput = document.querySelector('#bgColor');

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                preparePhotoCrop(file);
            }
        });
    }

    if (cropPhotoButton) {
        cropPhotoButton.addEventListener('click', () => {
            const file = profilePhotoInput?.files?.[0];
            if (file) {
                preparePhotoCrop(file);
            }
        });
    }

    if (generateSummaryButton) {
        generateSummaryButton.addEventListener('click', generateSummary);
    }

    if (bgColorInput) {
        bgColorInput.addEventListener('input', () => {
            resumeData.bgColor = bgColorInput.value;
            renderPreview();
        });
    }

    if (form) {
        form.addEventListener('input', debounce(() => {
            collectData();
            renderPreview();
        }, 250));
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === 'addExperience') {
            const container = document.getElementById('experienceEntries');
            const count = container.children.length;
            const newEntry = document.createElement('div');
            newEntry.className = 'experience-entry';
            newEntry.dataset.entry = count;
            newEntry.innerHTML = `
              <div class="form-group">
                <label>Company / Organization</label>
                <input name="exp_company_${count}" type="text" placeholder="Company name" />
              </div>
              <div class="form-group">
                <label>Role / Position</label>
                <input name="exp_role_${count}" type="text" placeholder="Product Manager, Developer" />
              </div>
              <div class="grid-two">
                <div class="form-group">
                  <label>Start date</label>
                  <input name="exp_start_${count}" type="text" placeholder="Jun 2023" />
                </div>
                <div class="form-group">
                  <label>End date</label>
                  <input name="exp_end_${count}" type="text" placeholder="Present" />
                </div>
              </div>
              <div class="form-group">
                <label>Details</label>
                <textarea name="exp_details_${count}" rows="4" placeholder="Summarize achievements, responsibilities, and impact."></textarea>
              </div>
              <button type="button" class="button button-outline remove-entry" style="margin-top: 8px;">Remove</button>
            `;
            container.appendChild(newEntry);
            renderPreview();
        } else if (e.target.id === 'addProject') {
            const container = document.getElementById('projectsEntries');
            const count = container.children.length;
            const newEntry = document.createElement('div');
            newEntry.className = 'project-entry';
            newEntry.dataset.entry = count;
            newEntry.innerHTML = `
              <div class="form-group">
                <label>Project Name</label>
                <input name="proj_name_${count}" type="text" placeholder="Project name" />
              </div>
              <div class="form-group">
                <label>Technologies Used</label>
                <input name="proj_tech_${count}" type="text" placeholder="React, Node.js, MongoDB" />
              </div>
              <div class="grid-two">
                <div class="form-group">
                  <label>Start date</label>
                  <input name="proj_start_${count}" type="text" placeholder="Jun 2023" />
                </div>
                <div class="form-group">
                  <label>End date</label>
                  <input name="proj_end_${count}" type="text" placeholder="Present" />
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea name="proj_desc_${count}" rows="4" placeholder="Describe the project, your role, and achievements."></textarea>
              </div>
              <button type="button" class="button button-outline remove-entry" style="margin-top: 8px;">Remove</button>
            `;
            container.appendChild(newEntry);
            renderPreview();
        } else if (e.target.classList.contains('remove-entry')) {
            e.target.closest('.experience-entry, .project-entry').remove();
            collectData();
            renderPreview();
        }
    });

    stepButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            collectData();
            renderPreview();
            setStep(index);
        });
    });

    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            collectData();
            renderPreview();
            setStep(currentStep + 1);
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener('click', () => setStep(currentStep - 1));
    });

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            collectData();
            syncStyleInputs();
            renderPreview();
            setStep(3);
            try {
                const response = await fetch('/api/resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resumeData)
                });
                if (response.ok) {
                    console.log('Resume saved successfully');
                } else {
                    console.log('Failed to save resume');
                }
            } catch (error) {
                console.log('Error saving resume:', error);
            }
        });
    }

    fontOptions.forEach(button => {
        button.addEventListener('click', () => {
            fontOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            syncStyleInputs();
            renderPreview();
        });
    });

    colorOptions.forEach(button => {
        button.addEventListener('click', () => {
            colorOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            syncStyleInputs();
            renderPreview();
        });
    });

    borderOptions.forEach(button => {
        button.addEventListener('click', () => {
            borderOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            syncStyleInputs();
            renderPreview();
        });
    });

    alignOptions.forEach(button => {
        button.addEventListener('click', () => {
            alignOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            syncStyleInputs();
            renderPreview();
        });
    });

    fontSizeRange.addEventListener('input', () => {
        syncStyleInputs();
        renderPreview();
    });

    editResumeButton?.addEventListener('click', () => setStep(0));

    downloadDocxButton?.addEventListener('click', () => {
        collectData();
        syncStyleInputs();
        fetch('/api/generate-docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resumeData)
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error downloading document:', error);
            alert('Failed to download document. Please try again.');
        });
    });

    downloadPdfButton?.addEventListener('click', () => {
        collectData();
        syncStyleInputs();
        renderPreview();
        const element = document.querySelector('#resumePreview');
        const opt = {
            margin: 0,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        setTimeout(() => {
            html2pdf().set(opt).from(element).save();
        }, 100);
    });
}

function handleAuthForm() {
    const signForm = document.querySelector('#signForm');
    const signupForm = document.querySelector('#signupForm');
    const showSignupLink = document.querySelector('#showSignup');
    const showSigninLink = document.querySelector('#showSignin');

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            signForm.style.display = 'none';
            signupForm.style.display = 'grid';
        });
    }

    if (showSigninLink) {
        showSigninLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.style.display = 'none';
            signForm.style.display = 'grid';
        });
    }

    if (signForm) {
        signForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(signForm);
            const data = Object.fromEntries(formData);
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    window.location.href = '/builder';
                } else {
                    alert(result.error || 'Invalid credentials. Please try again.');
                }
            } catch (error) {
                alert('Sign in failed. Please try again.');
                console.error('Sign in error:', error);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData);
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    alert('Account created successfully!');
                    window.location.href = '/builder';
                } else {
                    alert(result.error || 'Sign up failed. Please try again.');
                }
            } catch (error) {
                alert('Sign up failed. Please try again.');
                console.error('Sign up error:', error);
            }
        });
    }
}

function initPage() {
    initializeThemeToggle();
    if (form) {
        startResumeBuilder();
    }
    handleAuthForm();
}

window.addEventListener('DOMContentLoaded', initPage);