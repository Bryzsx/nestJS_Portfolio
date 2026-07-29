const API = '';

async function fetchJSON(url) {
  const res = await fetch(API + url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function safeLoad(fn, sectionName) {
  try {
    await fn();
  } catch (err) {
    console.error(`Failed to load ${sectionName}:`, err);
    showToast(`Could not load ${sectionName}. Please refresh.`);
    const skeleton = document.querySelector(`#${sectionName.replace(/\s+/g, '-')} .skeleton, .${sectionName.replace(/\s+/g, '-')}-section .skeleton`);
    if (skeleton) skeleton.style.display = 'none';
  }
}

const SKILL_ICONS = {
  'Backend Development': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  'Cybersecurity': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'Linux & Systems': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="17"/></svg>`,
  'Server & Networking': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  'Databases & SEO': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  'Cloud & Hosting': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
};

// ===== THEME SYSTEM =====
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(el._hide);
  el._hide = setTimeout(() => el.classList.remove('visible'), 3000);
}

// ===== LOAD PROFILE =====
async function loadProfile() {
  const profile = await fetchJSON('/profile');
  const heroName = document.getElementById('hero-name');
  heroName.innerHTML = profile.name ? `<span class="hero-name-accent">${profile.name}</span>` : '<span class="hero-name-accent">Bryce A. Corvera</span>';
  document.getElementById('hero-bio').textContent = profile.bio || '';

  const avatarImg = document.getElementById('hero-avatar-img');
  const avatarSkeleton = document.getElementById('avatar-skeleton');

  if (profile.avatarUrl) {
    avatarImg.src = profile.avatarUrl;
    avatarImg.alt = profile.name;
    avatarImg.onload = () => {
      avatarImg.style.display = 'block';
      avatarSkeleton.style.display = 'none';
    };
    avatarImg.onerror = () => {
      avatarSkeleton.style.display = 'none';
      avatarImg.style.display = 'none';
      const ring = document.getElementById('avatar-ring');
      const initials = (profile.name || 'BC').split(' ').map(w => w[0]).join('');
      const fallback = document.createElement('div');
      fallback.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6c5ce7,#a29bfe);font-size:4rem;font-weight:900;color:#fff;';
      fallback.textContent = initials;
      ring.appendChild(fallback);
    };
  } else {
    avatarSkeleton.style.display = 'none';
    const initials = (profile.name || 'BC').split(' ').map(w => w[0]).join('');
    avatarImg.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6c5ce7,#a29bfe);font-size:4rem;font-weight:900;color:#fff;">${initials}</div>`;
  }

  if (profile.availableForWork) {
    const badge = document.getElementById('availability-badge');
    if (badge) badge.style.display = 'inline-flex';
  }

  document.getElementById('contact-email').textContent = profile.email || '';
  document.getElementById('contact-phone').textContent = profile.phone || '';

  const mailto = document.getElementById('contact-mailto');
  const email = profile.email || 'bryce.corvera21@gmail.com';
  mailto.href = 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(email);
  mailto.target = '_blank';
  mailto.rel = 'noopener noreferrer';

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
  const personalSkeleton = document.getElementById('personal-skeleton');
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
    personalSkeleton.style.display = 'none';
    personalInfo.style.display = 'grid';
  }

  loadStats();
  initReveal();
}

async function loadStats() {
  try {
    const [projects, certs, experience] = await Promise.all([
      fetchJSON('/projects'),
      fetchJSON('/certifications'),
      fetchJSON('/experience'),
    ]);
    const statsEl = document.getElementById('hero-stats');
    statsEl.innerHTML = [
      { value: '5+', label: 'Years Experience' },
      { value: projects.length, label: 'Projects' },
      { value: certs.length, label: 'Certifications' },
    ].map(s => `<div class="hero-stat"><span class="hero-stat-value">${s.value}</span><span class="hero-stat-label">${s.label}</span></div>`).join('');
  } catch (_) {}
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
      const displayCategory =
        s.category === 'Web & Backend Development'
          ? 'Backend Development'
          : s.category === 'Cybersecurity & Forensics'
          ? 'Cybersecurity'
          : s.category === 'Linux Systems'
          ? 'Linux & Systems'
          : s.category === 'Server Management'
          ? 'Server & Networking'
          : s.category === 'SEO & Database Management'
          ? 'Databases & SEO'
          : s.category;
      if (!grouped[displayCategory]) grouped[displayCategory] = [];
      grouped[displayCategory].push(s);
    }
  });

  const grid = document.getElementById('skills-grid');
  grid.innerHTML = Object.entries(grouped)
    .map(([category, items], i) => `
      <div class="skill-card reveal${i > 0 ? ` reveal-delay-${Math.min(i, 2)}` : ''}">
        <div class="skill-card-icon">${SKILL_ICONS[category] || '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'}</div>
        <div class="skill-card-title">${category}</div>
        <div class="skill-list">
          ${items.map(s => `
            <div class="skill-item">
              <div class="skill-item-header">
                <span class="skill-item-name">${s.name}</span>
                <span class="skill-item-level">${s.proficiency}%</span>
              </div>
              <div class="skill-progress">
                <div class="skill-progress-fill" data-proficiency="${s.proficiency}"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

  const softDiv = document.getElementById('soft-skills');
  if (softSkills.length) {
    softDiv.innerHTML = `
      <span class="soft-skills-label">SOFT SKILLS</span>
      ${softSkills.map(s => `<span class="soft-skill-tag">${s.name}</span>`).join('')}
    `;
  } else {
    softDiv.innerHTML = '';
  }

  initReveal();
  animateSkillBars();
}

function animateSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const proficiency = bar.dataset.proficiency;
        bar.style.setProperty('--target-width', proficiency + '%');
        bar.classList.add('animate');
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-progress-fill').forEach(el => observer.observe(el));
}

// ===== LOAD EXPERIENCE =====
async function loadExperience() {
  const items = await fetchJSON('/experience');
  const timeline = document.getElementById('experience-timeline');

  if (!items.length) {
    timeline.innerHTML = '<p style="color:var(--text-muted);">No experience listed yet.</p>';
    return;
  }

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
      (cert.title.includes('Wonder Table')
        ? '/images/aijmr-wonder-table-cert.png'
        : '');
    const img = effectiveImageUrl
      ? `<img src="${effectiveImageUrl}" alt="${cert.title}" class="cert-img" loading="lazy">`
      : `<div class="cert-img-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>`;
    let relevance = '';
    if (cert.platform === 'Udemy') {
      relevance = 'Full-stack web development bootcamp (60+ hrs)';
    } else if (cert.platform === 'WorldTech Information Solutions Inc.') {
      relevance = 'Hands-on cybersecurity training (5 days)';
    } else if (cert.platform.includes('Advanced International Journal')) {
      relevance = 'Published academic research work';
    }
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
            ${relevance ? `<span class="cert-meta-tag">${relevance}</span>` : ''}
            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="cert-credential-link">View Publication →</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  initReveal();
}

// ===== LOAD PROJECTS =====
let allProjects = [];

async function loadProjects() {
  const projects = await fetchJSON('/projects');
  allProjects = projects;
  const list = document.getElementById('projects-list');
  const filtersContainer = document.getElementById('project-filters');

  const allTechs = [...new Set(projects.flatMap(p => p.techStack))].sort();

  filtersContainer.innerHTML = `
    <button class="filter-btn active" data-filter="all">All</button>
    ${allTechs.map(t => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('')}
  `;

  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProjects(btn.dataset.filter);
  });

  renderProjects(projects);
}

function filterProjects(tech) {
  const filtered = tech === 'all' ? allProjects : allProjects.filter(p => p.techStack.includes(tech));
  renderProjects(filtered);
}

