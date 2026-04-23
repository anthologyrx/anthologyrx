/* ============================================================
   ANTHOLOGY RX — PROTOCOL LANDING PAGE
   Interactions: nav scroll, hamburger, FAQ accordion,
   mobile bar dismiss, scroll animations, rail-pill hide
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── TOP STACK: keep body padding-top = exact stack height ──
  // ResizeObserver handles bar dismiss, text wrapping, font load, resize
  const topStack = document.getElementById('topStack');
  const announceBar = document.getElementById('announceBar');
  const announceClose = document.getElementById('announceClose');

  function syncBodyPad() {
    if (topStack) {
      document.body.style.paddingTop = topStack.offsetHeight + 'px';
    }
  }

  if (topStack) {
    const ro = new ResizeObserver(syncBodyPad);
    ro.observe(topStack);
    syncBodyPad(); // initial
  }

  if (announceClose && announceBar) {
    announceClose.addEventListener('click', () => {
      announceBar.classList.add('hidden');
      // ResizeObserver will fire automatically and re-sync padding
    });
  }

  // ─── NAV SCROLL SHADOW ────────────────────────────────
  const nav = document.querySelector('.nav');
  const updateNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ─── HAMBURGER TOGGLE ─────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── FAQ ACCORDION ────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => other.classList.remove('open'));

      // Toggle this one
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── MOBILE BAR DISMISS ───────────────────────────────
  const mobileBar = document.querySelector('.mobile-bar');
  const dismissBtn = document.querySelector('.mobile-bar__dismiss');

  if (dismissBtn && mobileBar) {
    dismissBtn.addEventListener('click', () => {
      mobileBar.classList.add('dismissed');
    });
  }

  // Hide mobile bar while hero is visible
  const hero = document.getElementById('hero');
  if (hero && mobileBar) {
    const heroObs = new IntersectionObserver(([entry]) => {
      if (window.innerWidth <= 768) {
        mobileBar.style.display = entry.isIntersecting ? 'none' : '';
      }
    }, { threshold: 0 });
    heroObs.observe(hero);
  }

  // ─── RIGHT RAIL PILL (desktop) ────────────────────────
  const railPill = document.querySelector('.hero__rail-pill');
  if (railPill && hero) {
    const railObs = new IntersectionObserver(([entry]) => {
      railPill.classList.toggle('hidden', entry.isIntersecting);
    }, { threshold: 0 });
    railObs.observe(hero);
  }

  // ─── SCROLL FADE-UP ANIMATIONS ────────────────────────
  const animTargets = document.querySelectorAll(
    '.outcome-stat, .benefit-card, .step, .avatar-item, ' +
    '.credential-badge, .position-card, .faq-item, ' +
    '.pricing__cta-card, .exclusion-card, ' +
    '.proof-card, .momentum-break__inner, .pricing__anchor-bar'
  );

  animTargets.forEach(el => el.classList.add('anim-up'));

  const animObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  animTargets.forEach(el => animObs.observe(el));

  // ─── ACTIVE NAV LINK ──────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--sand)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));

});
