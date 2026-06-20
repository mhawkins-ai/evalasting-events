/* EVALASTING EVENTS — interactions */
(function () {
  "use strict";

  /* ---- Apply site config (one source for phone, email, area, hours, socials) ---- */
  (function applyConfig() {
    var C = window.EE_CONFIG || {};
    document.querySelectorAll('[data-ee="phone-link"]').forEach(function (a) {
      if (C.phoneDisplay) a.textContent = C.phoneDisplay;
      if (C.phone) a.setAttribute("href", "tel:" + C.phone);
    });
    document.querySelectorAll('[data-ee="email-link"]').forEach(function (a) {
      if (C.email) { a.textContent = C.email; a.setAttribute("href", "mailto:" + C.email); }
    });
    function setText(key, val) {
      if (!val) return;
      document.querySelectorAll('[data-ee="' + key + '"]').forEach(function (e) { e.textContent = val; });
    }
    setText("area", C.area);
    setText("hours-foot", C.hoursShort);
    setText("hours-full", C.hoursFull);
    ["instagram", "facebook", "tiktok"].forEach(function (k) {
      if (!C[k]) return;
      document.querySelectorAll('[data-ee="' + k + '"]').forEach(function (a) { a.setAttribute("href", C[k]); });
    });
  })();

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var scrim = document.querySelector(".nav-scrim");
  function closeNav() { body.classList.remove("nav-open"); if (toggle) toggle.setAttribute("aria-expanded", "false"); }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (scrim) scrim.addEventListener("click", closeNav);
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Lightbox gallery ---- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbTitle = lb.querySelector(".lb-cap b");
    var lbDesc = lb.querySelector(".lb-cap span");
    var shots = Array.prototype.slice.call(document.querySelectorAll(".shot[data-full]"));
    var idx = 0;

    function show(i) {
      idx = (i + shots.length) % shots.length;
      var el = shots[idx];
      lbImg.src = el.getAttribute("data-full");
      lbImg.alt = el.getAttribute("data-alt") || "";
      if (lbTitle) lbTitle.textContent = el.getAttribute("data-title") || "";
      if (lbDesc) lbDesc.textContent = el.getAttribute("data-cat") ? " · " + el.getAttribute("data-cat") : "";
    }
    function open(i) { show(i); lb.classList.add("open"); body.style.overflow = "hidden"; lb.setAttribute("aria-hidden", "false"); }
    function close() { lb.classList.remove("open"); body.style.overflow = ""; lb.setAttribute("aria-hidden", "true"); }

    shots.forEach(function (el, i) {
      el.addEventListener("click", function () { open(i); });
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }
  /* ---- Inquiry form (routes to Go High Level via webhook) ---- */
  var iform = document.getElementById("inquiry-form");
  if (iform) {
    var statusEl = iform.querySelector(".form-status");
    var submitBtn = document.getElementById("inquiry-submit");
    var successPanel = document.getElementById("inquiry-success");
    var el = function (n) { return iform.elements[n]; };
    var val = function (n) { var e = el(n); return e ? String(e.value).trim() : ""; };

    function setInvalid(field, msg) {
      field.classList.add("invalid");
      var e = field.querySelector(".err");
      if (e) e.textContent = msg || "This field is required.";
    }

    iform.addEventListener("input", function (e) {
      var f = e.target.closest(".field");
      if (f) f.classList.remove("invalid");
    });

    function showSuccess() {
      iform.hidden = true;
      if (successPanel) { successPanel.hidden = false; successPanel.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }

    async function sendLead(url, payload) {
      var body = JSON.stringify(payload);
      try {
        await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: body });
        return true;
      } catch (err) {
        try {
          // Fallback for cross-origin response blocks — the POST still reaches GHL.
          await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: body });
          return true;
        } catch (err2) { return false; }
      }
    }

    iform.addEventListener("submit", async function (e) {
      e.preventDefault();
      statusEl.textContent = ""; statusEl.classList.remove("error");

      // honeypot: if filled, silently accept (bot) without sending
      if (val("company")) { showSuccess(); return; }

      // validate required fields
      var ok = true, firstBad = null;
      iform.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var v = String(input.value).trim();
        var bad = !v || (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        if (bad) {
          ok = false;
          setInvalid(field, input.type === "email" && v ? "Please enter a valid email address." : "This field is required.");
          if (!firstBad) firstBad = input;
        } else { field.classList.remove("invalid"); }
      });
      if (!ok) {
        if (firstBad) firstBad.focus();
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.classList.add("error");
        return;
      }

      var payload = {
        name: val("name"),
        email: val("email"),
        phone: val("phone"),
        event_type: val("event_type"),
        event_date: val("event_date"),
        guest_count: val("guest_count"),
        message: val("message"),
        consent: el("consent") && el("consent").checked ? "yes" : "no",
        source: "Evalasting Events website — Contact form",
        page: location.href,
        submitted_at: new Date().toISOString()
      };

      var url = window.EVALASTING_WEBHOOK_URL || "";
      var label = submitBtn.textContent;
      submitBtn.disabled = true; submitBtn.textContent = "Sending…";

      var sent = true;
      if (url) {
        sent = await sendLead(url, payload);
      } else {
        console.warn("EVALASTING: webhook URL not set — running in DEMO mode (nothing was sent). Set window.EVALASTING_WEBHOOK_URL in contact.html.");
      }

      submitBtn.disabled = false; submitBtn.textContent = label;
      if (sent) { showSuccess(); }
      else {
        statusEl.textContent = "Sorry, something went wrong sending your inquiry. Please call or email us and we’ll take care of it.";
        statusEl.classList.add("error");
      }
    });
  }
})();
