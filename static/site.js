// Mobile menu, work filter, gallery lightbox, draft enquiry form. No dependencies.
(function () {
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Work filter: buttons carry data-filter, cards carry data-cat.
  var filters = document.querySelectorAll(".filters button");
  if (filters.length) {
    var cards = document.querySelectorAll("[data-cat]");
    function apply(cat) {
      filters.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.filter === cat ? "true" : "false"); });
      cards.forEach(function (c) { c.hidden = !(cat === "all" || c.dataset.cat === cat); });
    }
    filters.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.dataset.filter);
        try { history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname : "#" + b.dataset.filter); } catch (e) {}
      });
    });
    var start = (location.hash || "").slice(1);
    if (start && document.querySelector('.filters button[data-filter="' + start + '"]')) apply(start);
  }

  // Lightbox over every .zoom button on a project page.
  var zooms = Array.prototype.slice.call(document.querySelectorAll(".zoom"));
  var lb = document.getElementById("lb");
  if (zooms.length && lb && lb.showModal) {
    var img = lb.querySelector("img"), cap = lb.querySelector("p"), cur = 0;
    function show(i) {
      cur = (i + zooms.length) % zooms.length;
      var z = zooms[cur];
      img.src = z.dataset.full; img.alt = z.dataset.alt || "";
      cap.textContent = z.dataset.caption || "";
    }
    zooms.forEach(function (z, i) { z.addEventListener("click", function () { show(i); lb.showModal(); }); });
    lb.querySelector(".x").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".pv").addEventListener("click", function () { show(cur - 1); });
    lb.querySelector(".nx").addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.open) return;
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  // Copy-to-clipboard buttons (the email address on Start a job).
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.dataset.copy, done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectAddr(); });
      } else { selectAddr(); }
    });
  });
  function selectAddr() {
    var el = document.getElementById("addr"); if (!el) return;
    var r = document.createRange(); r.selectNodeContents(el);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }

  // Draft form: until the Tally form is connected, explain instead of sending.
  var form = document.getElementById("enquiry");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".ok");
      if (ok) { ok.style.display = "block"; ok.focus(); }
    });
  }
})();
