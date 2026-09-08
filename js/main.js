/**
 * Kazi Abir Hasan Portfolio
 * Global Scripts & Next-Level Page Transition Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPageTransitions();
  initMobileNav();
  initScrollEffects();
  initCustomCursor();
  initMagneticElements();
  initIntersectionReveals();
  initParallax();
});

/* ==========================================================================
   THEME ENFORCEMENT (Always Light Mode)
   ========================================================================== */
function initTheme() {
  const root = document.documentElement;
  root.setAttribute('data-theme', 'light');
  try {
    localStorage.removeItem('kah-theme');
    localStorage.setItem('kah-theme', 'light');
  } catch (e) {
    // Ignore storage restrictions
  }
}

/* ==========================================================================
   NEXT-LEVEL PAGE TRANSITION ENGINE
   ========================================================================== */
function initPageTransitions() {
  // Add curtain element dynamically if not present
  if (!document.getElementById('page-curtain')) {
    const curtain = document.createElement('div');
    curtain.id = 'page-curtain';
    curtain.innerHTML = `
      <div class="curtain-layer curtain-layer-1"></div>
      <div class="curtain-layer curtain-layer-2">
        <div class="curtain-logo">
          <img src="./assets/logo.png" alt="Logo" class="curtain-logo-img" />
        </div>
      </div>
    `;
    document.body.appendChild(curtain);
  }

  // Handle page load entrance
  window.requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });

  // Handle bfcache (browser back/forward button)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.classList.remove('is-transitioning');
      document.body.classList.add('page-loaded');
    }
  });

  // Intercept all internal navigation links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchors, external links, downloads, emails, javascript
    const isAnchor = href.startsWith('#');
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const isMail = href.startsWith('mailto:');
    const isTel = href.startsWith('tel:');
    const hasTarget = link.getAttribute('target') === '_blank';
    const isDownload = link.hasAttribute('download');

    if (isAnchor || isExternal || isMail || isTel || hasTarget || isDownload) {
      return;
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const destination = link.href;

      document.body.classList.remove('page-loaded');
      document.body.classList.add('is-transitioning');

      setTimeout(() => {
        window.location.href = destination;
      }, 550);
    });
  });

  // Set active link in navigation
  highlightActiveNav();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu .nav-link, .mobile-nav-drawer .nav-link').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');

  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close drawer on click outside or on nav links
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   SCROLL EFFECTS & BACK TO TOP
   ========================================================================== */
function initScrollEffects() {
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 25);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 380);
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   CUSTOM INTERACTIVE CURSOR
   ========================================================================== */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover state on interactives
  const hoverTargets = 'a, button, input, textarea, .portfolio-card, .album-photo-card, .channel-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ==========================================================================
   MAGNETIC BUTTONS
   ========================================================================== */
function initMagneticElements() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL OBSERVER
   ========================================================================== */
function initIntersectionReveals() {
  const elements = document.querySelectorAll('.fade-up, .fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   PORTRAIT PARALLAX DEPTH
   ========================================================================== */
function initParallax() {
  const portrait = document.querySelector('.portrait-frame');
  if (!portrait || window.matchMedia('(pointer: coarse)').matches) return;

  window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 45;
    const y = (window.innerHeight / 2 - e.clientY) / 45;
    portrait.style.transform = `rotateY(${-x}deg) rotateX(${y}deg) translateZ(10px)`;
  });
}
