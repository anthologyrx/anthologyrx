/* ── AnthologyRX — main.js ──────────────────────────────────────────────── */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth <= 640;

  /* ── Nav scroll behavior ───────────────────────────────────────────────── */
  const navWrap = document.querySelector('.nav-wrap');
  let lastY = 0;
  let ticking = false;

  function handleScroll() {
    const y = window.scrollY;
    if (y > 40) navWrap.classList.add('nav--scrolled');
    else navWrap.classList.remove('nav--scrolled');
    if (y > lastY && y > 120) navWrap.classList.add('nav--hidden');
    else navWrap.classList.remove('nav--hidden');
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(handleScroll); ticking = true; }
  }, { passive: true });

  /* ── Mobile hamburger toggle ───────────────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const navMobile = document.getElementById('navMobile');

  function closeMenu() {
    if (navMobile) navMobile.classList.remove('open');
    if (hamburger) hamburger.classList.remove('is-open');
  }

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      hamburger.classList.toggle('is-open', isOpen);
    });

    navMobile.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      if (navMobile.classList.contains('open') && !navWrap.contains(e.target)) closeMenu();
    });
  }

  /* ── Active nav link on scroll ─────────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    const scrollMid = window.scrollY + window.innerHeight / 3;
    let active = null;
    sections.forEach(sec => { if (sec.offsetTop <= scrollMid) active = sec.id; });
    navAnchors.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${active}`);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ── Sticky bottom bar ─────────────────────────────────────────────────── */
  const stickyBar = document.getElementById('sticky-bar');
  if (stickyBar) {
    const hero = document.querySelector('.hero');
    if (hero) {
      // Show sticky bar the moment the hero scrolls out of view
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            stickyBar.classList.add('is-visible');
            stickyBar.setAttribute('aria-hidden', 'false');
          } else {
            stickyBar.classList.remove('is-visible');
            stickyBar.setAttribute('aria-hidden', 'true');
          }
        });
      }, { threshold: 0 });
      heroObserver.observe(hero);
    } else {
      // Fallback: no hero element — show after one viewport height
      let stickyVisible = false;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > window.innerHeight && !stickyVisible) {
          stickyVisible = true;
          stickyBar.classList.add('is-visible');
          stickyBar.setAttribute('aria-hidden', 'false');
        } else if (y <= window.innerHeight && stickyVisible) {
          stickyVisible = false;
          stickyBar.classList.remove('is-visible');
          stickyBar.setAttribute('aria-hidden', 'true');
        }
      }, { passive: true });
    }
  }

  /* ── FAQ accordion ─────────────────────────────────────────────────────── */
  const faqButtons = document.querySelectorAll('.faq-q');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      faqButtons.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('is-open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('is-open');
      }
    });
  });

  /* ── Mobile carousel dot tracking ─────────────────────────────────────── */
  const grid = document.getElementById('treatments-grid');
  const dots = document.querySelectorAll('.dot');
  if (grid && dots.length && window.innerWidth <= 640) {
    grid.addEventListener('scroll', () => {
      const cardWidth = grid.querySelector('.treatment-card').offsetWidth + 16;
      const idx = Math.round(grid.scrollLeft / cardWidth);
      dots.forEach((d, i) => d.classList.toggle('dot--active', i === idx));
    }, { passive: true });
  }

  /* ════════════════════════════════════════════════════════════════════════
     ANIMATIONS — only if user hasn't requested reduced motion
  ════════════════════════════════════════════════════════════════════════ */
  if (prefersReduced) return;

  /* ── 1. Hero image parallax ──────────────────────────────────────────── */
  /* ── Hero carousel auto-rotation ──────────────────────────────────── */
  const heroSlides = document.querySelectorAll('.hero-carousel-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');
  let heroIndex    = 0;
  let heroTimer    = null;

  function goToSlide(idx) {
    heroSlides[heroIndex].classList.remove('is-active');
    heroDots[heroIndex].classList.remove('is-active');
    heroIndex = (idx + heroSlides.length) % heroSlides.length;
    heroSlides[heroIndex].classList.add('is-active');
    heroDots[heroIndex].classList.add('is-active');
  }

  function startCarousel() {
    heroTimer = setInterval(() => goToSlide(heroIndex + 1), 6000);
  }

  function resetCarousel() {
    clearInterval(heroTimer);
    startCarousel();
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
      resetCarousel();
    });
  });

  if (heroSlides.length > 1) startCarousel();

  /* ── 2. Proof bar — count-up numbers ────────────────────────────────── */
  function countUp(el, target, suffix, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = isFloat
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Count-up: only animate purely numeric stats (50, 100) — leave text stats alone
  const proofObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('.proof-num');
      if (numEl) {
        const raw = numEl.textContent.trim();
        const numeric = parseFloat(raw);
        // Only animate if the entire content is a plain integer (no letters/symbols)
        if (!isNaN(numeric) && String(numeric) === raw) {
          countUp(numEl, numeric, '', 1200);
        }
        // All other stats (48h, 503A/B, MD, 100%, etc.) are left as-is
      }
      proofObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.proof-item').forEach(el => proofObserver.observe(el));

  /* ── 3. Generic reveal helper ────────────────────────────────────────── */
  // Sets initial hidden state and returns a function to reveal
  function prepReveal(el, opts = {}) {
    const {
      y = 28, x = 0, scale = 1, rotate = 0,
      opacity = 0, blur = 0,
      duration = 0.65, delay = 0, ease = 'cubic-bezier(0.16, 1, 0.3, 1)'
    } = opts;

    const transforms = [];
    if (y !== 0) transforms.push(`translateY(${y}px)`);
    if (x !== 0) transforms.push(`translateX(${x}px)`);
    if (scale !== 1) transforms.push(`scale(${scale})`);
    if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);

    el.style.opacity = opacity;
    el.style.transform = transforms.join(' ') || 'none';
    el.style.filter = blur > 0 ? `blur(${blur}px)` : '';
    el.style.transition = [
      `opacity ${duration}s ${ease} ${delay}s`,
      `transform ${duration}s ${ease} ${delay}s`,
      blur > 0 ? `filter ${duration}s ${ease} ${delay}s` : ''
    ].filter(Boolean).join(', ');
  }

  function reveal(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = '';
  }

  function makeObserver(threshold = 0.1, rootMargin = '0px 0px -32px 0px') {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          entry.target._revealObserver && entry.target._revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });
  }

  /* ── 4. Section labels — clip reveal (gold underline draws in) ───────── */
  document.querySelectorAll('.section-label, .hero-label').forEach((el, i) => {
    prepReveal(el, { y: 0, x: -12, opacity: 0, duration: 0.5, delay: 0.05 });
    const obs = makeObserver(0.2);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 5. Section headings — slide up with slight scale ───────────────── */
  document.querySelectorAll('.section-title, .treatments-intro h2, .pricing-intro h2, .hiw-intro h2').forEach(el => {
    prepReveal(el, { y: 36, scale: 0.97, opacity: 0, duration: 0.75, delay: 0.08 });
    const obs = makeObserver(0.15);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 6. Section body copy ────────────────────────────────────────────── */
  document.querySelectorAll('.section-sub, .treatments-intro p, .pricing-intro p').forEach(el => {
    prepReveal(el, { y: 20, opacity: 0, duration: 0.6, delay: 0.15 });
    const obs = makeObserver(0.15);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 7. Protocol cards — stagger + subtle tilt ───────────────────────── */
  document.querySelectorAll('.treatment-card').forEach((el, i) => {
    const delay = (i % 3) * 0.08; // reset stagger per row
    prepReveal(el, { y: 32, scale: 0.97, rotate: -0.8, opacity: 0, duration: 0.6, delay });
    const obs = makeObserver(0.08);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 8. Pricing cards — scale + blur ────────────────────────────────── */
  document.querySelectorAll('.pricing-card').forEach((el, i) => {
    prepReveal(el, { y: 24, scale: 0.95, blur: 4, opacity: 0, duration: 0.7, delay: i * 0.1 });
    const obs = makeObserver(0.08);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 9. How It Works steps ───────────────────────────────────────────── */
  document.querySelectorAll('.hiw-step').forEach((el, i) => {
    prepReveal(el, { y: 28, opacity: 0, duration: 0.6, delay: i * 0.09 });
    const obs = makeObserver(0.1);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 10. Testimonial cards — alternate slide from left/right ─────────── */
  document.querySelectorAll('.testimonial-card').forEach((el, i) => {
    const fromRight = i % 2 === 1;
    prepReveal(el, { y: 16, x: fromRight ? 24 : -24, opacity: 0, duration: 0.65, delay: i * 0.1 });
    const obs = makeObserver(0.08);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 11. Community stats ─────────────────────────────────────────────── */
  document.querySelectorAll('.community-stat').forEach((el, i) => {
    prepReveal(el, { y: 20, scale: 0.96, opacity: 0, duration: 0.55, delay: i * 0.08 });
    const obs = makeObserver(0.1);
    el._revealObserver = obs;
    obs.observe(el);
  });

  /* ── 12. Editorial — separate observer, Ken Burns on image ───────────── */
  const editorialInner = document.querySelector('.editorial-inner');
  if (editorialInner) {
    prepReveal(editorialInner, { y: 20, opacity: 0, duration: 0.8 });
    const editObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(editorialInner);
          editObs.unobserve(editorialInner);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px' });
    editObs.observe(editorialInner);
  }

  // Ken Burns: slow zoom on editorial background image
  const editImg = document.querySelector('.editorial-img');
  if (editImg) {
    editImg.style.transition = 'transform 8s cubic-bezier(0.25, 0, 0.75, 1)';
    editImg.style.transform = 'scale(1.0)';
    const kbObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          editImg.style.transform = 'scale(1.07)';
          kbObs.unobserve(editImg);
        }
      });
    }, { threshold: 0.01 });
    kbObs.observe(editImg);
  }

  /* ── 13. Photo strip — scale-in reveal ──────────────────────────────── */
  const photoStrip = document.querySelector('.photo-strip');
  if (photoStrip) {
    document.querySelectorAll('.photo-strip-img').forEach((el, i) => {
      prepReveal(el, { y: 0, scale: 1.06, opacity: 0, duration: 0.8, delay: i * 0.12 });
      const obs = makeObserver(0.15);
      el._revealObserver = obs;
      obs.observe(el);
    });
  }

  /* ── 14. Gold rule / divider lines — width draw-in ──────────────────── */
  document.querySelectorAll('.editorial-rule, .hero-bg-rule').forEach(el => {
    if (!el.closest('.editorial-inner')) {
      // Only animate standalone rules, not ones inside reveal containers
      el.style.transformOrigin = 'left center';
      el.style.transform = 'scaleX(0)';
      el.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s';
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.style.transform = 'scaleX(1)';
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    }
  });

  /* ── 15. Mobile scroll-progress gold line at top of screen ──────────── */
  if (isMobile()) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      width: 0%;
      background: linear-gradient(90deg, #7A6020, #B28A2A, #C9A040);
      z-index: 9999;
      pointer-events: none;
      transform-origin: left;
      transition: width 0.1s linear;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

})();
