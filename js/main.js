/* =========================================
   Navbar: solid background + shrink on scroll
========================================= */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* Mobile hamburger menu */
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================
   Scroll-triggered reveal animations
   Cards with the "stagger" class fade up one
   after another based on their position in
   their parent container.
========================================= */
document.querySelectorAll('.stagger').forEach((el) => {
  const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('stagger'));
  const index = siblings.indexOf(el);
  el.style.setProperty('--delay', `${(index % 4) * 0.12}s`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal, .stagger').forEach((el) => revealObserver.observe(el));

/* =========================================
   Video showcase - thumbnail play button
========================================= */
const videoPlayBtn = document.getElementById('video-play-btn');
const videoPlayerEl = document.getElementById('video-player-el');

if (videoPlayBtn && videoPlayerEl) {
  videoPlayBtn.addEventListener('click', () => {
    videoPlayerEl.controls = true;
    videoPlayerEl.play();
  });

  videoPlayerEl.addEventListener('play', () => {
    videoPlayBtn.classList.add('is-hidden');
  });

  videoPlayerEl.addEventListener('pause', () => {
    videoPlayBtn.classList.remove('is-hidden');
  });
}

/* =========================================
   Stats counter animation
========================================= */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.stat-number').forEach((el) => statsObserver.observe(el));

/* =========================================
   Who We Serve - decorative shuffle grid
   Builds a grid of gradient cells and
   periodically reshuffles their scale/opacity
   while the section is in view.
========================================= */
const shuffleGrid = document.getElementById('shuffle-grid');

if (shuffleGrid) {
  const gradients = [
    'linear-gradient(135deg, #7c3aed, #3b82f6)',
    'linear-gradient(135deg, #3b82f6, #7c3aed)',
    'linear-gradient(135deg, #a855f7, #3b82f6)',
    'linear-gradient(135deg, #3b82f6, #a855f7)',
  ];

  const cells = [];
  for (let i = 0; i < 16; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'shuffle-cell';
    cell.style.background = gradients[i % gradients.length];
    cell.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
    shuffleGrid.appendChild(cell);
    cells.push(cell);
  }

  function shuffleCells() {
    cells.forEach((cell) => {
      cell.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
      cell.style.transform = `scale(${(0.85 + Math.random() * 0.25).toFixed(2)})`;
    });
  }

  let shuffleInterval = null;

  const shuffleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !shuffleInterval) {
          shuffleInterval = setInterval(shuffleCells, 1800);
        } else if (!entry.isIntersecting && shuffleInterval) {
          clearInterval(shuffleInterval);
          shuffleInterval = null;
        }
      });
    },
    { threshold: 0.2 }
  );

  shuffleObserver.observe(shuffleGrid);
}

/* =========================================
   Footer - animated wave bars
   Builds a row of bars and animates them
   with a sine wave while in view.
========================================= */
const waveContainer = document.getElementById('wave-container');

if (waveContainer) {
  const barCount = 23;
  const bars = [];

  /* Same purple/lavender used at the top of the CTA section above the footer */
  const waveBarColor = '#d6bef0';

  for (let i = 0; i < barCount; i += 1) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    bar.style.height = `${i + 1}px`;
    bar.style.background = waveBarColor;
    waveContainer.appendChild(bar);
    bars.push(bar);
  }

  let waveTime = 0;
  let waveFrame = null;

  function animateWave() {
    let offset = 0;
    bars.forEach((bar, index) => {
      offset += Math.max(0, 20 * Math.sin((waveTime + index) * 0.3));
      bar.style.transform = `translateY(${(index + offset).toFixed(2)}px)`;
    });
    waveTime += 0.1;
    waveFrame = requestAnimationFrame(animateWave);
  }

  const waveObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && waveFrame === null) {
          animateWave();
        } else if (!entry.isIntersecting && waveFrame !== null) {
          cancelAnimationFrame(waveFrame);
          waveFrame = null;
        }
      });
    },
    { threshold: 0.1 }
  );

  waveObserver.observe(waveContainer);
}

/* =========================================
   Footer - back to top
========================================= */
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
