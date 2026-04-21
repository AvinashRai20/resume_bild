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
    company: 'Tech Studio',
    role: 'Product Designer',
    experienceStart: 'Jan 2024',
    experienceEnd: 'Present',
    experienceDetails: 'Designed product experiences, iterated fast with user feedback, and delivered polished UI systems.',
    education: 'B.Sc. Computer Science, National University, 2023',
    skills: 'Figma, HTML/CSS, JavaScript, Communication, Teamwork',
    certifications: 'Certified UX Specialist, Google Career Certificate'
};
let styleSettings = {
    template: 'modern',
    fontFamily: 'Inter, sans-serif',
    accentColor: '#1f6feb',
    borderStyle: 'solid',
    fontSize: '16px',
    align: 'left'
};

function setStep(step) {
    currentStep = Math.max(0, Math.min(step, steps.length - 1));
    steps.forEach((panel, index) => panel.classList.toggle('active', index === currentStep));
    stepButtons.forEach((button, index) => button.classList.toggle('active', index === currentStep));
}

function loadTemplates() {
    fetch('/data/templates.json')
        .then((response) => response.json())
        .then((templates) => {
            templateGrid.innerHTML = '';
            templates.forEach((template) => {
                const templateButton = document.createElement('button');
                templateButton.type = 'button';
                templateButton.className = 'template-option';
                templateButton.dataset.template = template.id;
                templateButton.innerHTML = `
                    <div class="template-preview" style="background: linear-gradient(135deg, ${template.accentColor}20, ${template.accentColor}10); border: 1px solid ${template.accentColor}40;">
                        <div class="template-name">${template.name}</div>
                        <div class="template-desc">${template.description}</div>
                    </div>
                `;
                if (template.id === 'modern') templateButton.classList.add('active');
                templateGrid.appendChild(templateButton);
            });
            // Add event listeners
            document.querySelectorAll('.template-option').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.template-option').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    syncStyleInputs();
                    renderPreview();
                });
            });
        })
        .catch(() => {
            templateGrid.innerHTML = '<div class="template-option active" data-template="modern"><div class="template-preview"><div class="template-name">Modern Classic</div><div class="template-desc">Default modern resume template.</div></div></div>';
        });
}

function updateTemplateDescription() {
    // No longer needed with new UI
}

function collectData() {
    const data = new FormData(form);
    data.forEach((value, key) => {
        if (value) resumeData[key] = value;
    });
}

function applyStyleSettings() {
    resumePreview.style.fontFamily = styleSettings.fontFamily;
    resumePreview.style.color = styleSettings.template === 'classic' ? '#e5e9ff' : '#f6f8ff';
    resumePreview.style.textAlign = styleSettings.align;
    resumePreview.style.fontSize = styleSettings.fontSize;
    resumePreview.style.setProperty('--accent-color', styleSettings.accentColor);
    resumePreview.style.borderStyle = styleSettings.borderStyle;
    resumePreview.style.borderWidth = styleSettings.borderStyle === 'none' ? '0px' : '1px';
    resumePreview.style.borderColor = styleSettings.accentColor;
}

function renderPreview() {
    const templateClass = `template-${styleSettings.template}`;
    resumePreview.className = `resume-preview ${templateClass}`;

    const skillsList = resumeData.skills ? resumeData.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : [];

    resumePreview.innerHTML = `
    <div class="resume-card">
      <div class="resume-heading">
        <div>
          <h1 class="resume-title">${resumeData.fullName || 'Full Name'}</h1>
          <p class="resume-subtitle">${resumeData.jobTitle || 'Professional Title'}</p>
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
        <h3>Work experience</h3>
        <p class="resume-meta">${resumeData.role || 'Role'} • ${resumeData.company || 'Company'} • ${resumeData.experienceStart || 'Start'} - ${resumeData.experienceEnd || 'End'}</p>
        <p>${resumeData.experienceDetails || 'Describe your accomplishments, measurable impact, and what you contributed.'}</p>
      </div>
      <div class="resume-section">
        <h3>Education</h3>
        <p>${resumeData.education || 'Degree, Institution, Year'}</p>
      </div>
      <div class="resume-section">
        <h3>Skills</h3>
        ${skillsList.length ? `<ul class="resume-list">${skillsList.map((skill) => `<li>${skill}</li>`).join('')}</ul>` : '<p>Add your strongest skills separated by commas.</p>'}
      </div>
      <div class="resume-section">
        <h3>Certifications</h3>
        <p>${resumeData.certifications || 'Add certificates, awards, or training programs.'}</p>
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
}

function startResumeBuilder() {
  loadTemplates();
  renderPreview();

  stepButtons.forEach((button, index) => {
    button.addEventListener('click', () => setStep(index));
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    collectData();
    syncStyleInputs();
    renderPreview();
    setStep(3);

    // Save resume data to server if user is authenticated
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

  // Font options
  fontOptions.forEach(button => {
    button.addEventListener('click', () => {
      fontOptions.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      syncStyleInputs();
      renderPreview();
    });
  });

  // Color options
  colorOptions.forEach(button => {
    button.addEventListener('click', () => {
      colorOptions.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      syncStyleInputs();
      renderPreview();
    });
  });

  // Border options
  borderOptions.forEach(button => {
    button.addEventListener('click', () => {
      borderOptions.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      syncStyleInputs();
      renderPreview();
    });
  });

  // Alignment options
  alignOptions.forEach(button => {
    button.addEventListener('click', () => {
      alignOptions.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      syncStyleInputs();
      renderPreview();
    });
  });

  // Font size
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
  if (form) {
    startResumeBuilder();
  }
  handleAuthForm();
}

window.addEventListener('DOMContentLoaded', initPage);