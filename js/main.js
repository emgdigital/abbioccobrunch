/* ============================================================
   ABBIOCCO BRUNCH — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ───────────────────────────────
  const navbar = document.querySelector('.navbar');
  const waFloat = document.querySelector('.whatsapp-float');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    waFloat?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // ── Active nav link ────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h   = sec.offsetHeight;
      const id  = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── Mobile menu ────────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const spans = hamburger?.querySelectorAll('span');

  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
    if (spans) {
      spans[0].style.transform = open ? 'rotate(45deg) translate(4px, 5px)' : '';
      spans[1].style.opacity   = open ? '0' : '1';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(4px, -5px)' : '';
    }
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      if (spans) { spans[0].style.transform = spans[2].style.transform = ''; spans[1].style.opacity = '1'; }
    });
  });

  // ── Scroll reveal ──────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i % 4;
    observer.observe(el);
  });

  // ── Email pop-up (shows after 8s, once per session) ──
  const popup = document.getElementById('email-popup');
  const popupClose = document.getElementById('popup-close');

  if (popup && !sessionStorage.getItem('popup-dismissed')) {
    setTimeout(() => popup.classList.add('active'), 8000);
  }

  popupClose?.addEventListener('click', () => {
    popup.classList.remove('active');
    sessionStorage.setItem('popup-dismissed', '1');
  });

  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('active');
      sessionStorage.setItem('popup-dismissed', '1');
    }
  });

  // ── Booking form ───────────────────────────────────────
  const bookingForm = document.getElementById('booking-form');
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.getElementById('booking-success');
    if (success) {
      success.style.display = 'block';
      bookingForm.reset();
      setTimeout(() => success.style.display = 'none', 5000);
    }
  });

  // ── Email form ─────────────────────────────────────────
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = '✓ Subscrit!';
        btn.style.background = '#2C6E2E';
        setTimeout(() => {
          btn.textContent = 'Subscriu-me';
          btn.style.background = '';
          form.reset();
        }, 3000);
      }
      if (popup) {
        popup.classList.remove('active');
        sessionStorage.setItem('popup-dismissed', '1');
      }
    });
  });

  // ── Loyalty stamp animation ────────────────────────────
  const stamps = document.querySelectorAll('.stamp');
  const progressFill = document.querySelector('.loyalty-progress-fill');
  const filled = document.querySelectorAll('.stamp.filled').length;

  const stampObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stamps.forEach((stamp, i) => {
          setTimeout(() => stamp.style.transform = 'scale(1.15)', i * 120);
          setTimeout(() => stamp.style.transform = '', i * 120 + 200);
        });
        if (progressFill) {
          progressFill.style.width = '0';
          setTimeout(() => progressFill.style.width = (filled / stamps.length * 100) + '%', 400);
        }
        stampObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const loyaltyCard = document.querySelector('.loyalty-card-visual');
  if (loyaltyCard) stampObserver.observe(loyaltyCard);

  // ── Smooth scroll for anchor links ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Set min date for booking ───────────────────────────
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // ── Cookie Consent Banner ─────────────────────────────
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');

  if (cookieBanner && !localStorage.getItem('cookie-consent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1200);
  }

  function dismissCookieBanner(choice) {
    if (!cookieBanner) return;
    localStorage.setItem('cookie-consent', choice);
    cookieBanner.classList.remove('visible');
  }

  cookieAccept?.addEventListener('click', () => dismissCookieBanner('accepted'));
  cookieReject?.addEventListener('click', () => dismissCookieBanner('rejected'));

});
