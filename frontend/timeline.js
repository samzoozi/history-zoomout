(function () {
  "use strict";

  var DOMAIN_PADDING_YEARS = 60;
  var BASE_PX_PER_YEAR = 0.62;
  var LABEL_WIDTH = 184;
  var SIDEBAR_GUTTER = 360; // scroll room so the open detail panel never covers the timeline's end
  var AUTO_TICK_TARGET_COUNT = 8;
  var AUTO_TICK_MIN_PX_SPACING = 100; // at zoom=1x, so "1900 CE"-style labels never crowd each other
  var NICE_TICK_STEPS_YEARS = [10, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 25000];

  // Per-category timeline rendering config. `civilization` keeps the original
  // curated eras/ticks/domain; any category not listed here gets a domain
  // fitted purely to its data (no artificial floor) with no era-band overlay
  // and auto-generated round-number ticks (see generateTicks).
  var CATEGORY_TIMELINE_CONFIG = {
    civilization: {
      domainStart: -3200,
      domainEnd: 1600,
      eras: [
        { start: -3200, end: -1200, label: "Bronze Age" },
        { start: -1200, end: -500, label: "Iron Age" },
        { start: -500, end: 500, label: "Classical Antiquity" },
        { start: 500, end: 1000, label: "Early Middle Ages" },
        { start: 1000, end: 1450, label: "High Middle Ages" },
        { start: 1450, end: 1600, label: "Age of Contact" }
      ],
      tickYears: [-3000, -2500, -2000, -1500, -1000, -500, 1, 500, 1000, 1500]
    }
  };
  var DEFAULT_TIMELINE_CONFIG = {
    domainStart: Infinity,
    domainEnd: -Infinity,
    eras: [],
    tickYears: null // null means auto-generate from the fitted domain
  };

  function getCategory() {
    return new URLSearchParams(window.location.search).get("category") || "civilization";
  }

  var CATEGORY = getCategory();
  var TIMELINE_CONFIG = CATEGORY_TIMELINE_CONFIG[CATEGORY] || DEFAULT_TIMELINE_CONFIG;
  var CATEGORY_LABEL = CATEGORY.charAt(0).toUpperCase() + CATEGORY.slice(1);

  var DOMAIN_START = TIMELINE_CONFIG.domainStart;
  var DOMAIN_END = TIMELINE_CONFIG.domainEnd;
  var ERAS = TIMELINE_CONFIG.eras;
  var TICK_YEARS = TIMELINE_CONFIG.tickYears;

  var API_BASE = window.HISTORYZOOMOUT_API_BASE || "http://localhost:8000";

  var TOPICS = [];

  function yearLabel(year) {
    return year <= 0 ? (Math.abs(year) + " BCE") : (year + " CE");
  }

  // Pick a round-number tick step (10/25/50/100/250/500/1000-year style)
  // for categories without curated tickYears. Balances two constraints: land
  // close to AUTO_TICK_TARGET_COUNT ticks across the domain, but never pick a
  // step so small that adjacent "1900 CE"-style labels would crowd each
  // other at the current zoom.
  function pickTickStep(span) {
    var roughStep = span / AUTO_TICK_TARGET_COUNT;
    for (var i = 0; i < NICE_TICK_STEPS_YEARS.length; i++) {
      var step = NICE_TICK_STEPS_YEARS[i];
      if (step >= roughStep && step * pxPerYear() >= AUTO_TICK_MIN_PX_SPACING) {
        return step;
      }
    }
    return NICE_TICK_STEPS_YEARS[NICE_TICK_STEPS_YEARS.length - 1];
  }

  function generateTicks(start, end) {
    var span = end - start;
    if (span <= 0) return [Math.round(start)];
    var step = pickTickStep(span);
    var first = Math.ceil(start / step) * step;
    var ticks = [];
    for (var y = first; y <= end; y += step) {
      ticks.push(Math.round(y));
    }
    return ticks;
  }

  var state = { sig: "all", zoom: 1, selectedTopics: null };

  var lanesEl = document.getElementById("lanes");
  var axisTrack = document.getElementById("axisTrack");
  var eraOverlay = document.getElementById("eraOverlay");
  var trackEl = document.getElementById("track");
  var scroller = document.getElementById("scroller");
  var zoomInput = document.getElementById("zoom");
  var zoomReadout = document.getElementById("zoomReadout");
  var eventCountEl = document.getElementById("eventCount");
  var topicCountEl = document.getElementById("topicCount");
  var stageEl = document.getElementById("stage");
  var loadStateEl = document.getElementById("loadState");
  var topicFilterEl = document.getElementById("topicFilter");
  var topicFilterToggle = document.getElementById("topicFilterToggle");
  var topicFilterLabel = document.getElementById("topicFilterLabel");
  var topicFilterPanel = document.getElementById("topicFilterPanel");
  var topicFilterList = document.getElementById("topicFilterList");
  var topicFilterCount = document.getElementById("topicFilterCount");
  var topicFilterAll = document.getElementById("topicFilterAll");
  var topicFilterClear = document.getElementById("topicFilterClear");
  var navToggle = document.getElementById("navToggle");
  var navScrim = document.getElementById("navScrim");
  var navDrawer = document.getElementById("navDrawer");
  var navClose = document.getElementById("navClose");
  var navList = document.getElementById("navList");

  function pxPerYear() { return BASE_PX_PER_YEAR * state.zoom; }
  function yearToX(year) { return (year - DOMAIN_START) * pxPerYear(); }
  function trackWidth() { return (DOMAIN_END - DOMAIN_START) * pxPerYear(); }

  function fitDomainToData() {
    if (!TOPICS.length) return;
    var minStart = TOPICS.reduce(function (m, t) { return Math.min(m, t.start); }, DOMAIN_START);
    var maxEnd = TOPICS.reduce(function (m, t) { return Math.max(m, t.end); }, DOMAIN_END);
    DOMAIN_START = minStart - DOMAIN_PADDING_YEARS;
    DOMAIN_END = maxEnd + DOMAIN_PADDING_YEARS;
    if (!TICK_YEARS) {
      TICK_YEARS = generateTicks(DOMAIN_START, DOMAIN_END);
    }
  }

  function totalEventCount() {
    var n = 0;
    TOPICS.forEach(function (topic) { n += topic.events.length; });
    return n;
  }

  function updateZoomReadout() {
    zoomReadout.textContent = Math.round(state.zoom * 100) + "%";
  }

  function renderAxisAndEras() {
    var w = trackWidth();
    trackEl.style.width = (w + LABEL_WIDTH + SIDEBAR_GUTTER) + "px";
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
    ERAS.forEach(function (era, i) {
      var band = document.createElement("div");
      band.className = "era-band";
      // Stretch the outermost eras' fill to the (possibly padded) domain edges
      // so shading has no gap, while keeping the label anchored to the era's real start.
      var boundStart = i === 0 ? Math.min(era.start, DOMAIN_START) : era.start;
      var boundEnd = i === ERAS.length - 1 ? Math.max(era.end, DOMAIN_END) : era.end;
      var left = yearToX(boundStart);
      var right = yearToX(boundEnd);
      var labelLeft = yearToX(era.start) - left + 10;
      band.style.left = left + "px";
      band.style.width = (right - left) + "px";
      band.innerHTML = '<div class="era-fill"></div><span class="era-label" style="left:' + labelLeft + 'px">' + era.label + "</span>";
      eraOverlay.appendChild(band);
    });
  }

  function renderLanes() {
    lanesEl.innerHTML = "";
    TOPICS.forEach(function (topic) {
      if (!state.selectedTopics.has(topic.id)) return;
      var colorVar = "var(--civ-" + topic.colorIndex + ")";

      var row = document.createElement("div");
      row.className = "lane-row";
      row.dataset.topicId = topic.id;

      var label = document.createElement("div");
      label.className = "lane-label";
      label.style.setProperty("--civ-color", colorVar);
      label.innerHTML =
        '<span class="swatch-row"><span class="swatch"></span><span class="name">' + topic.name + "</span></span>" +
        '<span class="span">' + yearLabel(topic.start) + " – " + yearLabel(topic.end) + "</span>";

      var laneTrack = document.createElement("div");
      laneTrack.className = "lane-track";
      laneTrack.style.setProperty("--civ-color", colorVar);

      var line = document.createElement("div");
      line.className = "lane-line";
      var lx = yearToX(topic.start);
      var rx = yearToX(topic.end);
      line.style.left = lx + "px";
      line.style.width = Math.max(2, rx - lx) + "px";
      laneTrack.appendChild(line);

      topic.events.forEach(function (ev) {
        if (state.sig === "major" && ev.sig !== "major") return;
        var marker = document.createElement("button");
        marker.type = "button";
        marker.className = "marker" + (ev.sig === "major" ? " major" : "");
        marker.style.setProperty("--civ-color", colorVar);
        marker.style.left = yearToX(ev.year) + "px";
        marker.setAttribute("aria-pressed", "false");
        var evId = topic.id + "::" + ev.year;
        marker.dataset.evId = evId;
        marker.innerHTML =
          '<span class="dot"></span>' +
          '<span class="tip"><span class="tip-date">' + yearLabel(ev.year) + "</span>" + ev.title + "</span>";
        marker.addEventListener("click", function () { selectEvent(topic, ev, marker, colorVar); });
        laneTrack.appendChild(marker);
      });

      row.appendChild(label);
      row.appendChild(laneTrack);
      lanesEl.appendChild(row);
    });
  }

  function updateTopicFilterCount() {
    topicFilterCount.textContent = state.selectedTopics.size + "/" + TOPICS.length;
  }

  function buildTopicFilter() {
    if (topicFilterLabel) topicFilterLabel.textContent = CATEGORY_LABEL;
    topicFilterList.innerHTML = "";
    TOPICS.forEach(function (topic) {
      var item = document.createElement("label");
      item.className = "topic-filter-item";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          state.selectedTopics.add(topic.id);
        } else {
          state.selectedTopics.delete(topic.id);
        }
        updateTopicFilterCount();
        renderLanes();
      });

      var swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.setProperty("--civ-color", "var(--civ-" + topic.colorIndex + ")");

      var name = document.createElement("span");
      name.textContent = topic.name;

      item.appendChild(checkbox);
      item.appendChild(swatch);
      item.appendChild(name);
      topicFilterList.appendChild(item);
    });
    updateTopicFilterCount();
  }

  function openTopicFilter() {
    topicFilterPanel.hidden = false;
    topicFilterToggle.setAttribute("aria-expanded", "true");
  }
  function closeTopicFilter() {
    topicFilterPanel.hidden = true;
    topicFilterToggle.setAttribute("aria-expanded", "false");
  }

  topicFilterToggle.addEventListener("click", function () {
    if (topicFilterPanel.hidden) openTopicFilter(); else closeTopicFilter();
  });
  document.addEventListener("click", function (e) {
    if (!topicFilterEl.contains(e.target)) closeTopicFilter();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeTopicFilter();
  });

  topicFilterAll.addEventListener("click", function () {
    state.selectedTopics = new Set(TOPICS.map(function (t) { return t.id; }));
    topicFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = true; });
    updateTopicFilterCount();
    renderLanes();
  });
  topicFilterClear.addEventListener("click", function () {
    state.selectedTopics = new Set();
    topicFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = false; });
    updateTopicFilterCount();
    renderLanes();
  });

  function renderNavList(categories) {
    navList.innerHTML = "";
    categories.forEach(function (cat) {
      var isCurrent = cat.id === CATEGORY;
      var item = document.createElement(isCurrent ? "span" : "a");
      item.className = "nav-drawer-item" + (isCurrent ? " active" : "");
      if (isCurrent) {
        item.setAttribute("aria-current", "page");
      } else {
        item.href = "index.html?category=" + encodeURIComponent(cat.id);
      }
      item.innerHTML =
        '<span class="nav-drawer-item-label">' + cat.label + "</span>" +
        '<span class="nav-drawer-item-count">' + cat.count + "</span>";
      navList.appendChild(item);
    });
  }

  function openNav() {
    navDrawer.classList.add("open");
    navScrim.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    navDrawer.classList.remove("open");
    navScrim.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    if (navDrawer.classList.contains("open")) closeNav(); else openNav();
  });
  navScrim.addEventListener("click", closeNav);
  navClose.addEventListener("click", closeNav);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  function selectEvent(topic, ev, markerEl, colorVar) {
    document.querySelectorAll(".marker[aria-pressed='true']").forEach(function (m) {
      m.setAttribute("aria-pressed", "false");
    });
    markerEl.setAttribute("aria-pressed", "true");

    document.getElementById("detailEyebrow").style.setProperty("--eyebrow-color", colorVar);
    document.getElementById("detailTopic").textContent = topic.name;
    document.getElementById("detailDate").textContent = "· " + yearLabel(ev.year);
    document.getElementById("detailTitle").textContent = ev.title;
    document.getElementById("detailBody").textContent = ev.body;
    document.getElementById("detailTag").textContent = ev.sig === "major" ? "Landmark event" : "Related event";

    var figure = document.getElementById("detailFigure");
    if (ev.imageUrl) {
      var detailImage = document.getElementById("detailImage");
      detailImage.src = ev.imageUrl;
      detailImage.alt = ev.imageDescription || ev.title;
      if (ev.imageAttribution) {
        detailImage.title = ev.imageAttribution;
      } else {
        detailImage.removeAttribute("title");
      }
      document.getElementById("detailImageCaption").textContent =
        ev.imageDescription || ev.imageAttribution || "";
      figure.hidden = false;
    } else {
      figure.hidden = true;
    }

    var sourceLink = document.getElementById("detailSourceLink");
    if (ev.sourceUrl) {
      sourceLink.href = ev.sourceUrl;
      sourceLink.hidden = false;
    } else {
      sourceLink.hidden = true;
    }

    showLocationOnMap(ev.location);

    var panel = document.getElementById("detailPanel");
    panel.classList.add("open");
  }

  var worldMapReady = null;

  function loadWorldMap() {
    if (worldMapReady) return worldMapReady;
    worldMapReady = fetch("world-map.svg")
      .then(function (res) { return res.text(); })
      .then(function (svgText) {
        document.getElementById("detailMapSvg").innerHTML = svgText;
      })
      .catch(function () { /* map is a nice-to-have; fail silently */ });
    return worldMapReady;
  }

  function showLocationOnMap(location) {
    var mapEl = document.getElementById("detailMap");
    var dotEl = document.getElementById("detailMapDot");
    var historicalEl = document.getElementById("detailMapCaptionHistorical");
    var modernEl = document.getElementById("detailMapCaptionModern");

    var hasCoords = location && location.latitude != null && location.longitude != null;
    if (!hasCoords) {
      mapEl.hidden = true;
      return;
    }

    mapEl.hidden = false;
    loadWorldMap().then(function () {
      var xPct = (location.longitude + 180) / 360 * 100;
      var yPct = (90 - location.latitude) / 180 * 100;
      dotEl.style.left = xPct + "%";
      dotEl.style.top = yPct + "%";
      dotEl.hidden = false;
    });

    var place = [location.city, location.country].filter(Boolean).join(", ");
    var historical = location.historicalName || "";
    var sameAsCity = historical && location.city &&
      historical.toLowerCase() === location.city.toLowerCase();

    historicalEl.textContent = sameAsCity ? "" : historical;
    modernEl.textContent = place;
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
    document.title = "History Zoomout — " + CATEGORY_LABEL;
    if (eventCountEl) eventCountEl.textContent = String(totalEventCount());
    if (topicCountEl) topicCountEl.textContent = String(TOPICS.length);

    fitDomainToData();
    state.selectedTopics = new Set(TOPICS.map(function (t) { return t.id; }));
    buildTopicFilter();
    render();
    loadWorldMap();

    loadStateEl.hidden = true;
    stageEl.hidden = false;
  }

  Promise.all([
    fetch(API_BASE + "/topics?category=" + encodeURIComponent(CATEGORY)).then(function (res) {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    }),
    fetch(API_BASE + "/categories").then(function (res) {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    })
  ])
    .then(function (results) {
      TOPICS = results[0];
      var categories = results[1];
      var match = categories.filter(function (c) { return c.id === CATEGORY; })[0];
      if (match) CATEGORY_LABEL = match.label;
      renderNavList(categories);
      init();
    })
    .catch(function (err) {
      loadStateEl.textContent = "Couldn't load the timeline — is the API running at " + API_BASE + "? (" + err.message + ")";
      loadStateEl.classList.add("error");
    });
})();
