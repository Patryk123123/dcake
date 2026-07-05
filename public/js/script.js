(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * 1. Populate contact details from config.js (single source of truth)
   * ------------------------------------------------------------------ */
  function initContactDetails() {
    if (typeof CONTACT === "undefined") return;

    var waLink = "https://wa.me/" + CONTACT.whatsappNumber + "?text=" + encodeURIComponent(CONTACT.whatsappMessage);
    document.querySelectorAll(".js-whatsapp-link").forEach(function (el) {
      el.setAttribute("href", waLink);
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

    if (prefersReducedMotion) return;

    var cards = track.querySelectorAll(".testi-card");
    var ticking = false;

    function updateDepth() {
      var trackRect = track.getBoundingClientRect();
      var center = trackRect.left + trackRect.width / 2;
      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        var cardCenter = r.left + r.width / 2;
        var dist = Math.abs(center - cardCenter);
        var ratio = Math.min(1, dist / (trackRect.width / 2 + r.width / 2));
        card.style.transform = "scale(" + (1 - ratio * 0.08).toFixed(3) + ")";
        card.style.opacity = (1 - ratio * 0.35).toFixed(3);
      });
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
   * 6b. Process — scroll-filled timeline line (mobile)
   * ------------------------------------------------------------------ */
  function initProcessProgress() {
    if (prefersReducedMotion) return;
    var line = document.getElementById("process-progress-line");
    if (!line) return;
    var wrap = line.parentElement;
    var ticking = false;

    function update() {
      var rect = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height + vh;
      var progress = total > 0 ? (vh - rect.top) / total : 0;
      progress = Math.min(1, Math.max(0, progress));
      line.style.transform = "scaleY(" + progress.toFixed(3) + ")";
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
   * 7b. Hero — scroll-expanding video/image
   * ------------------------------------------------------------------ */
  function initHeroMediaExpand() {
    var section = document.getElementById("hero-media-section");
    var frame = document.getElementById("hero-media-frame");
    var video = document.getElementById("hero-video");
    if (!section || !frame) return;

    if (prefersReducedMotion) {
      section.classList.add("no-motion");
      frame.style.setProperty("--progress", 1);
    } else {
      var ticking = false;

      function update() {
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = rect.height - vh;
        var scrolled = -rect.top;
        var progress = total > 0 ? scrolled / total : 0;
        progress = Math.min(1, Math.max(0, progress));
        frame.style.setProperty("--progress", progress);
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

    if (video && "IntersectionObserver" in window) {
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
      observer.observe(section);
    }
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
    initHeroMediaExpand();
    initMediaToggle();
    initAccordion();
    initTestimonialCarousel();
    initLightbox();
    initBackToTop();
    initFooterYear();
  });
})();
