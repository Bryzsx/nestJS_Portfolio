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
    const sectionId = sectionName === 'profile' ? 'about' : sectionName;
    const skeleton = document.querySelector(`#${sectionId} .skeleton, .${sectionId}-section .skeleton`);
    if (skeleton) skeleton.style.display = 'none';
    const container = document.querySelector(`#${sectionId} .container`) || document.getElementById(sectionId);
    if (container && !container.querySelector('.load-error')) {
      const errEl = document.createElement('div');
      errEl.className = 'load-error';
      errEl.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>Could not load ${sectionName}. <button onclick="location.reload()" class="load-error-btn">Refresh page</button></p>
      `;
      container.appendChild(errEl);
    }
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
  const name = profile.name || 'Bryce A. Corvera';
  heroName.innerHTML = `<span class="hero-name-accent">${name}</span>`;
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

  initReveal();
  setTimeout(startHeroAnimation, 400);
}

async function loadStats() {
  try {
    const [projects, certs, experience] = await Promise.all([
      fetchJSON('/projects'),
      fetchJSON('/certifications'),
      fetchJSON('/experience'),
    ]);

    let yearsExp = '2+';
    if (experience.length) {
      const earliest = experience
        .map(e => e.startDate)
        .filter(Boolean)
        .sort()
        [0];
      if (earliest) {
        const start = new Date(earliest);
        const now = new Date();
        const years = (now - start) / (365.25 * 24 * 60 * 60 * 1000);
        if (years >= 5) yearsExp = '5+';
        else if (years >= 3) yearsExp = '3+';
        else yearsExp = Math.floor(years) + '+';
      }
    }

    const statsEl = document.getElementById('hero-stats');
    statsEl.innerHTML = [
      { value: yearsExp, label: 'Years Experience' },
      { value: projects.length, label: 'Projects' },
      { value: certs.length, label: 'Certifications' },
    ].map(s => {
      const match = String(s.value).match(/^(\d+)(.*)$/);
      const num = match ? match[1] : '0';
      const suffix = match ? match[2] : '';
      return `<div class="hero-stat"><span class="hero-stat-value" data-count="${num}" data-suffix="${suffix}">0</span><span class="hero-stat-label">${s.label}</span></div>`;
    }).join('');
    observeCountUp();
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
    list.innerHTML = `
      <div class="filter-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light-secondary)" stroke-width="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <p>No projects match this filter.</p>
        <button class="filter-empty-btn" onclick="document.querySelector('.filter-btn.active')?.click(); document.querySelector('[data-filter=\"all\"]')?.click();">Show All Projects</button>
      </div>
    `;
    return;
  }

  list.innerHTML = projects.map(proj => {
    const techStr = proj.techStack.map(t => `<span class="project-tech-tag">${t}</span>`).join('');
    const liveLink = proj.liveUrl
      ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn project-link-live">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          <span>Live Demo</span>
        </a>`
      : '';
    const codeLink = proj.repoUrl
      ? `<a href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn project-link-code">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span>Source Code</span>
        </a>`
      : `<span class="project-link-btn project-link-na">Code available on request</span>`;
    const imgs = proj.images && proj.images.length
      ? `<div class="project-images">${proj.images.map(src => `<img src="${src}" alt="" class="project-img" loading="lazy">`).join('')}</div>`
      : '';
    return `
      <div class="project-card reveal">
        <div class="project-card-info">
          <h3>${proj.title}</h3>
          <p>${proj.description}</p>
          <div class="project-tech">${techStr}</div>
          <div class="project-links">${liveLink}${codeLink}</div>
          ${imgs}
        </div>
        <div class="project-code-block" aria-hidden="true">
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
        status.textContent = '';
        status.className = 'form-status';
        form.reset();
        form.querySelectorAll('input, textarea').forEach(input => {
          input.classList.remove('input-success', 'input-error');
        });
        document.getElementById('confirm-dialog').classList.add('active');
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

  document.getElementById('confirm-close').addEventListener('click', () => {
    document.getElementById('confirm-dialog').classList.remove('active');
  });
  document.getElementById('confirm-dialog').addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirm-dialog')) {
      document.getElementById('confirm-dialog').classList.remove('active');
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
      <p>I build web applications that solve real business problems — from full-stack APIs to polished frontend interfaces. Whether you need a custom dashboard, an e-commerce platform, or API integrations, I deliver clean, reliable code that works.</p>
      <p>With hands-on experience across NestJS, Python, React, and TypeScript, I handle both the frontend experience and the backend logic. That means fewer handoffs, faster delivery, and one person who owns the whole stack. Every project gets the same standard: clear communication, on-time delivery, and solutions built to last.</p>
    `;
  }
}

