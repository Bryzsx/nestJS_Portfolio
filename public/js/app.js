const API = '';

async function fetchJSON(url) {
  const res = await fetch(API + url);
  return res.json();
}

const SKILL_ICONS = {
  'Backend Development': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  'Cybersecurity': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'Linux & Systems': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'Server & Networking': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  'Databases & SEO': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  'Cloud & Hosting': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
};

// ===== LOAD PROFILE =====
async function loadProfile() {
  const profile = await fetchJSON('/profile');
  document.getElementById('hero-name').textContent = profile.name || 'Bryce A. Corvera';
  document.getElementById('hero-bio').textContent = profile.bio || '';

  const avatarImg = document.getElementById('hero-avatar-img');
  if (profile.avatarUrl) {
    avatarImg.src = profile.avatarUrl;
    avatarImg.alt = profile.name;
  } else {
    const initials = (profile.name || 'BC').split(' ').map(w => w[0]).join('');
    avatarImg.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6c5ce7,#a29bfe);font-size:4rem;font-weight:900;color:#fff;">${initials}</div>`;
  }

  if (profile.availableForWork) {
    document.getElementById('availability-badge').style.display = 'inline-flex';
  }

  document.getElementById('contact-email').textContent = profile.email || '';
  document.getElementById('contact-phone').textContent = profile.phone || '';

  const mailto = document.getElementById('contact-mailto');
  const email = profile.email || 'bryce.corvera21@gmail.com';
  mailto.href = 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(email);
  mailto.target = '_blank';
  mailto.rel = 'noopener noreferrer';
  mailto.onclick = null;

  const resumeLink = document.getElementById('resume-link');
  if (profile.resumeUrl) resumeLink.href = profile.resumeUrl;

  const platforms = document.getElementById('hire-platforms');
  if (profile.hirePlatforms && profile.hirePlatforms.length) {
    platforms.innerHTML = profile.hirePlatforms
      .map(p => `<a href="${p.url}" class="hire-platform-tag" target="_blank">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${p.name}
      </a>`)
      .join('');
  }

  const personalInfo = document.getElementById('personal-info');
  if (personalInfo) {
    const items = [
      { label: 'Location', value: profile.location },
      { label: 'Born', value: profile.birthDate },
      { label: 'Current Age', value: profile.age },
      { label: 'Citizenship', value: profile.citizenship },
      { label: 'Role', value: profile.role },
      { label: 'Availability', value: profile.availableForWork ? 'Open for Hire' : 'Not Available' },
    ].filter(i => i.value);
    personalInfo.innerHTML = items
      .map(i => `<div class="personal-item"><span class="personal-item-label">${i.label}</span><span class="personal-item-value">${i.value}</span></div>`)
      .join('');
  }
}

// ===== LOAD SKILLS =====
async function loadSkills() {
  const skills = await fetchJSON('/skills');
  const grouped = {};
  const softSkills = [];

  skills.forEach(s => {
    if (s.category === 'Soft Skills') {
      softSkills.push(s);
    } else {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }
  });

  const grid = document.getElementById('skills-grid');
  grid.innerHTML = Object.entries(grouped)
    .map(([category, items], i) => `
      <div class="skill-card reveal${i > 0 ? ` reveal-delay-${Math.min(i, 2)}` : ''}">
        <div class="skill-card-icon">${SKILL_ICONS[category] || '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'}</div>
        <div class="skill-card-title">${category}</div>
        <div class="skill-tags">
          ${items.map(s => `<span class="skill-tag">${s.name}</span>`).join('')}
        </div>
      </div>
    `).join('');

  const softDiv = document.getElementById('soft-skills');
  if (softSkills.length) {
    softDiv.innerHTML = `
      <span class="soft-skills-label">SOFT SKILLS</span>
      ${softSkills.map(s => `<span class="soft-skill-tag">${s.name}</span>`).join('')}
    `;
  }

  initReveal();
}

// ===== LOAD EXPERIENCE =====
async function loadExperience() {
  const items = await fetchJSON('/experience');
  const timeline = document.getElementById('experience-timeline');

  timeline.innerHTML = items.map(exp => {
    const start = formatDate(exp.startDate);
    const end = exp.endDate ? formatDate(exp.endDate) : 'Present';
    const imgs = exp.images && exp.images.length
      ? `<div class="timeline-images">${exp.images.map(src => `<img src="${src}" alt="" class="timeline-img" loading="lazy">`).join('')}</div>`
      : '';
    const achievement = exp.achievement
      ? `<div class="timeline-achievement"><strong>Key Achievement:</strong> ${exp.achievement}</div>`
      : '';
    return `
      <div class="timeline-item reveal">
        <div class="timeline-date">${start} &ndash; ${end}</div>
        <div class="timeline-content">
          <h3>${exp.role} &mdash; ${exp.company}</h3>
          <p>${exp.description}</p>
          ${achievement}
          ${imgs}
        </div>
      </div>
    `;
  }).join('');
  initReveal();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parseInt(month, 10) - 1] + ' ' + year;
}

