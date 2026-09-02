(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const pageLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];

  const setMenu = (open) => {
    if (!menuButton || !navLinks) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    navLinks.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const sections = pageLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      pageLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.2] });
    sections.forEach((section) => observer.observe(section));
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion) revealItems.forEach((item) => item.classList.add('is-visible'));
  else {
    const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  document.querySelectorAll('#current-year').forEach((item) => { item.textContent = new Date().getFullYear(); });

  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      if (feedback) feedback.textContent = 'Please complete all fields with a valid email address.';
      return;
    }
    const data = new FormData(form);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    const subject = data.get('subject').trim();
    const message = data.get('message').trim();
    const emailSubject = encodeURIComponent(`${subject} — Website enquiry`);
    const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    if (feedback) feedback.textContent = 'Opening your email application…';
    window.location.href = `mailto:developer@kksales.store?subject=${emailSubject}&body=${emailBody}`;
  });
})();
