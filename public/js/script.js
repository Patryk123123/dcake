(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * 1. Populate contact details from config.js (single source of truth)
   * ------------------------------------------------------------------ */
  function initContactDetails() {
    if (typeof CONTACT === "undefined") return;

    document.querySelectorAll(".js-whatsapp-link").forEach(function (el) {
      var message = el.getAttribute("data-wa-text") || CONTACT.whatsappMessage;
      el.setAttribute("href", "https://wa.me/" + CONTACT.whatsappNumber + "?text=" + encodeURIComponent(message));
    });

    document.querySelectorAll(".js-instagram-link").forEach(function (el) {
      el.setAttribute("href", CONTACT.instagramUrl);
      if (el.tagName === "A" && el.children.length === 0) el.textContent = CONTACT.instagramHandle;
    });

    document.querySelectorAll(".js-instagram-handle-text").forEach(function (el) {
      el.textContent = "Obserwuj " + CONTACT.instagramHandle;
    });

    document.querySelectorAll(".js-facebook-link").forEach(function (el) {
      el.setAttribute("href", CONTACT.facebookUrl);
    });

    document.querySelectorAll(".js-google-link").forEach(function (el) {
      el.setAttribute("href", CONTACT.googleReviewsUrl);
    });

    document.querySelectorAll(".js-email-link").forEach(function (el) {
      el.setAttribute("href", "mailto:" + CONTACT.email);
      if (el.tagName === "A" && el.children.length === 0) el.textContent = CONTACT.email;
    });

    document.querySelectorAll(".js-location-text").forEach(function (el) {
      el.textContent = CONTACT.locationLabel;
    });

    document.querySelectorAll(".js-service-radius").forEach(function (el) {
      el.textContent = CONTACT.serviceRadius;
    });

    document.querySelectorAll(".js-hours").forEach(function (el) {
      el.innerHTML = CONTACT.hours
        .map(function (h) { return "<span>" + h.days + ": " + h.time + "</span>"; })
        .join("");
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. Sticky header shrink/shadow on scroll
   * ------------------------------------------------------------------ */
  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 3. Mobile nav drawer
   * ------------------------------------------------------------------ */
  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    var scrim = document.getElementById("nav-scrim");
    if (!toggle || !nav || !scrim) return;

    function closeNav() {
      nav.classList.remove("is-open");
      scrim.classList.remove("is-visible");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openNav() {
      nav.classList.add("is-open");
      scrim.classList.add("is-visible");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    scrim.addEventListener("click", closeNav);
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. Scroll reveal animations
   * ------------------------------------------------------------------ */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal, .reveal-card");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = (i % 4) * 60;
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * 4b. Service cards — subtle cursor-tilt (desktop/mouse only)
   * ------------------------------------------------------------------ */
  function initCardTilt() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var cards = document.querySelectorAll(".service-card");
    cards.forEach(function (card) {
      function onMove(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateX = (y * -6).toFixed(2);
        var rotateY = (x * 6).toFixed(2);
        card.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px)";
      }
      function onLeave() {
        card.style.transform = "";
      }
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. FAQ accordion
   * ------------------------------------------------------------------ */
  function setPanelHeight(item, open) {
    var panel = item.querySelector(".accordion-panel");
    if (!panel) return;
    panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
  }

  function initAccordion() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion-item");
        var isOpen = item.classList.contains("is-open");

        item.parentElement.querySelectorAll(".accordion-item.is-open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
            setPanelHeight(openItem, false);
          }
        });

        item.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
        setPanelHeight(item, !isOpen);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 6. Testimonial carousel controls
   * ------------------------------------------------------------------ */
  function initTestimonialCarousel() {
    var track = document.getElementById("testi-track");
    var prevBtn = document.querySelector(".testi-prev");
    var nextBtn = document.querySelector(".testi-next");
    var dotsWrap = document.getElementById("testi-dots");
    if (!track || !prevBtn || !nextBtn) return;

    function scrollByCard(direction) {
      var card = track.querySelector(".testi-card");
      if (!card) return;
      var gap = 24;
      var amount = (card.getBoundingClientRect().width + gap) * direction;
      track.scrollBy({ left: amount, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    prevBtn.addEventListener("click", function () { scrollByCard(-1); });
    nextBtn.addEventListener("click", function () { scrollByCard(1); });

    var cards = track.querySelectorAll(".testi-card");

    /* Pagination dots — same "there's more, swipe" signal as the gallery,
       built regardless of reduced-motion (they're a static indicator, not
       an animation) so the two carousels feel like one consistent pattern. */
    if (dotsWrap && cards.length) {
      cards.forEach(function (card, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "testi-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Przejdź do opinii " + (i + 1) + " z " + cards.length);
        dot.addEventListener("click", function () {
          cards[i].scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
        });
        dotsWrap.appendChild(dot);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll(".testi-dot") : [];
    var ticking = false;

    function updateDepth() {
      var trackRect = track.getBoundingClientRect();
      var center = trackRect.left + trackRect.width / 2;
      var closestIndex = 0;
      var closestDist = Infinity;
      cards.forEach(function (card, i) {
        var r = card.getBoundingClientRect();
        var cardCenter = r.left + r.width / 2;
        var dist = Math.abs(center - cardCenter);
        if (dist < closestDist) { closestDist = dist; closestIndex = i; }
        if (!prefersReducedMotion) {
          var ratio = Math.min(1, dist / (trackRect.width / 2 + r.width / 2));
          card.style.transform = "scale(" + (1 - ratio * 0.08).toFixed(3) + ")";
          card.style.opacity = (1 - ratio * 0.35).toFixed(3);
        }
      });
      if (dots.length) dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === closestIndex); });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateDepth);
        ticking = true;
      }
    }
    updateDepth();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 6c. Gallery — coverflow carousel (drag/scroll sideways, pagination
   *     dots, prev/next arrows). Each card's tilt/scale/opacity is driven
   *     by its distance from the track's center, computed on scroll —
   *     a curved, "circular gallery" feel without a WebGL dependency.
   * ------------------------------------------------------------------ */
  function initGalleryCarousel() {
    var track = document.getElementById("gallery-track");
    var dotsWrap = document.getElementById("gallery-dots");
    if (!track) return;
    var items = track.querySelectorAll(".gallery-item");
    if (!items.length) return;

    /* Pagination dots */
    if (dotsWrap) {
      items.forEach(function (item, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Przejdź do zdjęcia " + (i + 1) + " z " + items.length);
        dot.addEventListener("click", function () {
          items[i].scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
        });
        dotsWrap.appendChild(dot);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll(".gallery-dot") : [];
    var ticking = false;

    function updateCurve() {
      var trackRect = track.getBoundingClientRect();
      var center = trackRect.left + trackRect.width / 2;
      var closestIndex = 0;
      var closestDist = Infinity;

      items.forEach(function (item, i) {
        var r = item.getBoundingClientRect();
        var itemCenter = r.left + r.width / 2;
        var dist = itemCenter - center;
        var absDist = Math.abs(dist);
        if (absDist < closestDist) { closestDist = absDist; closestIndex = i; }

        if (!prefersReducedMotion) {
          var norm = Math.max(-1, Math.min(1, dist / (trackRect.width / 2 + r.width / 2)));
          var scale = 1 - Math.abs(norm) * 0.22;
          var rotateY = norm * -24;
          var translateZ = -Math.abs(norm) * 70;
          item.style.transform = "perspective(1400px) translateZ(" + translateZ.toFixed(1) + "px) rotateY(" + rotateY.toFixed(1) + "deg) scale(" + scale.toFixed(3) + ")";
          item.style.opacity = (1 - Math.abs(norm) * 0.5).toFixed(3);
          item.style.zIndex = String(100 - Math.round(Math.abs(norm) * 100));
        }
      });
      if (dots.length) dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === closestIndex); });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { window.requestAnimationFrame(updateCurve); ticking = true; }
    }
    updateCurve();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    /* Prev/next arrows */
    var prevBtn = document.querySelector(".gallery-nav-prev");
    var nextBtn = document.querySelector(".gallery-nav-next");
    function scrollByItem(direction) {
      var item = track.querySelector(".gallery-item");
      if (!item) return;
      var gap = 24;
      var amount = (item.getBoundingClientRect().width + gap) * direction;
      track.scrollBy({ left: amount, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByItem(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByItem(1); });

    /* Pointer drag-to-scroll for mouse/pen — touch keeps native scrolling,
       which already feels better than a hijacked pointer-drag on phones.
       Move/up listeners live on window (not pointer capture) so a plain
       click still targets the item underneath the cursor as normal — pointer
       capture would silently redirect the resulting click to the track and
       break the per-item lightbox listeners. */
    var isDown = false, dragged = false, startX = 0, startScrollLeft = 0;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragged = true;
      track.scrollLeft = startScrollLeft - dx;
    });
    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("is-dragging");
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    /* Suppress the click-to-open-lightbox that would otherwise fire right
       after a drag release — registered on the track in the capture phase
       so it runs before each item's own (bubbling) click listener. */
    track.addEventListener("click", function (e) {
      if (dragged) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ------------------------------------------------------------------ *
   * 7. Gallery lightbox
   * ------------------------------------------------------------------ */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var lightboxPhoto = document.getElementById("lightbox-photo");
    var lightboxImg = document.getElementById("lightbox-img");
    var closeBtn = document.getElementById("lightbox-close");
    var caption = document.getElementById("lightbox-caption");
    var items = document.querySelectorAll(".gallery-item");
    if (!lightbox || !closeBtn || !caption || !items.length) return;

    var lastFocused = null;

    function openLightbox(item) {
      lastFocused = document.activeElement;
      caption.textContent = item.getAttribute("data-caption") || "Zdjęcie";

      var realImg = item.querySelector(".ph-photo-img");
      if (realImg && lightboxImg) {
        lightboxImg.src = realImg.src;
        lightboxImg.alt = realImg.alt;
        lightboxImg.classList.remove("is-hidden");
        if (lightboxPhoto) lightboxPhoto.classList.add("has-photo");
      } else if (lightboxImg) {
        lightboxImg.classList.add("is-hidden");
        if (lightboxPhoto) lightboxPhoto.classList.remove("has-photo");
      }

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        openLightbox(item);
      });
    });
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------ *
   * 7b. Oferta — service detail modal
   * ------------------------------------------------------------------ */
  function initServiceModal() {
    var modal = document.getElementById("service-modal");
    var photo = document.getElementById("service-modal-photo");
    var img = document.getElementById("service-modal-img");
    var closeBtn = document.getElementById("service-modal-close");
    var titleEl = document.getElementById("service-modal-title");
    var descEl = document.getElementById("service-modal-desc");
    var cta = document.getElementById("service-modal-cta");
    var ctaLabel = document.getElementById("service-modal-cta-label");
    var cards = document.querySelectorAll(".service-card");
    if (!modal || !closeBtn || !cards.length || typeof CONTACT === "undefined") return;

    var lastFocused = null;

    function openModal(card) {
      lastFocused = document.activeElement;

      titleEl.textContent = card.querySelector("h3").textContent;
      descEl.textContent = card.getAttribute("data-full-desc") || card.querySelector(".service-body p").textContent;
      ctaLabel.textContent = card.getAttribute("data-cta-label") || CONTACT.whatsappMessage;
      var message = card.getAttribute("data-wa-text") || CONTACT.whatsappMessage;
      cta.href = "https://wa.me/" + CONTACT.whatsappNumber + "?text=" + encodeURIComponent(message);

      var realImg = card.querySelector(".ph-photo-img");
      if (realImg && img) {
        img.src = realImg.src;
        img.alt = realImg.alt;
        img.classList.remove("is-hidden");
        if (photo) photo.classList.add("has-photo");
      } else if (img) {
        img.classList.add("is-hidden");
        if (photo) photo.classList.remove("has-photo");
      }

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        openModal(card);
      });
    });
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ------------------------------------------------------------------ *
   * 6b. Process — scroll-filled timeline line (mobile)
   * ------------------------------------------------------------------ */
  function initProcessProgress() {
    if (prefersReducedMotion) return;
    var line = document.getElementById("process-progress-line");
    if (!line) return;
    var wrap = line.parentElement;
    var circles = wrap.querySelectorAll(".step-num");
    var LINE_TOP_OFFSET = 52; // must match .process-progress-line { top: 52px } in CSS
    var LINE_BOTTOM_OFFSET = 24; // must match { bottom: 24px }
    var ticking = false;

    function update() {
      var rect = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      // Reaches 1 once the whole timeline has scrolled fully into view
      // (its bottom edge meets the viewport bottom), not only once it has
      // scrolled entirely back out — so the last step lights up as soon
      // as it's actually readable, not long after.
      var total = rect.height;
      var progress = total > 0 ? (vh - rect.top) / total : 0;
      progress = Math.min(1, Math.max(0, progress));
      line.style.transform = "scaleY(" + progress.toFixed(3) + ")";

      var fullLength = rect.height - LINE_TOP_OFFSET - LINE_BOTTOM_OFFSET;
      var filledToY = rect.top + LINE_TOP_OFFSET + progress * fullLength;
      circles.forEach(function (circle) {
        var cRect = circle.getBoundingClientRect();
        var centerY = cRect.top + cRect.height / 2;
        circle.classList.toggle("is-reached", centerY <= filledToY);
      });

      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 7b. Hero — pause the video while its panel is off-screen (perf only;
   *     the panel itself is static, no scroll-driven expand/resize).
   * ------------------------------------------------------------------ */
  function initHeroMediaPause() {
    var panel = document.getElementById("hero-media-panel");
    var video = document.getElementById("hero-video");
    if (!panel || !video || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (video.classList.contains("is-hidden")) return;
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(panel);
  }

  /* ------------------------------------------------------------------ *
   * 7c. Hero — video / image toggle
   * ------------------------------------------------------------------ */
  function initMediaToggle() {
    var toggle = document.getElementById("media-toggle");
    var label = document.getElementById("media-toggle-label");
    var video = document.getElementById("hero-video");
    var image = document.getElementById("hero-image");
    if (!toggle || !video || !image) return;

    var mode = prefersReducedMotion ? "image" : "video";

    function applyMode() {
      if (mode === "video") {
        video.classList.remove("is-hidden");
        image.classList.add("is-hidden");
        video.play().catch(function () {});
        if (label) label.textContent = "Zobacz zdjęcie";
        toggle.setAttribute("aria-pressed", "false");
      } else {
        video.classList.add("is-hidden");
        image.classList.remove("is-hidden");
        video.pause();
        if (label) label.textContent = "Zobacz wideo";
        toggle.setAttribute("aria-pressed", "true");
      }
    }

    toggle.addEventListener("click", function () {
      mode = mode === "video" ? "image" : "video";
      applyMode();
    });

    applyMode();

    // Belt-and-braces: some mobile browsers/OS power-saving modes block the
    // initial autoplay attempt even when muted+playsinline. If that happens,
    // the very first touch/scroll/click resumes it — effectively instant in
    // practice since visitors almost always scroll right away.
    function resumeIfStuck() {
      if (mode === "video" && video.paused) {
        video.play().catch(function () {});
      }
    }
    ["touchstart", "scroll", "click"].forEach(function (evt) {
      window.addEventListener(evt, resumeIfStuck, { passive: true, once: true });
    });
  }

  /* ------------------------------------------------------------------ *
   * 8. Back-to-top button
   * ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------ *
   * 9. Footer year
   * ------------------------------------------------------------------ */
  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------ *
   * 10. Photo slots — self-filling placeholders
   * Every [data-photo] element quietly checks whether the real file exists.
   * Drop a photo in with the exact filename from data-photo and it appears
   * automatically here (and in the gallery lightbox) — no code changes.
   * ------------------------------------------------------------------ */
  function initPhotoSlots() {
    document.querySelectorAll("[data-photo]").forEach(function (el) {
      var url = el.getAttribute("data-photo");
      var alt = el.getAttribute("data-photo-alt") || el.textContent.trim();
      var probe = new Image();
      probe.onload = function () {
        var img = document.createElement("img");
        img.src = url;
        img.alt = alt;
        img.loading = "lazy";
        img.decoding = "async";
        img.className = "ph-photo-img";
        el.appendChild(img);
        el.classList.add("has-photo");
      };
      probe.src = url;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initContactDetails();
    initPhotoSlots();
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initCardTilt();
    initProcessProgress();
    initHeroMediaPause();
    initMediaToggle();
    initAccordion();
    initTestimonialCarousel();
    initGalleryCarousel();
    initLightbox();
    initServiceModal();
    initBackToTop();
    initFooterYear();
  });
})();