// ===== TYPEWRITER =====
function typeWriter(el, text, speed) {
  return new Promise(resolve => {
    el.textContent = '';
    el.classList.add('type-cursor');
    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.remove('type-cursor');
        el.classList.add('done');
        resolve();
      }
    }
    type();
  });
}

function startHeroAnimation() {
  const greeting = document.querySelector('.hero-greeting');
  const nameEl = document.querySelector('.hero-name');
  const nameAccent = nameEl?.querySelector('.hero-name-accent');
  const subtitle = document.querySelector('.hero-subtitle');
  const bio = document.getElementById('hero-bio');
  const buttons = document.querySelector('.hero-buttons');
  if (!greeting || !nameAccent || !subtitle) return;

  if (buttons) { buttons.style.opacity = '0'; buttons.style.transition = 'opacity 0.6s var(--ease-smooth)'; }

  const greetingText = greeting.textContent;
  const nameText = nameAccent.textContent;
  const subtitleText = subtitle.textContent;
  const bioText = bio?.textContent || '';
  if (bio) { bio.style.opacity = '0'; bio.style.transition = 'opacity 0.6s var(--ease-smooth)'; }

  greeting.classList.add('type-cursor');

  function typeGreeting() {
    let i = 0;
    function tick() {
      if (i < greetingText.length) {
        greeting.textContent += greetingText.charAt(i);
        i++;
        setTimeout(tick, 40);
      } else {
        greeting.classList.remove('type-cursor');
        greeting.classList.add('done');
        typeName();
      }
    }
    tick();
  }

  function typeName() {
    nameAccent.textContent = '';
    nameAccent.classList.add('type-cursor');
    let j = 0;
    function tick() {
      if (j < nameText.length) {
        nameAccent.textContent += nameText.charAt(j);
        j++;
        setTimeout(tick, 50);
      } else {
        nameAccent.classList.remove('type-cursor');
        nameAccent.classList.add('done');
        typeSubtitle();
      }
    }
    tick();
  }

  function typeSubtitle() {
    subtitle.classList.add('type-cursor');
    let k = 0;
    function tick() {
      if (k < subtitleText.length) {
        subtitle.textContent += subtitleText.charAt(k);
        k++;
        setTimeout(tick, 40);
      } else {
        subtitle.classList.remove('type-cursor');
        subtitle.classList.add('done');
        setTimeout(typeBio, 300);
      }
    }
    tick();
  }

  function typeBio() {
    if (!bio || !bioText) {
      finish();
      return;
    }
    bio.textContent = '';
    bio.style.opacity = '1';
    let m = 0;
    function tick() {
      if (m < bioText.length) {
        bio.textContent += bioText.charAt(m);
        m++;
        const speed = bioText.charAt(m - 1) === '.' ? 120 : 15;
        setTimeout(tick, speed);
      } else {
        setTimeout(finish, 200);
      }
    }
    tick();
  }

  function finish() {
    if (buttons) buttons.style.opacity = '1';
  }

  greeting.textContent = '';
  nameAccent.textContent = '';
  subtitle.textContent = '';
  typeGreeting();
}

// ===== COUNT-UP =====
function observeCountUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) { observer.unobserve(el); return; }
        animateValue(el, 0, target, 1200, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stat-value[data-count]').forEach(el => observer.observe(el));
}

function animateValue(el, start, end, duration, suffix) {
  const startTime = performance.now();
  const isFloat = end % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    el.textContent = isFloat ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== TIMELINE DRAW =====
function observeTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const scrollTarget = entry.target;
        const totalHeight = scrollTarget.scrollHeight;
        const updateLine = () => {
          const rect = scrollTarget.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const offset = viewportHeight - rect.top;
          const progress = Math.min(Math.max(offset / (totalHeight + viewportHeight), 0), 1);
          scrollTarget.style.setProperty('--timeline-progress', progress);
          scrollTarget.classList.add('draw');
        };
        updateLine();
        window.addEventListener('scroll', updateLine, { passive: true });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  observer.observe(timeline);
}

// ===== IMAGE REVEAL =====
function observeImageReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.project-img, .cert-img, .timeline-img').forEach(el => {
    el.classList.add('reveal-img');
    observer.observe(el);
  });
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

  observeTimeline();
  observeImageReveal();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
