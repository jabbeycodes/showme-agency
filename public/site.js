/* ============================================================================
   ShowMe Digital Agency — shared site behaviour
   Vanilla JS, no dependencies. Progressive enhancement: the site works without
   it (links, native form submit fall back to the /api/lead endpoint).
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA_NUMBER = '13364572361';
  var EMAIL = 'josh@showmeworld.app';

  /* ---- Analytics beacons (pageview / lead_submitted / whatsapp_click) ---- */
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
  window.__smeTrack = track;
  track('pageview');

  // Count clicks on any WhatsApp link once.
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (link) track('whatsapp_click');
  }, { passive: true });

  /* ---- Scroll progress + sticky header state ----------------------------- */
  var progress = document.querySelector('.scroll-progress');
  var topbar = document.querySelector('.topbar');
  var ticking = false;
  function updateScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var value = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, value)) + ')';
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 12);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();

  /* ---- Mobile navigation + mega menus ------------------------------------ */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  function closeMobileNav() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('mobile-open');
    document.body.style.overflow = '';
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('mobile-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
  }

  // Dropdown / mega-menu triggers
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.nav-trigger'));
  function closeAllMenus(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var menu = document.getElementById(t.getAttribute('aria-controls'));
      if (menu) menu.classList.remove('open');
    });
  }
  triggers.forEach(function (trigger) {
    var menu = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!menu) return;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var open = trigger.getAttribute('aria-expanded') === 'true';
      closeAllMenus(trigger);
      trigger.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open', !open);
    });
    // Hover open on fine-pointer / wide screens
    var li = trigger.closest('li');
    if (li && window.matchMedia('(min-width: 821px)').matches) {
      li.addEventListener('mouseenter', function () {
        if (window.matchMedia('(min-width: 821px)').matches) {
          closeAllMenus(trigger);
          trigger.setAttribute('aria-expanded', 'true');
          menu.classList.add('open');
        }
      });
      li.addEventListener('mouseleave', function () {
        if (window.matchMedia('(min-width: 821px)').matches) {
          trigger.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
        }
      });
    }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-links')) closeAllMenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAllMenus(); closeMobileNav(); }
  });

  /* ---- FAQ accordion ------------------------------------------------------ */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var expanded = q.getAttribute('aria-expanded') === 'true';
      var item = q.closest('.faq-item');
      var answer = document.getElementById(q.getAttribute('aria-controls'));
      q.setAttribute('aria-expanded', String(!expanded));
      if (item) item.classList.toggle('open', !expanded);
      if (answer) answer.style.maxHeight = !expanded ? answer.scrollHeight + 'px' : '0px';
    });
  });

  /* ---- Lead forms (contact, home, free-audit) ---------------------------- */
  function setupLeadForm(form) {
    var submitButton = form.querySelector('[type="submit"]');
    var formStatus = form.querySelector('.form-status');
    var emailAlt = form.querySelector('.email-alternative');
    var successTarget = form; // replaced on success

    // Extra fields appended into `message` so the existing worker still accepts.
    var EXTRA_LABELS = {
      services: 'Services of interest',
      challenge: 'Biggest challenge',
      budget: 'Budget band',
      timeline: 'Timeline'
    };

    function val(name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? String(el.value).trim() : '';
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
        need: val('need'),
        message: buildMessage(),
        // Free-audit form only (the `website` input is a honeypot, so the real
        // URL is `site_url`). Empty values are ignored by the worker.
        site_url: val('site_url'),
        found_via: val('found_via'),
        time_waster: val('time_waster'),
        page: window.location.pathname
      };
    }

    function enquiryText(v) {
      return 'New enquiry — ShowMe Digital Agency | Name: ' + v.name +
        ' | Business: ' + v.business + ' | Email: ' + v.email +
        ' | Phone: ' + v.phone + ' | Needs: ' + v.need +
        (v.site_url ? ' | Website: ' + v.site_url : '') + ' | Message: ' + v.message;
    }

    function clearErrors() {
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      form.querySelectorAll('.field-error').forEach(function (er) { if (!er.hasAttribute('aria-hidden')) er.textContent = ''; });
    }
    function setError(input, message) {
      var field = input.closest('.field');
      if (!field) return;
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      var er = field.querySelector('.field-error');
      if (er && !er.hasAttribute('aria-hidden')) er.textContent = message;
    }
    function validate() {
      clearErrors();
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var firstInvalid = null;
      if (name && !name.value.trim()) { setError(name, 'Please enter your name.'); firstInvalid = name; }
      if (email && !email.value.trim()) { setError(email, 'Please enter your email.'); firstInvalid = firstInvalid || email; }
      else if (email && !email.validity.valid) { setError(email, 'Please enter a valid email address.'); firstInvalid = firstInvalid || email; }
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    function showSuccess(v) {
      var panel = document.createElement('div');
      panel.className = 'contact-success';
      panel.setAttribute('role', 'status');
      panel.setAttribute('tabindex', '-1');
      var h = document.createElement('h3');
      h.textContent = 'Request received.';
      var p = document.createElement('p');
      p.textContent = 'Thanks ' + (v.name || 'there') + ' — we\u2019ve got your details and will reply to ' + v.email + ' within one business day.';
      panel.appendChild(h); panel.appendChild(p);
      successTarget.replaceWith(panel);
      panel.focus({ preventScroll: true });
    }

    function openWhatsApp(v) {
      track('whatsapp_click');
      if (formStatus) { formStatus.textContent = "Couldn't reach our server — opening WhatsApp instead."; formStatus.classList.add('visible'); }
      window.location.assign('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(enquiryText(v)));
    }

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('has-error')) {
        field.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
        var er = field.querySelector('.field-error:not([aria-hidden])');
        if (er) er.textContent = '';
      }
      if (formStatus) formStatus.classList.remove('visible');
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validate()) return;
      var v = values();
      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) { showSuccess(v); return; }
      if (submitButton) { submitButton.disabled = true; submitButton.dataset.label = submitButton.innerHTML; submitButton.innerHTML = 'Sending…'; }
      try {
        var res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(v)
        });
        var result = res.status === 200 ? await res.json() : null;
        if (res.status !== 200 || !result || result.ok !== true) throw new Error('Lead request failed');
        track('lead_submitted');
        showSuccess(v);
      } catch (err) {
        if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = submitButton.dataset.label || 'Send'; }
        openWhatsApp(v);
      }
    });

    if (emailAlt) {
      emailAlt.addEventListener('click', function () {
        var v = values();
        var subject = 'Website enquiry — ' + (v.name || 'ShowMe');
        emailAlt.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(enquiryText(v));
      });
    }
  }
  document.querySelectorAll('form[data-lead-form]').forEach(setupLeadForm);

  /* ---- Reveal on scroll --------------------------------------------------- */
  if (!reduced) {
    document.documentElement.classList.add('motion-ready');
    var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    var groupCounts = new Map();
    revealItems.forEach(function (el) {
      if (el.style.getPropertyValue('--i')) return;
      var group = el.parentElement;
      var count = groupCounts.get(group) || 0;
      el.style.setProperty('--i', Math.min(count, 6));
      groupCounts.set(group, count + 1);
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      revealItems.forEach(function (el) { io.observe(el); });
      // Safety net: reveal everything after 2s in case observer misses.
      window.setTimeout(function () { revealItems.forEach(function (el) { el.classList.add('is-visible'); }); }, 2000);
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---- Current year in footer -------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
