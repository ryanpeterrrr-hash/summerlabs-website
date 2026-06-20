/* =========================================================
   SummerLabs — Main JavaScript
   Handles: logo fallback, navbar state, mobile menu,
   scroll-triggered animations, and stat counters.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLogoFallback();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initHeroParallax();
});

/* -----------------------------------------------------------
   Logo fallback
   If assets/images/logo.png fails to load, swap every
   .logo-img / .logo-text pair for the text "SummerLabs".
----------------------------------------------------------- */
function initLogoFallback() {
  const logo = new Image();
  logo.src = 'assets/images/logo.png';

  logo.addEventListener('error', () => {
    document.body.classList.add('logo-fallback');
  });
}

/* -----------------------------------------------------------
   Navbar
   Adds a "scrolled" class once the user scrolls past the
   hero so the navbar can switch from transparent to solid.
----------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 40;

  const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}

/* -----------------------------------------------------------
   Mobile menu
   Toggles the fullscreen nav overlay and closes it whenever
   a link inside it is clicked.
----------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) toggleMenu();
    });
  });
}

/* -----------------------------------------------------------
   Scroll-triggered animations
   Uses IntersectionObserver to reveal elements with the
   .animate-on-scroll class, applies a staggered delay to
   cards within grids, and kicks off the stat counters.
----------------------------------------------------------- */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  // Assign a --card-index custom property so grouped cards
  // (services, steps, audience) fade in one after another.
  const groups = document.querySelectorAll(
    '.services-grid, .steps-container, .audience-grid, .stats-container'
  );

  groups.forEach((group) => {
    const items = group.querySelectorAll('.animate-on-scroll');
    items.forEach((item, index) => {
      item.style.setProperty('--card-index', index);
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        // If this element contains a stat number, animate it.
        const statNumber = entry.target.querySelector('.stat-number');
        if (statNumber) animateCounter(statNumber);

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  animatedEls.forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------------
   Stat counters
   Animates a number from 0 up to data-target, appending
   data-suffix (e.g. "+", "%", "/7") once finished.
----------------------------------------------------------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const formatNumber = (value) => value.toLocaleString('en-US');

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = easeOutExpo(progress);
    const current = Math.round(eased * target);

    el.textContent = formatNumber(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = formatNumber(target) + suffix;
    }
  }

  requestAnimationFrame(tick);
}

/* -----------------------------------------------------------
   Hero parallax / zoom
   As the user scrolls through the hero, the content gently
   zooms out and fades while the background glow orbs drift
   at a slower rate — a cinematic depth effect.
----------------------------------------------------------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const content = document.querySelector('.hero-content');
  const orbs = document.querySelectorAll('.glow-orb');
  if (!hero || !content) return;

  let ticking = false;

  const update = () => {
    const heroHeight = hero.offsetHeight;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);

    const scale = 1 - progress * 0.15;
    const opacity = 1 - progress * 1.2;

    content.style.scale = scale.toFixed(3);
    content.style.opacity = Math.max(opacity, 0).toFixed(3);

    orbs.forEach((orb, index) => {
      const depth = (index + 1) * 40;
      orb.style.translate = `0 ${(progress * depth).toFixed(1)}px`;
    });

    ticking = false;
  };

  update();

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}