function renderProjects(projects) {
  const list = document.getElementById('projects-list');
  if (!projects.length) {
    list.innerHTML = '<p style="color:var(--text-light-secondary);">No projects match this filter.</p>';
    return;
  }

  list.innerHTML = projects.map(proj => {
    const techStr = proj.techStack.map(t => `<span class="project-tech-tag">${t}</span>`).join('');
    const liveLink = proj.liveUrl
      ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-tech-tag project-tech-link">Live Demo <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>`
      : '';
    const codeLink = proj.repoUrl
      ? `<a href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-tech-tag project-tech-link">Code ↗</a>`
      : `<span class="project-tech-tag">Code available on request</span>`;
    const imgs = proj.images && proj.images.length
      ? `<div class="project-images">${proj.images.map(src => `<img src="${src}" alt="" class="project-img" loading="lazy">`).join('')}</div>`
      : '';
    return `
      <div class="project-card reveal">
        <div class="project-card-info">
          <h3>${proj.title}</h3>
          <p>${proj.description}</p>
          <div class="project-tech">${techStr}${liveLink}${codeLink}</div>
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

  if (!items.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);">No education listed yet.</p>';
    return;
  }

  grid.innerHTML = items.map((edu, i) => `
    <div class="edu-card reveal${i % 2 ? ' reveal-delay-1' : ''}">
      <div class="edu-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
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

  const validators = {
    name: {
      validate: (v) => v.trim().length >= 2,
      msg: 'Name must be at least 2 characters.',
    },
    email: {
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      msg: 'Please enter a valid email address.',
    },
    subject: {
      validate: (v) => v.trim().length >= 3,
      msg: 'Subject must be at least 3 characters.',
    },
    message: {
      validate: (v) => v.trim().length >= 10,
      msg: 'Message must be at least 10 characters.',
    },
  };

  function validateField(input) {
    const field = input.name;
    const errorEl = document.getElementById('error-' + field);
    const v = validators[field];
    if (!v) return true;

    const valid = v.validate(input.value);
    input.classList.toggle('input-error', !valid && input.value.length > 0);
    input.classList.toggle('input-success', valid && input.value.length > 0);

    if (errorEl) {
      if (!valid && input.value.length > 0) {
        errorEl.textContent = v.msg;
        errorEl.classList.add('visible');
      } else {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }
    return valid;
  }

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('input-error') || input.classList.contains('input-success')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    let allValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      status.textContent = 'Please fix the errors above.';
      status.className = 'form-status error';
      const firstError = form.querySelector('.input-error');
      if (firstError) firstError.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
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
        form.querySelectorAll('input, textarea').forEach(input => {
          input.classList.remove('input-success', 'input-error');
        });
        showToast('Message sent successfully!');
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
  }, { passive: true });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
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
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('timeline-img') || target.classList.contains('project-img') || target.classList.contains('cert-img')) {
      lightboxImg.src = target.src;
      lightboxImg.alt = target.alt || '';
      lightboxCaption.textContent = target.alt || target.closest('.cert-card')?.querySelector('.cert-title')?.textContent || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ===== HOVER MOVE (Magnetic effect) =====
function initHoverMove() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const strength = 8;
  document.querySelectorAll('.btn, .skill-card, .project-card, .featured-card, .cert-card, .edu-card').forEach(el => {
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

// ===== BG CIRCUIT TRACES =====
function initBgNetwork() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let traces = [];
  let time = 0;
  let W, H;

  function theme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function rgb(a) {
    const c = theme() === 'dark' ? '232, 230, 227' : '26, 26, 26';
    return `rgba(${c}, ${a})`;
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = window.innerWidth < 768 ? 12 : 24;
    traces = [];
    for (let i = 0; i < count; i++) {
      const sx = Math.random() * W;
      const sy = Math.random() * H;
      const segments = 2 + Math.floor(Math.random() * 4);
      const pts = [{ x: sx, y: sy }];
      let cx = sx, cy = sy;
      for (let j = 0; j < segments; j++) {
        if (Math.random() > 0.5) {
          cx += (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 80);
        } else {
          cy += (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 80);
        }
        pts.push({ x: cx, y: cy });
      }
      traces.push({
        pts,
        speed: 0.3 + Math.random() * 0.5,
        progress: Math.random(),
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  resize();

  function draw() {
    time += 0.005;
    ctx.clearRect(0, 0, W, H);

    for (const trace of traces) {
      const pts = trace.pts;
      if (pts.length < 2) continue;

      trace.progress += trace.speed * 0.004 * trace.dir;
      if (trace.progress > 1) { trace.progress = 1; trace.dir = -1; }
      if (trace.progress < 0) { trace.progress = 0; trace.dir = 1; }

      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const isH = a.y === b.y;
        const len = Math.abs(isH ? b.x - a.x : b.y - a.y);

        const segStart = i / (pts.length - 1);
        const segEnd = (i + 1) / (pts.length - 1);

        let alpha = 0.12;
        let pulse = 0;

        if (trace.progress >= segStart && trace.progress <= segEnd) {
          const t = (trace.progress - segStart) / (segEnd - segStart);
          pulse = Math.sin(t * Math.PI) * 0.5;
        }

        alpha += pulse;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = rgb(alpha);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = rgb(0.4);
      ctx.fill();
    }

    for (const trace of traces) {
      const pts = trace.pts;
      if (pts.length >= 2) {
        const segIdx = Math.floor(trace.progress * (pts.length - 1));
        const segT = (trace.progress * (pts.length - 1)) - segIdx;
        const i = Math.min(segIdx, pts.length - 2);
        const a = pts[i], b = pts[i + 1];
        const px = a.x + (b.x - a.x) * segT;
        const py = a.y + (b.y - a.y) * segT;
        const glow = 0.4 + Math.sin(time * 3) * 0.15;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = rgb(glow);
        ctx.shadowColor = rgb(glow * 0.6);
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  let animId;
  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', resize);
}

// ===== ABOUT SECTION TEXT =====
function loadAbout() {
  const el = document.getElementById('about-text');
  if (el) {
    el.innerHTML = `
      <p>Highly motivated BSIT graduate and Full Stack Web Developer with experience building modern web applications, backend systems, APIs, and secure software solutions. Skilled in Python (Flask), NestJS, React, Next.js, JavaScript/TypeScript, Linux systems, and database-driven applications.</p>
      <p>Experienced in developing scalable applications, system integrations, deployment workflows, and applying cybersecurity practices through projects, vulnerability assessments, and CTF competitions. Passionate about creating reliable, efficient, and secure solutions while continuously improving skills through modern development practices and AI-assisted tools.</p>
    `;
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBgNetwork();
  initNavigation();
  initContactForm();
  initLightbox();
  initReveal();
  initHoverMove();
  initScrollProgress();

  loadAbout();

  safeLoad(loadProfile, 'profile');
  safeLoad(loadSkills, 'skills');
  safeLoad(loadExperience, 'experience');
  safeLoad(loadCertifications, 'certifications');
  safeLoad(loadProjects, 'projects');
  safeLoad(loadEducation, 'education');
});
