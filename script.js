/* ============================================================
   Rashi Aggarwal — Portfolio
   Interactions: loader, reveal-on-scroll, nav state,
   custom cursor, stat counters, parallax orbs, mobile menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.setTimeout(() => {
    loader.classList.add('is-hidden');
  }, 1100);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        window.setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  // Stagger items within the same parent container
  const staggerGroups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
    staggerGroups.get(parent).push(el);
  });

  staggerGroups.forEach((els) => {
    if (els.length > 1 && els.length <= 8) {
      els.forEach((el, idx) => {
        el.dataset.delay = String(idx * 90);
      });
    }
  });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Navbar: scrolled state + active section ---------- */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const sections = document.querySelectorAll('main .section, .hero');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-20% 0px -50% 0px'
  });

  sections.forEach((section) => {
    if (section.id) sectionObserver.observe(section);
  });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');

  burger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navMobile.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      burger.classList.remove('is-open');
    });
  });

  /* ---------- Stat counters ---------- */
  const statEls = document.querySelectorAll('.stat__value');

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.count.includes('.');
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target.toString();
      }
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach((el) => statObserver.observe(el));

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .card, .lcard, .stat, .timeline__content');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  } else {
    cursor.style.display = 'none';
  }

  /* ---------- Ambient orb parallax ---------- */
  const orbOne = document.querySelector('.bg-orb--one');
  const orbTwo = document.querySelector('.bg-orb--two');

  if (isFinePointer) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5);
      const yRatio = (e.clientY / window.innerHeight - 0.5);

      orbOne.style.transform = `translate(${xRatio * 30}px, ${yRatio * 30}px)`;
      orbTwo.style.transform = `translate(${xRatio * -36}px, ${yRatio * -36}px)`;
    }, { passive: true });
  }

  /* ---------- Smooth-scroll offset correction for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
