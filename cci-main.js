/* =========================================================
   Creative Coaching International — Shared JS
   ========================================================= */

(function () {
  'use strict';

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function openMenu() {
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Dropdown keyboard/click support ── */
  document.querySelectorAll('.dropdown').forEach(dd => {
    const toggle = dd.querySelector('.dropdown__toggle');
    const menu   = dd.querySelector('.dropdown__menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = dd.classList.toggle('dropdown--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('dropdown--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard: Escape closes; Tab past last item closes
    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dd.classList.toggle('dropdown--open');
        toggle.setAttribute('aria-expanded', dd.classList.contains('dropdown--open') ? 'true' : 'false');
      }
    });
  });

  /* ── Active nav link ── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href], .dropdown__toggle[data-match]').forEach(el => {
    const href = el.getAttribute('href') || el.dataset.match || '';
    const file = href.split('/').pop();
    if (file === path) el.classList.add('active');
  });

  /* ── Testimonials carousel ── */
  const track = document.querySelector('.tcar-track');
  if (track) {
    const prevBtn = document.getElementById('tcarPrev');
    const nextBtn = document.getElementById('tcarNext');
    const dotsWrap = document.getElementById('tcarDots');

    function getCardWidth() {
      const card = track.querySelector('.tcar-card');
      if (!card) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 22;
      return card.offsetWidth + gap;
    }

    function getIndex() {
      const stride = getCardWidth();
      return stride > 0 ? Math.round(track.scrollLeft / stride) : 0;
    }

    function getCount() {
      return track.querySelectorAll('.tcar-card').length;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < getCount(); i++) {
        const btn = document.createElement('button');
        btn.className = 'tcar-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        btn.addEventListener('click', () => scrollTo(i));
        dotsWrap.appendChild(btn);
      }
    }

    function syncDots(idx) {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.tcar-dot').forEach((d, i) =>
        d.classList.toggle('active', i === idx)
      );
    }

    function scrollTo(idx) {
      track.scrollTo({ left: idx * getCardWidth(), behavior: 'smooth' });
      syncDots(idx);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
      const idx = Math.max(0, getIndex() - 1);
      scrollTo(idx);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const idx = Math.min(getCount() - 1, getIndex() + 1);
      scrollTo(idx);
    });

    track.addEventListener('scroll', () => syncDots(getIndex()), { passive: true });

    buildDots();

    // Keyboard on track
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Testimonials carousel');
    document.addEventListener('keydown', e => {
      if (document.activeElement && track.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); scrollTo(Math.max(0, getIndex() - 1)); }
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollTo(Math.min(getCount() - 1, getIndex() + 1)); }
      }
    });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item').forEach((item, i) => {
    const btn  = item.querySelector('.faq-btn');
    const body = item.querySelector('.faq-body');
    if (!btn || !body) return;

    // First item open by default
    if (i === 0) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', () => {
      const opening = !item.classList.contains('open');
      // Close siblings
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });
      if (opening) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Contact form ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const successEl = document.getElementById('formSuccess');
      if (successEl) {
        contactForm.style.display = 'none';
        successEl.style.display = 'flex';
        successEl.setAttribute('aria-live', 'polite');
      }
    });
  }

  /* ── Past Events Lightbox ── */
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxClose   = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (!lightboxOverlay || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      openLightbox(trigger.dataset.lightbox, trigger.dataset.alt || '');
    });
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(trigger.dataset.lightbox, trigger.dataset.alt || ''); }
    });
  });

  if (lightboxClose)  lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ── Intersection Observer for entrance animations ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rise');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-rise]').forEach(el => observer.observe(el));
  }

})();