// ===== LOAD CERTIFICATIONS =====
async function loadCertifications() {
  const certs = await fetchJSON('/certifications');
  const list = document.getElementById('certs-list');

  if (!certs.length) {
    document.getElementById('certifications').style.display = 'none';
    return;
  }

  list.innerHTML = certs.map(cert => {
    const effectiveImageUrl =
      cert.imageUrl ||
      (cert.title.includes('Wonder Table: An Android Based Augmented Reality Learning Tool for Periodic Elements')
        ? '/images/aijmr-wonder-table-cert.png'
        : '');
    const img = effectiveImageUrl
      ? `<img src="${effectiveImageUrl}" alt="${cert.title}" class="cert-img">`
      : `<div class="cert-img-placeholder">🎓</div>`;
    return `
      <div class="cert-card reveal">
        <div class="cert-image">${img}</div>
        <div class="cert-info">
          <div class="cert-platform">${cert.platform}</div>
          <div class="cert-title">${cert.title}</div>
          <div class="cert-instructor">Instructor: ${cert.instructor}</div>
          <div class="cert-meta">
            ${cert.date ? `<span class="cert-meta-tag">${cert.date}</span>` : ''}
            ${cert.hours ? `<span class="cert-meta-tag">${cert.hours}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  initReveal();
}

// ===== LOAD PROJECTS =====
async function loadProjects() {
  const projects = await fetchJSON('/projects');
  const list = document.getElementById('projects-list');

  list.innerHTML = projects.map(proj => {
    const techStr = proj.techStack.map(t => `<span class="project-tech-tag">${t}</span>`).join('');
    const liveLink = proj.liveUrl
      ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-tech-tag project-tech-link">PythonAnywhere (Flask) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>`
      : '';
    const imgs = proj.images && proj.images.length
      ? `<div class="project-images">${proj.images.map(src => `<img src="${src}" alt="" class="project-img" loading="lazy">`).join('')}</div>`
      : '';
    return `
      <div class="project-card reveal">
        <div class="project-card-info">
          <h3>${proj.title}</h3>
          <p>${proj.description}</p>
          <div class="project-tech">${techStr}${liveLink}</div>
          ${imgs}
        </div>
        <div class="project-code-block">
          <div class="code-dots"><span></span><span></span><span></span></div>
          <div class="code-filename">developer.py</div>
          <br>
          <span class="code-keyword">developer</span> = {<br>
          &nbsp;&nbsp;<span class="code-key">"project"</span>: <span class="code-string">"${proj.title}"</span>,<br>
          &nbsp;&nbsp;<span class="code-key">"tech"</span>: [${proj.techStack.map(t => `<span class="code-string">"${t}"</span>`).join(', ')}],<br>
          &nbsp;&nbsp;<span class="code-key">"status"</span>: <span class="code-string">"Completed"</span><br>
          }
        </div>
      </div>
    `;
  }).join('');
  initReveal();
}

// ===== LOAD EDUCATION =====
async function loadEducation() {
  const items = await fetchJSON('/education');
  const grid = document.getElementById('education-grid');

  grid.innerHTML = items.map((edu, i) => `
    <div class="edu-card reveal${i % 2 ? ' reveal-delay-1' : ''}">
      <div class="edu-icon">🎓</div>
      <div class="edu-info">
        <div class="edu-years">${edu.startYear} &ndash; ${edu.endYear}</div>
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-school">${edu.school}</div>
        <div class="edu-location">${edu.location}</div>
      </div>
    </div>
  `).join('');
  initReveal();
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const res = await fetch(API + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        status.textContent = 'Message sent successfully!';
        status.className = 'form-status success';
        form.reset();
      } else {
        const err = await res.json();
        const msg = Array.isArray(err.message) ? err.message.join(', ') : err.message;
        status.textContent = msg || 'Failed to send.';
        status.className = 'form-status error';
      }
    } catch {
      status.textContent = 'Network error. Please try again.';
      status.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollTop.classList.toggle('visible', window.scrollY > 500);

    const sections = document.querySelectorAll('.section');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.id;
      }
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ===== LIGHTBOX =====
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('timeline-img') || e.target.classList.contains('project-img') || e.target.classList.contains('cert-img')) {
      lightboxImg.src = e.target.src;
      lightbox.classList.add('active');
    }
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
}

// ===== HOVER MOVE (Magnetic effect - text follows cursor) =====
function initHoverMove() {
  const strength = 8;
  document.querySelectorAll('.hover-move').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / strength;
      const y = (e.clientY - rect.top - rect.height / 2) / strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContactForm();
  initLightbox();
  initReveal();
  initHoverMove();
  loadProfile();
  loadSkills();
  loadExperience();
  loadCertifications();
  loadProjects();
  loadEducation();
});
