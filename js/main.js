/* =========================================================
   Jr Data Comms — Main JavaScript
   ========================================================= */
(function () {
  'use strict';

  // 1. Mobile navigation
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // 2. Header scroll state
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3. Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  // 4. Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const validators = {
      name: v => v.trim().length >= 2 || 'Please enter your full name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
      phone: v => v.trim().length >= 7 || 'Please enter a valid phone number.',
      service: v => v.trim() !== '' || 'Please choose a service.',
      message: v => v.trim().length >= 10 || 'Please provide a few details (at least 10 characters).'
    };

    function showError(field, message) {
      const el = form.querySelector('[data-error-for="' + field + '"]');
      const input = form.querySelector('[name="' + field + '"]');
      if (el) { el.textContent = message; el.classList.add('show'); }
      if (input) input.classList.add('invalid');
    }
    function clearError(field) {
      const el = form.querySelector('[data-error-for="' + field + '"]');
      const input = form.querySelector('[name="' + field + '"]');
      if (el) { el.textContent = ''; el.classList.remove('show'); }
      if (input) input.classList.remove('invalid');
    }
    function validateField(field) {
      const input = form.querySelector('[name="' + field + '"]');
      if (!input || !validators[field]) return true;
      const result = validators[field](input.value);
      if (result === true) { clearError(field); return true; }
      showError(field, result); return false;
    }

    Object.keys(validators).forEach(function (field) {
      const input = form.querySelector('[name="' + field + '"]');
      if (!input) return;
      input.addEventListener('blur', function () { validateField(field); });
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) validateField(field);
      });
      input.addEventListener('change', function () { validateField(field); });
    });

    const consent = form.querySelector('#consent');
    function validateConsent() {
      if (!consent) return true;
      if (consent.checked) { clearError('consent'); return true; }
      showError('consent', 'Please tick the box to continue.'); return false;
    }
    if (consent) consent.addEventListener('change', function () { if (consent.checked) clearError('consent'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      Object.keys(validators).forEach(f => { if (!validateField(f)) valid = false; });
      if (!validateConsent()) valid = false;

      if (!valid) {
        if (status) { status.textContent = 'Please fix the highlighted fields and try again.'; status.className = 'form-status error'; }
        const firstInvalid = form.querySelector('.invalid, .field-error.show');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const action = form.getAttribute('action') || '';
      if (action.indexOf('your-form-id') !== -1) {
        if (status) {
          status.textContent = 'Form is not yet connected. Please email jrakem58@gmail.com or call +44 7459 320219 directly.';
          status.className = 'form-status error';
        }
        const body = [
          'Name: ' + form.querySelector('#name').value.trim(),
          'Company: ' + form.querySelector('#company').value.trim(),
          'Email: ' + form.querySelector('#email').value.trim(),
          'Phone: ' + form.querySelector('#phone').value.trim(),
          'Service: ' + form.querySelector('#service').value,
          '', form.querySelector('#message').value.trim()
        ].join('\n');
        window.location.href = 'mailto:jrakem58@gmail.com?subject=' +
          encodeURIComponent('Website enquiry from ' + form.querySelector('#name').value.trim()) +
          '&body=' + encodeURIComponent(body);
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.original = submitBtn.innerHTML; submitBtn.innerHTML = 'Sending…'; }
      if (status) { status.textContent = ''; status.className = 'form-status'; }

      fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (status) { status.textContent = 'Thanks — your enquiry has been sent. We\'ll be in touch within 24 hours.'; status.className = 'form-status success'; }
            Object.keys(validators).forEach(clearError); clearError('consent');
          } else { throw new Error('Form submission failed'); }
        })
        .catch(function () {
          if (status) { status.textContent = 'Something went wrong. Please email jrakem58@gmail.com or call +44 7459 320219.'; status.className = 'form-status error'; }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitBtn.dataset.original; }
        });
    });
  }

  // 5. Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 6. Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const quicknav = document.querySelector('.services-quicknav');
      const quicknavH = quicknav ? quicknav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - quicknavH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.pushState(null, '', href);
    });
  });
})();