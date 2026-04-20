const form = document.querySelector('#resumeForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const stepButtons = Array.from(document.querySelectorAll('.step'));
const nextButtons = document.querySelectorAll('.next-step');
const prevButtons = document.querySelectorAll('.prev-step');
const resumePreview = document.querySelector('#resumePreview');
const templateSelect = document.querySelector('#templateSelect');
const fontSelect = document.querySelector('#fontSelect');
const colorSelect = document.querySelector('#colorSelect');
const borderSelect = document.querySelector('#borderSelect');
const fontSizeRange = document.querySelector('#fontSize');
const fontSizeValue = document.querySelector('#fontSizeValue');
const alignmentButtons = Array.from(document.querySelectorAll('.align-button'));
const templateDescription = document.querySelector('#templateDescription');
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
            templates.forEach((template) => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                option.dataset.description = template.description;
                templateSelect.appendChild(option);
            });
            updateTemplateDescription();
        })
        .catch(() => {
            templateSelect.innerHTML = '<option value="modern">Modern Classic</option>';
            templateDescription.textContent = 'Default modern resume template with strong headings and clean spacing.';
        });
}

function updateTemplateDescription() {
    const selected = templateSelect.selectedOptions[0];
    if (selected) {
        templateDescription.textContent = selected.dataset.description;
    }
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
  styleSettings.template = templateSelect.value;
  styleSettings.fontFamily = fontSelect.value;
  styleSettings.accentColor = colorSelect.value;
  styleSettings.borderStyle = borderSelect.value;
  styleSettings.fontSize = `${fontSizeRange.value}px`;
  fontSizeValue.textContent = `${fontSizeRange.value}px`;
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
    updateTemplateDescription();
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

  templateSelect.addEventListener('change', () => {
    syncStyleInputs();
    updateTemplateDescription();
    renderPreview();
  });

  fontSelect.addEventListener('change', () => {
    syncStyleInputs();
    renderPreview();
  });

  colorSelect.addEventListener('change', () => {
    syncStyleInputs();
    renderPreview();
  });

  borderSelect.addEventListener('change', () => {
    syncStyleInputs();
    renderPreview();
  });

  fontSizeRange.addEventListener('input', () => {
    syncStyleInputs();
    renderPreview();
  });

  alignmentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      alignmentButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      styleSettings.align = button.dataset.align;
      renderPreview();
    });
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

        if (response.ok) {
          window.location.href = '/builder';
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        alert('Sign in failed. Please try again.');
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

        if (response.ok) {
          alert('Account created successfully! Please sign in.');
          signupForm.style.display = 'none';
          signForm.style.display = 'grid';
        } else {
          const result = await response.json();
          alert(result.error || 'Sign up failed');
        }
      } catch (error) {
        alert('Sign up failed. Please try again.');
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