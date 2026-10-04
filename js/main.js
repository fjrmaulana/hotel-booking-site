/* ==========================================================================
   Alba House — site behaviour (vanilla JavaScript, no libraries)

   Each block below is independent and only runs when its markup is on the
   page, so the same file is shared by all four pages:
     1. Header        menu button + background change on scroll
     2. Hero gallery  auto-playing background photos on the home page
     3. Gallery       category filter + lightbox
     4. Enquiry form  builds a WhatsApp / email message (no server needed)
     5. Map           loads Google Maps only when asked
     6. Footer year
   The site still works with JavaScript switched off: links, photos and the
   email form all have plain-HTML fallbacks.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Header ------------------------------------------------------------- */
  (function header() {
    var headerEl = document.querySelector("[data-header]");
    if (!headerEl) return;

    var toggle = headerEl.querySelector(".nav-toggle");
    var nav = headerEl.querySelector(".site-nav");

    function setOpen(open) {
      headerEl.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });
      // Close the menu with Escape, or after choosing a link
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && headerEl.classList.contains("is-open")) {
          setOpen(false);
          toggle.focus();
        }
      });
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) setOpen(false);
      });
    }

    // Solid white header once the page has scrolled a little
    function onScroll() {
      var scrolled = window.scrollY > 24;
      headerEl.classList.toggle("is-stuck", scrolled);
      document.body.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.5);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* 2. Hero gallery ------------------------------------------------------- */
  (function hero() {
    var heroEl = document.querySelector("[data-hero]");
    if (!heroEl) return;

    var slides = Array.prototype.slice.call(heroEl.querySelectorAll(".hero__slide"));
    var captionEl = heroEl.querySelector("[data-hero-caption]");
    var countEl = heroEl.querySelector("[data-hero-count]");
    var fill = heroEl.querySelector(".hero__progress-fill");
    var toggleBtn = heroEl.querySelector("[data-hero-toggle]");
    var current = 0;
    if (slides.length < 2) return;

    // Only the first photo is in the HTML as a real image. The rest are
    // fetched after the page has loaded, so they never slow the first paint.
    function loadSlide(slide) {
      if (slide.dataset.src) {
        if (slide.dataset.srcset) slide.srcset = slide.dataset.srcset;
        slide.src = slide.dataset.src;
        delete slide.dataset.src;
        delete slide.dataset.srcset;
      }
    }

    function restartProgress() {
      heroEl.classList.remove("is-playing");
      void fill.offsetWidth;               // forces the animation to restart
      heroEl.classList.add("is-playing");
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      loadSlide(slides[current]);
      loadSlide(slides[(current + 1) % slides.length]);   // warm up the next one
      captionEl.textContent = slides[current].dataset.caption || "";
      countEl.textContent = current + 1 + " / " + slides.length;
      if (!reduceMotion) restartProgress();
    }

    function setPaused(paused) {
      heroEl.classList.toggle("is-paused", paused);
      toggleBtn.setAttribute("aria-pressed", String(paused));
      toggleBtn.querySelector(".visually-hidden").textContent = paused ? "Play slideshow" : "Pause slideshow";
    }

    // The progress line doubles as the timer: when it is full, move on.
    fill.addEventListener("animationend", function () { show(current + 1); });

    heroEl.querySelector("[data-hero-prev]").addEventListener("click", function () { show(current - 1); });
    heroEl.querySelector("[data-hero-next]").addEventListener("click", function () { show(current + 1); });
    toggleBtn.addEventListener("click", function () {
      setPaused(!heroEl.classList.contains("is-paused"));
    });

    // Start once everything else has loaded. People who prefer reduced
    // motion get the arrows only: nothing moves by itself.
    function start() {
      loadSlide(slides[1]);
      countEl.textContent = "1 / " + slides.length;
      if (!reduceMotion) restartProgress();
    }
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start);
  })();

  /* 3. Gallery: filter + lightbox ----------------------------------------- */
  (function gallery() {
    var list = document.querySelector("[data-gallery]");
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll("li"));
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var statusEl = document.querySelector("[data-gallery-status]");

    // --- Filter buttons
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        var category = button.dataset.filter;
        var shown = 0;
        filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === button)); });
        items.forEach(function (item) {
          var match = category === "all" || item.dataset.category === category;
          item.hidden = !match;
          if (match) shown += 1;
        });
        if (statusEl) statusEl.textContent = shown + (shown === 1 ? " photo shown" : " photos shown");
      });
    });

    // --- Lightbox (uses the browser's own <dialog>, so focus is handled for us)
    var box = document.querySelector("[data-lightbox]");
    if (!box || typeof box.showModal !== "function") return;   // old browsers: links just open the photo

    var imgEl = box.querySelector(".lightbox__img");
    var captionEl = box.querySelector("[data-lightbox-caption]");
    var countEl = box.querySelector("[data-lightbox-count]");
    var visible = [];
    var index = 0;
    var opener = null;

    function render() {
      var link = visible[index];
      var thumb = link.querySelector("img");
      imgEl.src = link.href;
      imgEl.alt = thumb ? thumb.alt : "";
      captionEl.textContent = link.dataset.caption || "";
      countEl.textContent = index + 1 + " / " + visible.length;
    }
    function step(delta) {
      index = (index + delta + visible.length) % visible.length;
      render();
    }

    list.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      event.preventDefault();
      visible = items.filter(function (item) { return !item.hidden; })
                     .map(function (item) { return item.querySelector("a"); });
      index = visible.indexOf(link);
      opener = link;
      render();
      box.showModal();
    });

    box.querySelector("[data-lightbox-prev]").addEventListener("click", function () { step(-1); });
    box.querySelector("[data-lightbox-next]").addEventListener("click", function () { step(1); });
    box.querySelector("[data-lightbox-close]").addEventListener("click", function () { box.close(); });

    box.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    });
    // Click on the dark area (not the photo or a button) closes it
    box.addEventListener("click", function (event) {
      if (event.target === box || event.target.classList.contains("lightbox__stage")) box.close();
    });
    box.addEventListener("close", function () {
      imgEl.removeAttribute("src");
      if (opener) opener.focus();
    });

    // Swipe left / right on touch screens
    var startX = null;
    box.addEventListener("touchstart", function (event) { startX = event.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (event) {
      if (startX === null) return;
      var moved = event.changedTouches[0].clientX - startX;
      if (Math.abs(moved) > 50) step(moved > 0 ? -1 : 1);
      startX = null;
    });
  })();

  /* 4. Enquiry form ------------------------------------------------------- */
  (function enquiry() {
    var form = document.querySelector("[data-enquiry]");
    if (!form) return;

    // The hotel's number and address are read from the <form> tag in
    // contact.html (data-whatsapp and data-email), so edit them there.
    var whatsapp = form.dataset.whatsapp;
    var email = form.dataset.email;
    var hotel = form.dataset.hotel || "the hotel";
    var statusEl = form.querySelector("[data-form-status]");
    var checkIn = form.elements["check-in"];
    var checkOut = form.elements["check-out"];
    var roomField = form.elements.room;

    function isoDate(date) {
      var local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 10);
    }
    function niceDate(value) {
      var parts = value.split("-");
      var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }

    // Dates cannot be in the past, and check-out must follow check-in
    checkIn.min = isoDate(new Date());
    checkOut.min = checkIn.min;
    checkIn.addEventListener("change", function () {
      if (!checkIn.value) return;
      var next = new Date(checkIn.value + "T00:00:00");
      next.setDate(next.getDate() + 1);
      checkOut.min = isoDate(next);
      if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = "";
    });

    // "Ask about this room" links arrive as contact.html?room=Garden+Room
    var wanted = new URLSearchParams(window.location.search).get("room");
    if (wanted) {
      Array.prototype.forEach.call(roomField.options, function (option) {
        if (option.value === wanted) roomField.value = wanted;
      });
    }

    function setError(field, message) {
      var errorEl = document.getElementById(field.id + "-error");
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (!message) field.removeAttribute("aria-invalid");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = !message;
      }
    }

    function validate() {
      var firstBad = null;
      var checks = [
        [form.elements.name, !form.elements.name.value.trim() && "Enter your name."],
        [checkIn, !checkIn.value && "Choose a check-in date."],
        [checkOut, (!checkOut.value && "Choose a check-out date.") ||
                   (checkIn.value && checkOut.value <= checkIn.value && "Check-out must be after check-in.")]
      ];
      checks.forEach(function (check) {
        setError(check[0], check[1] || "");
        if (check[1] && !firstBad) firstBad = check[0];
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate()) {
        statusEl.textContent = "Please fix the fields marked above.";
        return;
      }

      var lines = [
        "Hello " + hotel + ", I'd like to ask about a stay.",
        "",
        "Name: " + form.elements.name.value.trim(),
        "Check-in: " + niceDate(checkIn.value),
        "Check-out: " + niceDate(checkOut.value),
        "Guests: " + form.elements.guests.value,
        "Room: " + roomField.value
      ];
      var note = form.elements.message.value.trim();
      if (note) lines.push("", note);
      var text = lines.join("\n");

      // Which of the two buttons was pressed?
      var via = event.submitter && event.submitter.value === "email" ? "email" : "whatsapp";
      if (via === "email") {
        window.location.href = "mailto:" + email +
          "?subject=" + encodeURIComponent("Booking enquiry from " + form.elements.name.value.trim()) +
          "&body=" + encodeURIComponent(text);
        statusEl.textContent = "Your email app is opening with the message filled in. Press send to reach us.";
      } else {
        window.open("https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        statusEl.textContent = "WhatsApp is opening with the message filled in. Press send to reach us.";
      }
    });
  })();

  /* 5. Map ---------------------------------------------------------------- */
  (function map() {
    var mapEl = document.querySelector("[data-map-src]");
    if (!mapEl) return;
    var button = mapEl.querySelector("button");
    if (!button) return;
    button.hidden = false;
    button.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = mapEl.dataset.mapSrc;
      frame.title = mapEl.dataset.mapTitle || "Map";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.allowFullscreen = true;
      mapEl.querySelector(".map__prompt").hidden = true;
      mapEl.appendChild(frame);
      frame.focus();
    });
  })();

  /* 6. Footer year -------------------------------------------------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
