async function loadConfig() {
  const res = await fetch('portfolio.config.json');
  const cfg = await res.json();
  render(cfg);
}

function render(cfg) {
  const { meta, hero, about, experience, projects, social } = cfg;

  // ── Nav ──
  document.title = meta.name + ' · Portfolio';
  document.getElementById('nav-domain').textContent = meta.domain;

  // ── Hero ──
  document.getElementById('hero-label').textContent = meta.role + ' · ' + meta.location;
  document.getElementById('hero-h1').innerHTML = hero.greeting + '<br><em>' + meta.name + '</em>';
  document.getElementById('hero-tagline').textContent = hero.tagline;

  // ── About ──
  document.getElementById('about-short').textContent = about.short;
  document.getElementById('about-extended').textContent = about.extended;

  const sg = document.getElementById('skills-grid');
  about.skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'skill-tag';
    span.textContent = skill;
    sg.appendChild(span);
  });

  // ── Experience ──
  const tl = document.getElementById('timeline');
  experience.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <p class="timeline-date">${exp.period}</p>
      <p class="timeline-role">${exp.role}</p>
      <p class="timeline-company">${exp.company}</p>
      <p class="timeline-desc">${exp.description}</p>
    `;
    tl.appendChild(item);
  });

  // ── Projects ──
  const pg = document.getElementById('projects-grid');
  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const titleHtml = p.url
      ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>`
      : p.title;
    const tagsHtml = p.tags
      .map(t => `<span class="project-tag">${t}</span>`)
      .join('');

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <p class="project-num">${num}</p>
      <p class="project-title">${titleHtml}</p>
      <p class="project-desc">${p.description}</p>
      <div class="project-tags">${tagsHtml}</div>
    `;
    pg.appendChild(card);
  });

  // ── Contact / availability ──
  const avail = document.getElementById('availability-line');
  if (meta.available) {
    const dot = document.createElement('span');
    dot.className = 'availability-dot';
    avail.appendChild(dot);
    avail.appendChild(document.createTextNode(meta.availabilityNote));
  } else {
    avail.textContent = meta.availabilityNote;
  }

  // ── Social links ──
  const sl = document.getElementById('social-links');
  social.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url;
    a.className = 'social-link';
    a.innerHTML = `<span class="social-icon">${s.label}</span>${s.name}`;
    sl.appendChild(a);
  });


  // ── Contact form → mailto ──
  document.getElementById('btn-send').addEventListener('click', () => {
    const nome    = document.querySelector('input[type="text"]').value.trim();
    const email   = document.querySelector('input[type="email"]').value.trim();
    const message = document.querySelector('textarea').value.trim();

    if (!email || !message) {
      alert('Inserisci almeno email e messaggio.');
      return;
    }

    const subject = encodeURIComponent('Contatto dal portfolio' + (nome ? ' — ' + nome : ''));
    const body    = encodeURIComponent(
      (nome ? 'Nome: ' + nome + '\n' : '') +
      'Email: ' + email + '\n\n' +
      message
    );

    window.location.href = 'mailto:' + meta.email + '?subject=' + subject + '&body=' + body;
  });

  // ── Footer ──
  document.getElementById('footer-name').textContent =
    '© ' + new Date().getFullYear() + ' ' + meta.name;
  document.getElementById('footer-location').textContent = meta.location;
}

loadConfig().catch(err => {
  document.body.innerHTML =
    '<p style="padding:2rem;font-family:monospace;color:red;">' +
    'Errore nel caricamento di portfolio.config.json: ' + err.message +
    '</p>';
});
