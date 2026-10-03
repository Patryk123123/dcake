(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var behavior = reduced ? "auto" : "smooth";

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* One rAF-throttled scroll loop shared by every scroll-driven piece. */
  var scrollHandlers = [];
  function onScrollFrame(fn) { scrollHandlers.push(fn); }
  (function () {
    var ticking = false;
    function run() { ticking = false; scrollHandlers.forEach(function (fn) { fn(); }); }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(run); } }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    window.addEventListener("load", request);
    document.addEventListener("DOMContentLoaded", request);
  })();

  /* ------------------------------------------------------------------ *
   * Contact details from config.js (index.html carries the same values)
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
        var s = document.createElement("span");
        s.textContent = h.days + ": " + h.time;
        el.appendChild(s);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Header background + scroll progress bar
   * ------------------------------------------------------------------ */
  function initHeaderAndProgress() {
    var header = document.getElementById("site-header");
    var bar = document.getElementById("scroll-progress");
    onScrollFrame(function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0).toFixed(4) + ")";
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Full-screen menu
   * ------------------------------------------------------------------ */
  function initMenu() {
    var toggle = document.getElementById("menu-toggle");
    var menu = document.getElementById("menu");
    if (!toggle || !menu) return;
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      root.classList.toggle("is-locked", open);
      root.classList.toggle("menu-open", open);
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add("is-open"); });
        var first = menu.querySelector("a");
        if (first) first.focus();
      } else {
        menu.classList.remove("is-open");
        menu.hidden = true;
      }
    }
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
  }

  /* ------------------------------------------------------------------ *
   * Growing grid: the section is pinned while the centre photo scales
   * until it covers the screen.
   * ------------------------------------------------------------------ */
  function initGrow() {
    var section = document.getElementById("grow");
    if (!section || reduced) return;
    root.classList.add("js-grow");
    var stage = section.querySelector(".grow-stage");
    var center = section.querySelector(".grow-center");
    // the grid is about to be seen: fetch its photos now instead of lazily mid-animation
    section.querySelectorAll("img").forEach(function (img) { img.loading = "eager"; });

    // offsetWidth/Height ignore transforms, so this is the untransformed tile size
    function measureScale() {
      var s = Math.max(window.innerWidth / center.offsetWidth, window.innerHeight / center.offsetHeight) * 1.02;
      stage.style.setProperty("--S", s.toFixed(3));
    }
    measureScale();
    window.addEventListener("resize", measureScale);
    window.addEventListener("load", measureScale);

    onScrollFrame(function () {
      var rect = section.getBoundingClientRect();
      var travel = section.offsetHeight - window.innerHeight;
      // hold the grid still for the first 15% so it reads as a grid before it grows
      var raw = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
      var p = clamp((raw - 0.15) / 0.75, 0, 1);
      p = p * p * (3 - 2 * p); // smoothstep
      stage.style.setProperty("--p", p.toFixed(4));
    });
  }

  /* ------------------------------------------------------------------ *
   * Story text: words light up as the paragraph passes through view
   * ------------------------------------------------------------------ */
  function initWordReveal() {
    var el = document.querySelector(".js-reveal-words");
    if (!el || reduced) return;
    var words = [];
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var span = document.createElement("span");
            span.className = "w";
            span.textContent = part;
            frag.appendChild(span);
            words.push(span);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          wrap(child);
        }
      });
    })(el);

    onScrollFrame(function () {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      // starts when the paragraph top reaches 85% of the screen, done when its bottom reaches 45%
      var progress = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1);
      var lit = progress * words.length;
      words.forEach(function (w, i) { w.style.opacity = (0.22 + 0.78 * clamp(lit - i, 0, 1)).toFixed(2); });
    });
  }

  /* ------------------------------------------------------------------ *
   * Carousels with a "03 / 10" counter
   * ------------------------------------------------------------------ */
  function initCarousel(track, prevBtn, nextBtn, counter, align, onActive) {
    if (!track) return;
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;

    function itemOffset(item) {
      if (align === "center") return item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
      return item.offsetLeft - (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0);
    }
    function activeIndex() {
      var best = 0, bestDist = Infinity;
      items.forEach(function (item, i) {
        var d = Math.abs(itemOffset(item) - track.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (align !== "center" && track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = items.length - 1;
      return best;
    }
    function go(i) { track.scrollTo({ left: itemOffset(items[clamp(i, 0, items.length - 1)]), behavior: behavior }); }
    function update() {
      var i = activeIndex();
      if (counter) counter.textContent = pad2(i + 1) + " / " + pad2(items.length);
      if (prevBtn) prevBtn.disabled = i === 0;
      if (nextBtn) nextBtn.disabled = i === items.length - 1;
      if (onActive) onActive(items, i);
    }
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    if (prevBtn) prevBtn.addEventListener("click", function () { go(activeIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(activeIndex() + 1); });
    update();
  }

  /* ------------------------------------------------------------------ *
   * Floating WhatsApp: after the hero, hidden while contact is on screen
   * ------------------------------------------------------------------ */
  function initFab() {
    var fab = document.querySelector(".fab-whatsapp");
    var hero = document.querySelector(".hero");
    var contact = document.querySelector(".contact-actions");
    if (!fab || !hero || !("IntersectionObserver" in window)) { if (fab) fab.classList.add("is-visible"); return; }
    var heroIn = true, contactIn = false;
    function update() { fab.classList.toggle("is-visible", !heroIn && !contactIn); }
    new IntersectionObserver(function (e) { heroIn = e[0].isIntersecting; update(); }, { rootMargin: "0px 0px -50% 0px" }).observe(hero);
    if (contact) new IntersectionObserver(function (e) { contactIn = e[0].isIntersecting; update(); }).observe(contact);
  }

  /* ------------------------------------------------------------------ *
   * WhatsApp exchange in Kontakt
   * ------------------------------------------------------------------ */
  function initChat() {
    var chat = document.getElementById("chat");
    var a = document.getElementById("chat-bubble-in");
    var b = document.getElementById("chat-bubble-out");
    var typing = document.getElementById("chat-typing");
    if (!chat || !a || !b) return;
    if (reduced || !("IntersectionObserver" in window)) { a.classList.add("is-visible"); b.classList.add("is-visible"); return; }
    var io = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      setTimeout(function () { a.classList.add("is-visible"); }, 150);
      setTimeout(function () { if (typing) typing.classList.add("is-active"); }, 900);
      setTimeout(function () { if (typing) typing.classList.remove("is-active"); b.classList.add("is-visible"); }, 1900);
    }, { threshold: 0.4 });
    io.observe(chat);
  }

  /* ------------------------------------------------------------------ *
   * FAQ accordion
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
   * Dialogs (native <dialog>: focus stays inside, Esc closes)
   * ------------------------------------------------------------------ */
  function openDialog(d) {
    if (typeof d.showModal !== "function") return;
    d.showModal();
    root.classList.add("is-locked");
  }
  function wireDialog(d) {
    d.addEventListener("close", function () { root.classList.remove("is-locked"); });
    d.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { d.close(); }); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  }

  function initLightbox() {
    var d = document.getElementById("lightbox");
    var img = document.getElementById("lightbox-img");
    var caption = document.getElementById("lightbox-caption");
    var count = document.getElementById("lightbox-count");
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    if (!d || !img || !items.length) return;
    wireDialog(d);
    var index = 0;
    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      img.src = "assets/img/" + item.getAttribute("data-full") + "-960.webp";
      img.alt = item.querySelector("img").alt;
      caption.textContent = item.querySelector(".gallery-caption").textContent;
      count.textContent = pad2(index + 1) + " / " + pad2(items.length);
    }
    items.forEach(function (item, i) { item.addEventListener("click", function () { show(i); openDialog(d); }); });
    d.querySelector(".lightbox-prev").addEventListener("click", function () { show(index - 1); });
    d.querySelector(".lightbox-next").addEventListener("click", function () { show(index + 1); });
    d.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    d.addEventListener("close", function () { items[index].focus(); });
    var sx = null, sy = null;
    var fig = d.querySelector(".lightbox-figure");
    fig.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    fig.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });
  }

  function initServiceModal() {
    var d = document.getElementById("service-modal");
    if (!d) return;
    wireDialog(d);
    var photos = document.getElementById("service-modal-photos");
    var title = document.getElementById("service-modal-title");
    var desc = document.getElementById("service-modal-desc");
    var cta = document.getElementById("service-modal-cta");
    var ctaLabel = document.getElementById("service-modal-cta-label");
    var last = null;
    document.querySelectorAll(".service-card").forEach(function (card) {
      var btn = card.querySelector(".service-open");
      var tpl = card.querySelector("template.service-details");
      if (!btn || !tpl) return;
      btn.addEventListener("click", function () {
        last = btn;
        var content = tpl.content.cloneNode(true);
        title.textContent = card.querySelector("h3").textContent;
        desc.textContent = "";
        photos.textContent = "";
        var imgs = content.querySelectorAll("img");
        imgs.forEach(function (src) {
          var img = document.createElement("img");
          img.src = "assets/img/" + src.getAttribute("data-src") + "-960.webp";
          img.width = src.width; img.height = src.height;
          img.alt = src.alt;
          img.decoding = "async";
          photos.appendChild(img);
        });
        photos.classList.toggle("has-many", imgs.length > 1);
        if (imgs.length > 1) {
          var hint = document.createElement("p");
          hint.className = "photo-hint";
          hint.textContent = "Przesuń zdjęcia w bok, żeby zobaczyć więcej (" + imgs.length + ").";
          desc.appendChild(hint);
        }
        content.querySelectorAll("p").forEach(function (p) { desc.appendChild(p); });
        ctaLabel.textContent = card.getAttribute("data-cta-label") || "Zapytaj na WhatsApp";
        if (typeof CONTACT !== "undefined") cta.href = waHref(card.getAttribute("data-wa-text"));
        photos.scrollLeft = 0;
        d.scrollTop = 0;
        openDialog(d);
      });
    });
    d.addEventListener("close", function () { if (last) last.focus(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initContactDetails();
    initHeaderAndProgress();
    initMenu();
    initGrow();
    initWordReveal();
    initCarousel(document.getElementById("gallery-track"), document.querySelector(".gallery-prev"), document.querySelector(".gallery-next"), document.getElementById("gallery-counter"), "start");
    initCarousel(document.getElementById("testi-track"), document.querySelector(".testi-prev"), document.querySelector(".testi-next"), document.getElementById("testi-counter"), "center",
      function (items, i) { items.forEach(function (it, k) { it.classList.toggle("is-active", k === i); }); });
    initFab();
    initChat();
    initAccordion();
    initLightbox();
    initServiceModal();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
