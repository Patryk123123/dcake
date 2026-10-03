(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * 1. Contact details from config.js (index.html carries the same
   *    values statically, so the page works and indexes without JS)
   * ------------------------------------------------------------------ */
  function waHref(message) {
    return "https://wa.me/" + CONTACT.whatsappNumber + "?text=" + encodeURIComponent(message || CONTACT.whatsappMessage);
  }

  function initContactDetails() {
    if (typeof CONTACT === "undefined") return;
    function each(sel, fn) { document.querySelectorAll(sel).forEach(fn); }

    each(".js-whatsapp-link", function (el) { el.href = waHref(el.getAttribute("data-wa-text")); });
    each(".js-instagram-link", function (el) { el.href = CONTACT.instagramUrl; });
    each(".js-facebook-link", function (el) { el.href = CONTACT.facebookUrl; });
    each(".js-google-link", function (el) { el.href = CONTACT.googleReviewsUrl; });
    each(".js-email-link", function (el) {
      el.href = "mailto:" + CONTACT.email;
      if (!el.children.length) el.textContent = CONTACT.email;
    });
    if (CONTACT.phone) {
      each(".js-phone-link", function (el) { el.href = "tel:" + CONTACT.phone; });
      each(".js-phone-text", function (el) { el.textContent = CONTACT.phoneDisplay; });
    }
    each(".js-location-text", function (el) { el.textContent = CONTACT.locationLabel; });
    each(".js-service-radius", function (el) { el.textContent = CONTACT.serviceRadius; });
    each(".js-hours", function (el) {
      el.textContent = "";
      CONTACT.hours.forEach(function (h) {
        var span = document.createElement("span");
        span.textContent = h.days + ": " + h.time;
        el.appendChild(span);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. Header shadow on scroll
   * ------------------------------------------------------------------ */
  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 3. Mobile nav drawer (closed drawer is visibility:hidden in CSS, so
   *    its links are out of the tab order)
   * ------------------------------------------------------------------ */
  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    var scrim = document.getElementById("nav-scrim");
    if (!toggle || !nav || !scrim) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      scrim.classList.toggle("is-visible", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var first = nav.querySelector("a");
        if (first) setTimeout(function () { first.focus(); }, 50);
      }
    }
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    scrim.addEventListener("click", function () { setOpen(false); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) { if (mq.matches) setOpen(false); });
  }

  /* ------------------------------------------------------------------ *
   * 4. Hero: scroll progress → --p (0..1). CSS turns it into the push-in
   *    on the cake and the copy lifting away. If a scroll-scrubbed video
   *    is added later (<video class="hero-video">), the same progress
   *    drives its currentTime.
   * ------------------------------------------------------------------ */
  function initHeroScroll() {
    var hero = document.querySelector(".hero");
    if (!hero || prefersReducedMotion) return;
    root.classList.add("js-hero-scroll");

    var video = hero.querySelector(".hero-video");
    var target = 0, current = 0, raf = null;

    var stage = hero.querySelector(".hero-stage");
    function measure() {
      // The stage is sticky below the header; progress runs over the extra
      // height the hero has beyond its stage.
      var headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 0;
      var travel = hero.offsetHeight - stage.offsetHeight;
      var scrolled = headerH - hero.getBoundingClientRect().top;
      target = travel > 0 ? Math.min(1, Math.max(0, scrolled / travel)) : 0;
    }
    function tick() {
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.0005) current = target;
      hero.style.setProperty("--p", current.toFixed(4));
      if (video && video.duration) video.currentTime = current * (video.duration - 0.05);
      raf = current === target ? null : requestAnimationFrame(tick);
    }
    function onScroll() {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    measure();
    current = target;
    hero.style.setProperty("--p", current.toFixed(4));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 5. Floating WhatsApp: shown once the hero is out of view
   * ------------------------------------------------------------------ */
  function initFab() {
    var fab = document.querySelector(".fab-whatsapp");
    var hero = document.querySelector(".hero");
    if (!fab || !hero || !("IntersectionObserver" in window)) { if (fab) fab.classList.add("is-visible"); return; }
    var heroVisible = true, footerVisible = false;
    function update() { fab.classList.toggle("is-visible", !heroVisible && !footerVisible); }
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      update();
    }, { rootMargin: "0px 0px -60% 0px" }).observe(hero);
    var contact = document.querySelector(".contact-actions");
    if (contact) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        update();
      }).observe(contact);
    }
  }

  /* ------------------------------------------------------------------ *
   * 6. Chat bubbles arrive like a real conversation (Kontakt)
   * ------------------------------------------------------------------ */
  function initChatAnimation() {
    var chat = document.getElementById("chat");
    var chatIn = document.getElementById("chat-bubble-in");
    var chatOut = document.getElementById("chat-bubble-out");
    var typing = document.getElementById("chat-typing");
    if (!chat || !chatIn || !chatOut) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      chatIn.classList.add("is-visible");
      chatOut.classList.add("is-visible");
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      setTimeout(function () { chatIn.classList.add("is-visible"); }, 150);
      setTimeout(function () { if (typing) typing.classList.add("is-active"); }, 900);
      setTimeout(function () {
        if (typing) typing.classList.remove("is-active");
        chatOut.classList.add("is-visible");
      }, 1900);
    }, { threshold: 0.4 });
    observer.observe(chat);
  }

  /* ------------------------------------------------------------------ *
   * 7. FAQ accordion
   * ------------------------------------------------------------------ */
  function initAccordion() {
    document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion-item");
        var open = !item.classList.contains("is-open");
        item.parentElement.querySelectorAll(".accordion-item.is-open").forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
          other.querySelector(".accordion-panel").style.maxHeight = "0px";
        });
        item.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));
        var panel = item.querySelector(".accordion-panel");
        panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 8. Horizontal carousels: dots (44px targets) + optional arrows
   * ------------------------------------------------------------------ */
  function initCarousel(track, dotsWrap, prevBtn, nextBtn, label) {
    if (!track) return;
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;
    var behavior = prefersReducedMotion ? "auto" : "smooth";

    function scrollToItem(i) {
      var item = items[Math.max(0, Math.min(items.length - 1, i))];
      var pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      track.scrollTo({ left: item.offsetLeft - track.offsetLeft - pad, behavior: behavior });
    }
    function activeIndex() {
      var pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      var x = track.scrollLeft + pad + 1;
      var best = 0, bestDist = Infinity;
      items.forEach(function (item, i) {
        var d = Math.abs(item.offsetLeft - track.offsetLeft - x);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    var dots = [];
    if (dotsWrap) {
      items.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", label + " " + (i + 1) + " z " + items.length);
        dot.addEventListener("click", function () { scrollToItem(i); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }
    function update() {
      var i = activeIndex();
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      dots.forEach(function (d, k) {
        var on = atEnd ? k === items.length - 1 : k === i;
        d.classList.toggle("is-active", on);
        if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      if (prevBtn) prevBtn.disabled = track.scrollLeft < 4;
      if (nextBtn) nextBtn.disabled = atEnd;
      if (dotsWrap) dotsWrap.hidden = track.scrollWidth <= track.clientWidth + 4;
    }
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollToItem(activeIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollToItem(activeIndex() + 1); });
    update();
  }

  /* ------------------------------------------------------------------ *
   * 9. Dialog helpers (native <dialog> handles focus trap + Esc)
   * ------------------------------------------------------------------ */
  function openDialog(dialog) {
    if (typeof dialog.showModal !== "function") return false;
    dialog.showModal();
    root.classList.add("has-dialog");
    return true;
  }
  function wireDialog(dialog) {
    dialog.addEventListener("close", function () { root.classList.remove("has-dialog"); });
    dialog.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", function () { dialog.close(); });
    });
    // Click on the backdrop (the dialog box itself, outside its content) closes it
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  }

  /* ------------------------------------------------------------------ *
   * 10. Gallery lightbox: arrows, keyboard, swipe, visible caption
   * ------------------------------------------------------------------ */
  function initLightbox() {
    var dialog = document.getElementById("lightbox");
    var img = document.getElementById("lightbox-img");
    var caption = document.getElementById("lightbox-caption");
    var count = document.getElementById("lightbox-count");
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    if (!dialog || !img || !items.length) return;
    wireDialog(dialog);
    var index = 0;

    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      var thumb = item.querySelector("img");
      img.src = "assets/img/" + item.getAttribute("data-full") + "-960.webp";
      img.alt = thumb.alt;
      caption.textContent = item.querySelector(".gallery-caption").textContent;
      count.textContent = (index + 1) + " / " + items.length;
    }
    items.forEach(function (item, i) {
      item.addEventListener("click", function () {
        show(i);
        openDialog(dialog);
      });
    });
    dialog.querySelector(".lightbox-prev").addEventListener("click", function () { show(index - 1); });
    dialog.querySelector(".lightbox-next").addEventListener("click", function () { show(index + 1); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    dialog.addEventListener("close", function () { items[index].focus(); });

    var startX = null, startY = null;
    var figure = dialog.querySelector(".lightbox-figure");
    figure.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
    figure.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 11. Oferta: details dialog with several photos per category
   * ------------------------------------------------------------------ */
  function initServiceModal() {
    var dialog = document.getElementById("service-modal");
    if (!dialog) return;
    wireDialog(dialog);
    var photos = document.getElementById("service-modal-photos");
    var title = document.getElementById("service-modal-title");
    var desc = document.getElementById("service-modal-desc");
    var cta = document.getElementById("service-modal-cta");
    var ctaLabel = document.getElementById("service-modal-cta-label");
    var lastCard = null;

    document.querySelectorAll(".service-card").forEach(function (card) {
      var button = card.querySelector(".service-open");
      var tpl = card.querySelector("template.service-details");
      if (!button || !tpl) return;
      button.addEventListener("click", function () {
        lastCard = button;
        var content = tpl.content.cloneNode(true);
        title.textContent = card.querySelector("h3").textContent;
        desc.textContent = "";
        photos.textContent = "";
        var imgs = content.querySelectorAll("img");
        imgs.forEach(function (src) {
          var img = document.createElement("img");
          var slug = src.getAttribute("data-src");
          img.src = "assets/img/" + slug + "-960.webp";
          img.width = src.width; img.height = src.height;
          img.alt = src.alt;
          img.decoding = "async";
          photos.appendChild(img);
        });
        photos.classList.toggle("has-many", imgs.length > 1);
        content.querySelectorAll("p").forEach(function (p) { desc.appendChild(p); });
        if (imgs.length > 1) {
          var hint = document.createElement("p");
          hint.className = "photo-hint";
          hint.textContent = "Przesuń zdjęcia w bok, żeby zobaczyć więcej (" + imgs.length + ").";
          desc.insertBefore(hint, desc.firstChild);
        }
        ctaLabel.textContent = card.getAttribute("data-cta-label") || "Zapytaj na WhatsApp";
        if (typeof CONTACT !== "undefined") cta.href = waHref(card.getAttribute("data-wa-text"));
        photos.scrollLeft = 0;
        dialog.scrollTop = 0;
        openDialog(dialog);
      });
    });
    dialog.addEventListener("close", function () { if (lastCard) lastCard.focus(); });
  }

  /* ------------------------------------------------------------------ *
   * 12. Process: scroll-filled timeline line (mobile)
   * ------------------------------------------------------------------ */
  function initProcessProgress() {
    if (prefersReducedMotion) return;
    var line = document.getElementById("process-progress-line");
    if (!line) return;
    var wrap = line.parentElement;
    var circles = wrap.querySelectorAll(".step-num");
    var TOP = 52, BOTTOM = 24; // must match .process-progress-line top/bottom in CSS
    var ticking = false;

    function update() {
      ticking = false;
      if (getComputedStyle(line).display === "none") return;
      var rect = wrap.getBoundingClientRect();
      var progress = rect.height > 0 ? (window.innerHeight * 0.85 - rect.top) / rect.height : 0;
      progress = Math.min(1, Math.max(0, progress));
      line.style.transform = "scaleY(" + progress.toFixed(3) + ")";
      var filledTo = rect.top + TOP + progress * (rect.height - TOP - BOTTOM);
      circles.forEach(function (c) {
        var r = c.getBoundingClientRect();
        c.classList.toggle("is-reached", r.top + r.height / 2 <= filledTo);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initContactDetails();
    initHeaderScroll();
    initMobileNav();
    initHeroScroll();
    initFab();
    initChatAnimation();
    initAccordion();
    initCarousel(document.getElementById("gallery-track"), document.getElementById("gallery-dots"),
      document.querySelector(".gallery-prev"), document.querySelector(".gallery-next"), "Zdjęcie");
    initCarousel(document.getElementById("testi-track"), document.getElementById("testi-dots"), null, null, "Opinia");
    initLightbox();
    initServiceModal();
    initProcessProgress();
    initFooterYear();
  });
})();
