/* ============================================================================
   ShowMe Digital Agency — shared site behavior
   Vanilla JS, no dependencies, no inline scripts (CSP: script-src 'self').
   Progressive enhancement: every link works without JS; the region switcher
   is plain ?region= links handled by the edge worker.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA_NUMBER = '13364572361';
  var EMAIL = 'info@showmeworld.app';
  var root = document.documentElement;
  root.classList.add('js');

  /* ---- Analytics beacons (cookieless daily counters) ---------------------- */
  function track(event) {
    try {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event }),
        keepalive: true
      });
    } catch (_) { /* analytics must never break the page */ }
  }
  track('pageview');
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (link) track('whatsapp_click');
  }, { passive: true });

  /* ---- Header state ------------------------------------------------------- */
  var topbar = document.querySelector('.topbar');
  function onScroll() { if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Navigation: mobile menu + dropdowns -------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navPanel = document.getElementById('navPanel');
  function closeMenus(except) {
    document.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach(function (t) {
      if (t !== except) t.setAttribute('aria-expanded', 'false');
    });
  }
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navPanel.classList.toggle('open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
  }
  document.querySelectorAll('.nav-trigger').forEach(function (t) {
    t.addEventListener('click', function () {
      var open = t.getAttribute('aria-expanded') === 'true';
      closeMenus(t);
      t.setAttribute('aria-expanded', String(!open));
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.has-menu')) closeMenus(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.nav-trigger[aria-expanded="true"]');
    closeMenus(null);
    if (open) open.focus();
    if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      navToggle.setAttribute('aria-expanded', 'false');
      navPanel.classList.remove('open');
      document.body.classList.remove('nav-open');
      navToggle.focus();
    }
  });

  /* ---- Lead / consultation forms ------------------------------------------ */
  function setupLeadForm(form) {
    var submitButton = form.querySelector('[type="submit"]');
    var formStatus = form.querySelector('.form-status');
    var emailAlt = form.querySelector('.email-alternative');
    var kind = form.getAttribute('data-kind') || 'Inquiry';

    // Extra fields are appended into `message` so the worker needs no change
    // (the stored lead keeps its existing shape; `need` stays short because
    // the worker caps it at 80 characters).
    var EXTRA_LABELS = {
      role: 'Role',
      industry: 'Industry',
      company_size: 'Company size',
      office_tools: 'Email and office tools',
      interests: 'Areas of interest',
      it_setup: 'Current IT setup',
      it_setup_notes: 'IT setup notes',
      timeline: 'Timeline',
      services: 'Services of interest',
      challenge: 'Biggest challenge',
      consent: 'OK to review public website and domain info'
    };

    function val(name) {
      var els = form.querySelectorAll('[name="' + name + '"]');
      if (!els.length) return '';
      if (els[0].type === 'checkbox') {
        var out = [];
        els.forEach(function (c) { if (c.checked) out.push(c.value); });
        return out.join(', ');
      }
      return String(els[0].value).trim();
    }

    function buildMessage() {
      var base = val('message');
      var parts = base ? [base] : [];
      Object.keys(EXTRA_LABELS).forEach(function (name) {
        var v = val(name);
        if (v) parts.push(EXTRA_LABELS[name] + ': ' + v);
      });
      return parts.join(' | ');
    }

    function values() {
      return {
        name: val('name'),
        business: val('business'),
        email: val('email'),
        phone: val('phone'),
        need: (val('need') || kind).slice(0, 80),
        message: buildMessage(),
        // Digital-presence-check form only (`website` is a honeypot, so the
        // real URL is `site_url`). Empty values are ignored by the worker.
        site_url: val('site_url'),
        found_via: val('found_via'),
        time_waster: val('time_waster'),
        page: window.location.pathname
      };
    }

    function enquiryText(v) {
      return kind + ' — ShowMe Digital Agency | Name: ' + v.name +
        ' | Company: ' + v.business + ' | Email: ' + v.email +
        ' | Phone: ' + v.phone + ' | Topic: ' + v.need +
        (v.site_url ? ' | Website: ' + v.site_url : '') + ' | Details: ' + v.message;
    }

    function clearErrors() {
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      form.querySelectorAll('.field-error[id]').forEach(function (er) { er.textContent = ''; });
    }
    function setError(input, message) {
      var field = input.closest('.field');
      if (!field) return;
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      var er = field.querySelector('.field-error[id]');
      if (er) er.textContent = message;
    }
    function validate() {
      clearErrors();
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var firstInvalid = null;
      if (name && !name.value.trim()) { setError(name, 'Please enter your name.'); firstInvalid = name; }
      if (email && !email.value.trim()) { setError(email, 'Please enter your email.'); firstInvalid = firstInvalid || email; }
      else if (email && !email.validity.valid) { setError(email, 'Please enter a valid email address.'); firstInvalid = firstInvalid || email; }
      form.querySelectorAll('input[type="checkbox"][required]').forEach(function (c) {
        if (!c.checked) { setError(c, 'Please tick this box to continue.'); firstInvalid = firstInvalid || c; }
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    function showSuccess(v) {
      var panel = document.createElement('div');
      panel.className = 'form-success';
      panel.setAttribute('role', 'status');
      panel.setAttribute('tabindex', '-1');
      var h = document.createElement('h3');
      h.textContent = 'Request received.';
      var p = document.createElement('p');
      p.textContent = 'Thank you, ' + (v.name || 'there') + '. We have your details and will reply to ' + v.email + ' within one business day to arrange next steps.';
      panel.appendChild(h); panel.appendChild(p);
      form.replaceWith(panel);
      panel.focus({ preventScroll: true });
    }

    function fallback(v) {
      if (formStatus) {
        formStatus.textContent = 'We could not reach our server. Please email ' + EMAIL + ' (your details are ready in the email link below) or message us on WhatsApp.';
        formStatus.classList.add('visible');
      }
      if (emailAlt) emailAlt.href = mailtoFor(v);
    }

    function mailtoFor(v) {
      return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(kind + ' — ' + (v.business || v.name || 'ShowMe')) + '&body=' + encodeURIComponent(enquiryText(v));
    }

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('has-error')) {
        field.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
        var er = field.querySelector('.field-error[id]');
        if (er) er.textContent = '';
      }
      if (formStatus) formStatus.classList.remove('visible');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var v = values();
      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) { showSuccess(v); return; }
      if (submitButton) { submitButton.disabled = true; submitButton.dataset.label = submitButton.innerHTML; submitButton.textContent = 'Sending…'; }
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v)
      }).then(function (res) {
        if (res.status !== 200) throw new Error('Lead request failed');
        return res.json();
      }).then(function (result) {
        if (!result || result.ok !== true) throw new Error('Lead request failed');
        track('lead_submitted');
        showSuccess(v);
      }).catch(function () {
        if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = submitButton.dataset.label || 'Send'; }
        fallback(v);
      });
    });

    if (emailAlt) {
      emailAlt.addEventListener('click', function () { emailAlt.href = mailtoFor(values()); });
    }
    // WhatsApp stays a secondary channel: prefill it with the form so far.
    var waAlt = form.querySelector('.whatsapp-alternative');
    if (waAlt) {
      waAlt.addEventListener('click', function () {
        waAlt.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(enquiryText(values()));
      });
    }
  }
  document.querySelectorAll('form[data-lead-form]').forEach(setupLeadForm);

  /* ---- Subtle reveal on first view (skipped for reduced motion) ----------- */
  if (!reduced && 'IntersectionObserver' in window) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    var vh = window.innerHeight;
    items = items.filter(function (el) { return el.getBoundingClientRect().top > vh; });
    items.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
    window.setTimeout(function () { items.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  }

  /* ---- Current year -------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
