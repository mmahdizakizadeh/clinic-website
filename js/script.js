(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');
  const navigationLinks = [...document.querySelectorAll('.nav-link, .nav-cta')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year = document.getElementById('current-year');

  if (year) year.textContent = new Date().getFullYear().toLocaleString('fa-IR');

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'باز کردن منو');
    menuToggle.innerHTML = '<svg aria-hidden="true"><use href="assets/icons/sprite.svg#i-menu"></use></svg>';
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
        return;
      }
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'بستن منو');
      menuToggle.innerHTML = '<svg aria-hidden="true"><use href="assets/icons/sprite.svg#i-close"></use></svg>';
      navigation.classList.add('is-open');
      document.body.classList.add('menu-open');
    });

    navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        document.querySelectorAll('.nav-link').forEach((link) => {
          const active = link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => activeObserver.observe(section));
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-image');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const galleryButtons = [...document.querySelectorAll('[data-lightbox]')];
  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lightboxImage) lightboxImage.src = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lastFocusedElement = button;
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = button.dataset.alt || '';
      if (lightboxCaption) lightboxCaption.textContent = button.querySelector('strong')?.textContent || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightboxClose?.focus();
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
    if (event.key === 'Tab' && lightbox?.classList.contains('is-open')) {
      const focusable = [lightboxClose].filter(Boolean);
      if (focusable.length === 1) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  });
})();
