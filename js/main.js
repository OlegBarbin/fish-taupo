/* Golden Hour Lakeside — envelope, scroll reveals, parallax, lightbox.
   No dependencies. Everything degrades if a piece is unsupported. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     Envelope
     --------------------------------------------------------------- */

  var envelope = document.getElementById('envelope');
  var openBtn = document.getElementById('open-btn');
  var card = document.getElementById('card');

  function showCard() {
    document.body.classList.remove('is-locked');
    card.setAttribute('aria-hidden', 'false');
  }

  function hideEnvelope() {
    envelope.classList.add('is-gone');
    envelope.setAttribute('aria-hidden', 'true');
  }

  function openEnvelope() {
    envelope.classList.add('is-open');
    showCard();
    try { sessionStorage.setItem('card-opened', '1'); } catch (e) { /* private mode */ }

    if (reduceMotion) {
      hideEnvelope();
    } else {
      // Fall back to a timer in case transitionend never fires.
      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        hideEnvelope();
      };
      envelope.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 1200);
    }
  }

  // Already opened this session (or reduced motion): skip the gate entirely.
  var alreadyOpened = false;
  try { alreadyOpened = sessionStorage.getItem('card-opened') === '1'; } catch (e) { /* ignore */ }

  if (alreadyOpened) {
    showCard();
    hideEnvelope();
  } else {
    openBtn.addEventListener('click', openEnvelope);
  }

  /* ---------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------- */

  var animated = document.querySelectorAll('[data-animate]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(animated, function (el) { el.classList.add('in-view'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(animated, function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     Hero parallax
     --------------------------------------------------------------- */

  var heroMedia = document.querySelector('.hero__media');

  if (heroMedia && !reduceMotion) {
    var ticking = false;

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        // Stop doing work once the hero has scrolled past.
        if (y < window.innerHeight) {
          heroMedia.style.transform = 'translate3d(0,' + (y * 0.25) + 'px,0)';
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Lightbox
     --------------------------------------------------------------- */

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lastFocused = null;

  function openLightbox(img) {
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    // Next frame, so the opacity transition actually runs.
    requestAnimationFrame(function () { lightbox.classList.add('is-shown'); });
    document.body.classList.add('is-locked');
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-shown');
    document.body.classList.remove('is-locked');
    setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.src = '';
    }, reduceMotion ? 0 : 300);
    if (lastFocused) lastFocused.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-lightbox]'), function (img) {
    img.addEventListener('click', function () { openLightbox(img); });
  });

  lightbox.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
