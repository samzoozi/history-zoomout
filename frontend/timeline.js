(function () {
  "use strict";

  var DOMAIN_START = -3200;
  var DOMAIN_END = 1600;
  var BASE_PX_PER_YEAR = 0.62;
  var LABEL_WIDTH = 184;

  var ERAS = [
    { start: -3200, end: -1200, label: "Bronze Age" },
    { start: -1200, end: -500, label: "Iron Age" },
    { start: -500, end: 500, label: "Classical Antiquity" },
    { start: 500, end: 1000, label: "Early Middle Ages" },
    { start: 1000, end: 1450, label: "High Middle Ages" },
    { start: 1450, end: 1600, label: "Age of Contact" }
  ];

  var TICK_YEARS = [-3000, -2500, -2000, -1500, -1000, -500, 1, 500, 1000, 1500];

  var API_BASE = window.HISTORYZOOMOUT_API_BASE || "http://localhost:8000";

  var CIVS = [];

  function yearLabel(year) {
    return year <= 0 ? (Math.abs(year) + " BCE") : (year + " CE");
  }

  var state = { sig: "major", zoom: 1, selectedCivs: null };

  var lanesEl = document.getElementById("lanes");
  var axisTrack = document.getElementById("axisTrack");
  var eraOverlay = document.getElementById("eraOverlay");
  var trackEl = document.getElementById("track");
  var scroller = document.getElementById("scroller");
  var eraChipsEl = document.getElementById("eraChips");
  var zoomInput = document.getElementById("zoom");
  var zoomReadout = document.getElementById("zoomReadout");
  var eventCountEl = document.getElementById("eventCount");
  var eventCountEl2 = document.getElementById("eventCount2");
  var civCountEl = document.getElementById("civCount");
  var stageEl = document.getElementById("stage");
  var loadStateEl = document.getElementById("loadState");
  var civFilterEl = document.getElementById("civFilter");
  var civFilterToggle = document.getElementById("civFilterToggle");
  var civFilterPanel = document.getElementById("civFilterPanel");
  var civFilterList = document.getElementById("civFilterList");
  var civFilterCount = document.getElementById("civFilterCount");
  var civFilterAll = document.getElementById("civFilterAll");
  var civFilterClear = document.getElementById("civFilterClear");

  function pxPerYear() { return BASE_PX_PER_YEAR * state.zoom; }
  function yearToX(year) { return (year - DOMAIN_START) * pxPerYear(); }
  function trackWidth() { return (DOMAIN_END - DOMAIN_START) * pxPerYear(); }

  function totalEventCount() {
    var n = 0;
    CIVS.forEach(function (civ) { n += civ.events.length; });
    return n;
  }

  function buildEraChips() {
    var frag = document.createDocumentFragment();
    var full = document.createElement("button");
    full.type = "button";
    full.textContent = "Full Timeline";
    full.className = "active";
    full.addEventListener("click", function () { setEra(null, full); });
    frag.appendChild(full);

    ERAS.forEach(function (era) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = era.label;
      btn.addEventListener("click", function () { setEra(era, btn); });
      frag.appendChild(btn);
    });
    eraChipsEl.appendChild(frag);
  }

  function setEra(era, btnEl) {
    Array.prototype.forEach.call(eraChipsEl.children, function (c) { c.classList.remove("active"); });
    btnEl.classList.add("active");

    if (!era) {
      state.zoom = 1;
      zoomInput.value = "1";
      updateZoomReadout();
      render();
      scroller.scrollTo({ left: 0, top: 0, behavior: "smooth" });
      return;
    }
    var span = era.end - era.start;
    var viewportWidth = scroller.clientWidth - LABEL_WIDTH - 60;
    var targetZoom = Math.min(4, Math.max(0.6, viewportWidth / (span * BASE_PX_PER_YEAR)));
    state.zoom = targetZoom;
    zoomInput.value = String(targetZoom.toFixed(1));
    updateZoomReadout();
    render();
    var left = yearToX(era.start) - 24;
    scroller.scrollTo({ left: left, top: 0, behavior: "smooth" });
  }

  function updateZoomReadout() {
    zoomReadout.textContent = Math.round(state.zoom * 100) + "%";
  }

  function renderAxisAndEras() {
    var w = trackWidth();
    trackEl.style.width = (w + LABEL_WIDTH) + "px";
    axisTrack.innerHTML = "";
    TICK_YEARS.forEach(function (y) {
      if (y < DOMAIN_START || y > DOMAIN_END) return;
      var tick = document.createElement("div");
      tick.className = "tick";
      tick.style.left = yearToX(y) + "px";
      tick.innerHTML = '<span class="tick-mark"></span><span class="tick-label">' + yearLabel(y) + "</span>";
      axisTrack.appendChild(tick);
    });

    eraOverlay.style.left = LABEL_WIDTH + "px";
    eraOverlay.style.width = w + "px";
    eraOverlay.innerHTML = "";
    ERAS.forEach(function (era) {
      var band = document.createElement("div");
      band.className = "era-band";
      var left = yearToX(era.start);
      var right = yearToX(era.end);
      band.style.left = left + "px";
      band.style.width = (right - left) + "px";
      band.innerHTML = '<div class="era-fill"></div><span class="era-label">' + era.label + "</span>";
      eraOverlay.appendChild(band);
    });
  }

  function renderLanes() {
    lanesEl.innerHTML = "";
    CIVS.forEach(function (civ) {
      if (!state.selectedCivs.has(civ.id)) return;
      var colorVar = "var(--civ-" + civ.colorIndex + ")";

      var row = document.createElement("div");
      row.className = "lane-row";
      row.dataset.civId = civ.id;

      var label = document.createElement("div");
      label.className = "lane-label";
      label.style.setProperty("--civ-color", colorVar);
      label.innerHTML =
        '<span class="swatch-row"><span class="swatch"></span><span class="name">' + civ.name + "</span></span>" +
        '<span class="span">' + yearLabel(civ.start) + " – " + yearLabel(civ.end) + "</span>";

      var laneTrack = document.createElement("div");
      laneTrack.className = "lane-track";
      laneTrack.style.setProperty("--civ-color", colorVar);

      var line = document.createElement("div");
      line.className = "lane-line";
      var lx = yearToX(civ.start);
      var rx = yearToX(civ.end);
      line.style.left = lx + "px";
      line.style.width = Math.max(2, rx - lx) + "px";
      laneTrack.appendChild(line);

      civ.events.forEach(function (ev) {
        if (state.sig === "major" && ev.sig !== "major") return;
        var marker = document.createElement("button");
        marker.type = "button";
        marker.className = "marker" + (ev.sig === "major" ? " major" : "");
        marker.style.setProperty("--civ-color", colorVar);
        marker.style.left = yearToX(ev.year) + "px";
        marker.setAttribute("aria-pressed", "false");
        var evId = civ.id + "::" + ev.year;
        marker.dataset.evId = evId;
        marker.innerHTML =
          '<span class="dot"></span>' +
          '<span class="tip"><span class="tip-date">' + yearLabel(ev.year) + "</span>" + ev.title + "</span>";
        marker.addEventListener("click", function () { selectEvent(civ, ev, marker, colorVar); });
        laneTrack.appendChild(marker);
      });

      row.appendChild(label);
      row.appendChild(laneTrack);
      lanesEl.appendChild(row);
    });
  }

  function updateCivFilterCount() {
    civFilterCount.textContent = state.selectedCivs.size + "/" + CIVS.length;
  }

  function buildCivFilter() {
    civFilterList.innerHTML = "";
    CIVS.forEach(function (civ) {
      var item = document.createElement("label");
      item.className = "civ-filter-item";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          state.selectedCivs.add(civ.id);
        } else {
          state.selectedCivs.delete(civ.id);
        }
        updateCivFilterCount();
        renderLanes();
      });

      var swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.setProperty("--civ-color", "var(--civ-" + civ.colorIndex + ")");

      var name = document.createElement("span");
      name.textContent = civ.name;

      item.appendChild(checkbox);
      item.appendChild(swatch);
      item.appendChild(name);
      civFilterList.appendChild(item);
    });
    updateCivFilterCount();
  }

  function openCivFilter() {
    civFilterPanel.hidden = false;
    civFilterToggle.setAttribute("aria-expanded", "true");
  }
  function closeCivFilter() {
    civFilterPanel.hidden = true;
    civFilterToggle.setAttribute("aria-expanded", "false");
  }

  civFilterToggle.addEventListener("click", function () {
    if (civFilterPanel.hidden) openCivFilter(); else closeCivFilter();
  });
  document.addEventListener("click", function (e) {
    if (!civFilterEl.contains(e.target)) closeCivFilter();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCivFilter();
  });

  civFilterAll.addEventListener("click", function () {
    state.selectedCivs = new Set(CIVS.map(function (c) { return c.id; }));
    civFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = true; });
    updateCivFilterCount();
    renderLanes();
  });
  civFilterClear.addEventListener("click", function () {
    state.selectedCivs = new Set();
    civFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = false; });
    updateCivFilterCount();
    renderLanes();
  });

  function selectEvent(civ, ev, markerEl, colorVar) {
    document.querySelectorAll(".marker[aria-pressed='true']").forEach(function (m) {
      m.setAttribute("aria-pressed", "false");
    });
    markerEl.setAttribute("aria-pressed", "true");

    var empty = document.getElementById("detailEmpty");
    var content = document.getElementById("detailContent");
    empty.style.display = "none";
    content.classList.add("show");

    document.getElementById("detailEyebrow").style.setProperty("--eyebrow-color", colorVar);
    document.getElementById("detailCiv").textContent = civ.name;
    document.getElementById("detailDate").textContent = "· " + yearLabel(ev.year);
    document.getElementById("detailTitle").textContent = ev.title;
    document.getElementById("detailBody").textContent = ev.body;
    document.getElementById("detailTag").textContent = ev.sig === "major" ? "Landmark event" : "Related event";

    var panel = document.getElementById("detailPanel");
    panel.classList.add("open");
  }

  document.getElementById("detailClose").addEventListener("click", function () {
    document.getElementById("detailPanel").classList.remove("open");
  });

  document.querySelectorAll(".segmented button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".segmented button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      state.sig = btn.dataset.sig;
      render();
    });
  });

  zoomInput.addEventListener("input", function () {
    state.zoom = parseFloat(zoomInput.value);
    updateZoomReadout();
    render();
  });

  (function enableDragScroll() {
    var isDown = false, startX = 0, startY = 0, startScrollX = 0, startScrollY = 0;
    scroller.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".marker") || e.target.closest(".lane-label")) return;
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      startScrollX = scroller.scrollLeft;
      startScrollY = scroller.scrollTop;
      scroller.classList.add("grabbing");
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      scroller.scrollLeft = startScrollX - (e.clientX - startX);
      scroller.scrollTop = startScrollY - (e.clientY - startY);
    });
    function up() { isDown = false; scroller.classList.remove("grabbing"); }
    scroller.addEventListener("pointerup", up);
    scroller.addEventListener("pointercancel", up);
  })();

  function render() {
    renderAxisAndEras();
    renderLanes();
  }

  function init() {
    if (eventCountEl) eventCountEl.textContent = String(totalEventCount());
    if (eventCountEl2) eventCountEl2.textContent = String(totalEventCount());
    if (civCountEl) civCountEl.textContent = String(CIVS.length);

    state.selectedCivs = new Set(CIVS.map(function (c) { return c.id; }));
    buildCivFilter();
    buildEraChips();
    render();

    loadStateEl.hidden = true;
    stageEl.hidden = false;
  }

  fetch(API_BASE + "/topics?category=civilization")
    .then(function (res) {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    })
    .then(function (data) {
      CIVS = data;
      init();
    })
    .catch(function (err) {
      loadStateEl.textContent = "Couldn't load the timeline — is the API running at " + API_BASE + "? (" + err.message + ")";
      loadStateEl.classList.add("error");
    });
})();
