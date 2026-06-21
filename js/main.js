(function () {
  'use strict';

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      primaryNav.classList.toggle('open');
    });

    Array.prototype.forEach.call(primaryNav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('open');
      });
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Contact form — static site, no backend.
     Opens the visitor's mail client with the message prefilled.
  --------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  var contactNote = document.getElementById('contactFormNote');

  function setContactNote(text, state) {
    if (!contactNote) return;
    contactNote.textContent = text;
    contactNote.classList.remove('is-success', 'is-error');
    if (state) contactNote.classList.add(state);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot tripped — almost certainly a bot. Pretend it worked (don't tip
      // them off) but never actually send the request, so it doesn't count against
      // the Formspree quota.
      var honeypot = document.getElementById('cf-hp');
      if (honeypot && honeypot.value) {
        setContactNote('Thanks — your message is sent. I\u2019ll reply by email soon.', 'is-success');
        contactForm.reset();
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var formAction = contactForm.getAttribute('action') || '';
      var notConfigured = formAction.indexOf('YOUR_FORM_ID') !== -1;

      // The form owner hasn't plugged in a real Formspree endpoint yet — fail
      // immediately and clearly rather than silently posting to a dead URL.
      if (notConfigured) {
        setContactNote('Form isn\u2019t connected yet — please email me directly below.', 'is-error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setContactNote('Sending…');

      var formData = new FormData(contactForm);

      fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            setContactNote('Thanks — your message is sent. I\u2019ll reply by email soon.', 'is-success');
            contactForm.reset();
          } else {
            return response.json().then(function (data) {
              var detail = data && data.errors && data.errors.length
                ? data.errors.map(function (er) { return er.message; }).join(', ')
                : 'Something went wrong.';
              throw new Error(detail);
            });
          }
        })
        .catch(function () {
          setContactNote('Couldn\u2019t send that — please email me directly below instead.', 'is-error');
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  // Copy-email fallback: works even if the form backend isn't configured yet,
  // and doesn't depend on the visitor having a default mail client set up.
  var copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      var email = copyEmailBtn.getAttribute('data-email') || '';
      var done = function () {
        var original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(function () { copyEmailBtn.textContent = original; }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          window.prompt('Copy this email address:', email);
        });
      } else {
        window.prompt('Copy this email address:', email);
      }
    });
  }

  /* ---------------------------------------------------------
     Motion: scroll reveals + count-up
     Respects prefers-reduced-motion and degrades gracefully
     if the GSAP CDN fails to load.
  --------------------------------------------------------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapAvailable = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  function showFinalStatsState() {
    Array.prototype.forEach.call(document.querySelectorAll('.proof-number[data-count-to]'), function (el) {
      el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-suffix') || '');
    });
  }

  if (prefersReduced || !gsapAvailable) {
    // Fallback: reveal everything immediately, no animation.
    document.documentElement.classList.remove('js-ready');
    showFinalStatsState();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Generic fade/slide-in reveals */
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* Trace-tick "draw-in" — small signature touch synced to the eyebrow reveal */
  Array.prototype.forEach.call(document.querySelectorAll('.trace-tick'), function (el) {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.out',
        transformOrigin: 'left center',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  /* Count-up stat numbers in the proof strip */
  Array.prototype.forEach.call(document.querySelectorAll('.proof-number[data-count-to]'), function (el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: function () {
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: 'power1.out',
          onUpdate: function () {
            el.textContent = Math.round(counter.val) + suffix;
          }
        });
      }
    });
  });

  /* Sticky header — subtle elevation once the page scrolls past the hero */
  var header = document.getElementById('siteHeader');
  if (header) {
    ScrollTrigger.create({
      start: 100,
      onUpdate: function (self) {
        header.style.boxShadow = self.scroll() > 100 ? '0 8px 24px -16px rgba(0,0,0,0.5)' : 'none';
      }
    });
  }
})();
