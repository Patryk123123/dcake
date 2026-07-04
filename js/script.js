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

    document.querySelectorAll(".js-email-link").forEach(function (el) {
      el.setAttribute("href", "mailto:" + CONTACT.email);
      if (el.tagName === "A" && el.children.length === 0) el.textContent = CONTACT.email;
    });

    document.querySelectorAll(".js-location-text").forEach(function (el) {
      el.textContent = CONTACT.locationLabel;
    });

    document.querySelectorAll(".js-location-short").forEach(function (el) {
      el.textContent = CONTACT.locationShort;
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
    var items = document.querySelectorAll(".reveal");
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
  }

  /* ------------------------------------------------------------------ *
   * 7. Gallery lightbox
   * ------------------------------------------------------------------ */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var closeBtn = document.getElementById("lightbox-close");
    var caption = document.getElementById("lightbox-caption");
    var items = document.querySelectorAll(".gallery-item");
    if (!lightbox || !closeBtn || !caption || !items.length) return;

    var lastFocused = null;

    function openLightbox(text) {
      lastFocused = document.activeElement;
      caption.textContent = text || "Photo";
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
        openLightbox(item.getAttribute("data-caption"));
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

  document.addEventListener("DOMContentLoaded", function () {
    initContactDetails();
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initAccordion();
    initTestimonialCarousel();
    initLightbox();
    initBackToTop();
    initFooterYear();
  });
})();
