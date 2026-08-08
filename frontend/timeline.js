(function () {
  "use strict";

  var DOMAIN_PADDING_YEARS = 60;
  var BASE_PX_PER_YEAR = 0.62;
  var SIDEBAR_GUTTER = 360; // scroll room so the open detail panel never covers the timeline's end
  var AUTO_TICK_MIN_PX_SPACING = 170; // smallest step whose pixel gap at the CURRENT zoom clears this; recomputed every render so ticks get denser as pxPerYear() grows with zoom
  var NICE_TICK_STEPS_YEARS = [10, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 25000];
  var MIN_MARKER_GAP_PX = 16; // minimum center-to-center spacing between markers in a lane, so close-in-time events never render as one indistinguishable blob

  // Countries run from a medieval/early-modern founding straight through to
  // the present, and the present is where most of their events (and nearly
  // all of the reader's interest) cluster. For the `country` category only,
  // the axis runs at a higher px/year than other categories so that crowded
  // modern era stays readable -- still a plain linear scale throughout, just
  // zoomed in further by default (a log-compressed early era was tried and
  // reverted: it fixed the modern crowding but introduced its own visible
  // artifacts -- a slope discontinuity right at the log/linear handoff, and
  // clipped labels/markers at the compressed domain start).
  var COUNTRY_LINEAR_PX_PER_YEAR = 2.2;

  // Per-category timeline rendering config. `civilization` keeps the original
  // curated eras/domain; any category not listed here gets a domain fitted
  // purely to its data (no artificial floor) with no era-band overlay.
  // Tick years are never curated here -- they're always generated fresh from
  // the current zoom level (see generateTicks/pickTickStep) so zooming in
  // reveals finer date resolution instead of just spreading the same ticks out.
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
      ]
    }
  };
  var DEFAULT_TIMELINE_CONFIG = {
    domainStart: Infinity,
    domainEnd: -Infinity,
    eras: []
  };

  function getCategory() {
    return new URLSearchParams(window.location.search).get("category") || "civilization";
  }

  var CATEGORY = getCategory();
  var TIMELINE_CONFIG = CATEGORY_TIMELINE_CONFIG[CATEGORY] || DEFAULT_TIMELINE_CONFIG;
  var CATEGORY_LABEL = CATEGORY.charAt(0).toUpperCase() + CATEGORY.slice(1);
  var USE_LOG_SCALE = CATEGORY === "country";

  var DOMAIN_START = TIMELINE_CONFIG.domainStart;
  var DOMAIN_END = TIMELINE_CONFIG.domainEnd;
  var ERAS = TIMELINE_CONFIG.eras;

  var API_BASE = window.HISTORYZOOMOUT_API_BASE || "http://" + window.location.hostname + ":8000";

  var TOPICS = [];

  function yearLabel(year) {
    return year <= 0 ? (Math.abs(year) + " BCE") : (year + " CE");
  }

  // Pick the finest round-number tick step (10/25/50/.../1000-year style)
  // whose pixel spacing at the CURRENT zoom still clears AUTO_TICK_MIN_PX_SPACING.
  // Driven purely by pxPerYear() -- not by the domain's total span -- so this
  // naturally returns a smaller (denser) step as you zoom in, rather than a
  // step picked once for "about N ticks across the whole domain" that then
  // never changes as zoom changes.
  function pickTickStep() {
    for (var i = 0; i < NICE_TICK_STEPS_YEARS.length; i++) {
      var step = NICE_TICK_STEPS_YEARS[i];
      if (step * pxPerYear() >= AUTO_TICK_MIN_PX_SPACING) {
        return step;
      }
    }
    return NICE_TICK_STEPS_YEARS[NICE_TICK_STEPS_YEARS.length - 1];
  }

  // Recomputed on every render (see renderAxisAndEras) so it always reflects
  // the current zoom.
  function generateTicks(start, end) {
    var span = end - start;
    if (span <= 0) return [Math.round(start)];
    var step = pickTickStep();
    var first = Math.ceil(start / step) * step;
    var ticks = [];
    for (var y = first; y <= end; y += step) {
      ticks.push(Math.round(y));
    }
    return ticks;
  }

  var state = { tags: new Set(), zoom: 1, selectedTopics: null };

  var lanesEl = document.getElementById("lanes");
  var axisTrack = document.getElementById("axisTrack");
  var axisSpacer = document.querySelector(".axis-spacer");
  var eraOverlay = document.getElementById("eraOverlay");
  var trackEl = document.getElementById("track");
  var scroller = document.getElementById("scroller");
  var zoomInput = document.getElementById("zoom");
  var ZOOM_MIN = parseFloat(zoomInput.min);
  var ZOOM_MAX = parseFloat(zoomInput.max);
  var zoomReadout = document.getElementById("zoomReadout");
  var eventCountEl = document.getElementById("eventCount");
  var topicCountEl = document.getElementById("topicCount");
  var stageEl = document.getElementById("stage");
  var loadStateEl = document.getElementById("loadState");
  var scrollHintEl = document.getElementById("scrollHint");
  // The topic checklist for the current category lives nested inside the nav
  // drawer (see renderNavList) rather than as static markup, since it has to
  // render under whichever category row is "current" -- these get assigned
  // once renderNavList builds that section.
  var topicFilterList = null;
  var topicFilterCountEl = null;
  var tagFilterToggle = document.getElementById("tagFilterToggle");
  var tagFilterPanel = document.getElementById("tagFilterPanel");
  var tagFilterList = document.getElementById("tagFilterList");
  var tagFilterLabelEl = document.getElementById("tagFilterLabel");
  var tagFilterClearBtn = document.getElementById("tagFilterClearBtn");
  var navToggle = document.getElementById("navToggle");
  var navScrim = document.getElementById("navScrim");
  var navDrawer = document.getElementById("navDrawer");
  var navClose = document.getElementById("navClose");
  var navList = document.getElementById("navList");

  function pxPerYear() {
    return (USE_LOG_SCALE ? COUNTRY_LINEAR_PX_PER_YEAR : BASE_PX_PER_YEAR) * state.zoom;
  }
  function yearToX(year) { return (year - DOMAIN_START) * pxPerYear(); }
  // Inverse of yearToX -- screen/scroll math (see screenXToYear) needs to go
  // from a pixel position back to the year under it, not just the reverse.
  function xToYear(x) { return DOMAIN_START + x / pxPerYear(); }
  function trackWidth() { return yearToX(DOMAIN_END) - yearToX(DOMAIN_START); }
  // Read live rather than hardcode: .axis-spacer's width is set in CSS and
  // shrinks under the mobile breakpoint, so this stays in sync with whatever
  // the stylesheet currently says instead of drifting out of alignment with
  // the (same-width) sticky .lane-label column.
  function labelWidth() { return axisSpacer.getBoundingClientRect().width; }

  // Finds the placement closest to every marker's true (natural) year
  // position subject to a minimum center-to-center gap, via isotonic
  // regression / pool-adjacent-violators (PAVA): subtracting i*GAP from each
  // sorted natural x turns "each marker >= previous + GAP" into a plain
  // non-decreasing constraint, which PAVA solves optimally by averaging
  // together ("pooling") any run of markers that would otherwise overlap.
  // This is the standard bounded solution to the problem -- a run of close
  // markers only ever pulls in *that run's own* neighbors, so one early
  // collision can't drag every later, well-separated marker in the lane
  // further and further from its true position (a plain sequential
  // "push right of the previous marker" pass was tried first and did
  // exactly that, and centering fixed-size clusters on their own mean was
  // tried second but could still cascade at cluster boundaries).
  function resolveMarkerPositions(events) {
    var natural = events
      .map(function (ev) { return { ev: ev, x: yearToX(ev.year) }; })
      .sort(function (a, b) { return a.x - b.x; });

    var blocks = natural.map(function (p, i) {
      return { sum: p.x - i * MIN_MARKER_GAP_PX, count: 1, items: [p] };
    });
    var i = 0;
    while (i < blocks.length - 1) {
      if (blocks[i].sum / blocks[i].count > blocks[i + 1].sum / blocks[i + 1].count) {
        blocks[i].sum += blocks[i + 1].sum;
        blocks[i].count += blocks[i + 1].count;
        blocks[i].items = blocks[i].items.concat(blocks[i + 1].items);
        blocks.splice(i + 1, 1);
        if (i > 0) i--;
      } else {
        i++;
      }
    }

    var positioned = [];
    var index = 0;
    blocks.forEach(function (block) {
      var mean = block.sum / block.count;
      block.items.forEach(function (p, j) { p.x = mean + (index + j) * MIN_MARKER_GAP_PX; });
      positioned.push.apply(positioned, block.items);
      index += block.count;
    });

    // The least-squares pooling above can place a lane's very first marker
    // to the left of its own natural x (e.g. two naturally-close points at
    // 0 and 5 optimally centering as -5.5/10.5) -- fine in the abstract, but
    // if that first natural x was already near the domain's left edge (as
    // it commonly is under the country category's log-compressed early
    // years), the result renders at a negative offset, off the start of the
    // lane. Shift the whole (already internally-optimal) placement right by
    // whatever's needed to keep it on-track, rather than reworking the
    // pooling itself.
    var minX = positioned.reduce(function (m, p) { return Math.min(m, p.x); }, 0);
    if (minX < 0) positioned.forEach(function (p) { p.x -= minX; });
    return positioned;
  }

  function fitDomainToData() {
    if (!TOPICS.length) return;
    var minStart = TOPICS.reduce(function (m, t) { return Math.min(m, t.start); }, DOMAIN_START);
    var maxEnd = TOPICS.reduce(function (m, t) { return Math.max(m, t.end); }, DOMAIN_END);
    DOMAIN_START = minStart - DOMAIN_PADDING_YEARS;
    DOMAIN_END = maxEnd + DOMAIN_PADDING_YEARS;
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
    trackEl.style.width = (w + labelWidth() + SIDEBAR_GUTTER) + "px";
    axisTrack.innerHTML = "";
    generateTicks(DOMAIN_START, DOMAIN_END).forEach(function (y) {
      var tick = document.createElement("div");
      tick.className = "tick";
      tick.style.left = yearToX(y) + "px";
      tick.innerHTML = '<span class="tick-mark"></span><span class="tick-label">' + yearLabel(y) + "</span>";
      axisTrack.appendChild(tick);
    });

    eraOverlay.style.left = labelWidth() + "px";
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

      // Faint guide spanning the lane's full width (the whole domain, not
      // just this topic's date range) so a row never reads as empty/broken
      // when scrolled somewhere its actual (colored, brighter) line doesn't
      // reach -- there's always a thin rail hinting the lane continues.
      var rail = document.createElement("div");
      rail.className = "lane-rail";
      laneTrack.appendChild(rail);

      var line = document.createElement("div");
      line.className = "lane-line";
      var lx = yearToX(topic.start);
      var rx = yearToX(topic.end);
      line.style.left = lx + "px";
      line.style.width = Math.max(2, rx - lx) + "px";
      laneTrack.appendChild(line);

      // Resolve x positions before creating any marker elements: at low zoom,
      // events close in time land within a few px of each other and render
      // as one indistinguishable, barely-clickable blob. resolveMarkerPositions
      // spaces them apart, bounded to what's actually needed, instead of
      // rendering them at their literal (possibly identical) pixel position.
      var visibleEvents = topic.events.filter(function (ev) {
        return state.tags.size === 0 || (ev.tags || []).some(function (t) { return state.tags.has(t); });
      });
      var positioned = resolveMarkerPositions(visibleEvents);

      positioned.forEach(function (p) {
        var ev = p.ev;
        var marker = document.createElement("button");
        marker.type = "button";
        marker.className = "marker" + (ev.sig === "major" ? " major" : "");
        marker.style.setProperty("--civ-color", colorVar);
        marker.style.left = p.x + "px";
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
    if (topicFilterCountEl) topicFilterCountEl.textContent = state.selectedTopics.size + "/" + TOPICS.length;
  }

  function buildTopicFilter() {
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

  function updateTagFilterLabel() {
    tagFilterLabelEl.textContent = state.tags.size === 0 ? "Tags" : "Tags (" + state.tags.size + ")";
  }

  // Tags are whatever the loaded events actually carry (not a fixed list),
  // so a future category with a different tag vocabulary just works.
  function buildTagFilter() {
    var allTags = new Set();
    TOPICS.forEach(function (topic) {
      topic.events.forEach(function (ev) {
        (ev.tags || []).forEach(function (t) { allTags.add(t); });
      });
    });

    tagFilterList.innerHTML = "";
    Array.from(allTags).sort().forEach(function (tag) {
      var item = document.createElement("label");
      item.className = "topic-filter-item";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          state.tags.add(tag);
        } else {
          state.tags.delete(tag);
        }
        updateTagFilterLabel();
        renderLanes();
      });

      var name = document.createElement("span");
      name.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

      item.appendChild(checkbox);
      item.appendChild(name);
      tagFilterList.appendChild(item);
    });

    updateTagFilterLabel();
  }

  function openTagFilter() {
    tagFilterPanel.hidden = false;
    tagFilterToggle.setAttribute("aria-expanded", "true");
  }
  function closeTagFilter() {
    tagFilterPanel.hidden = true;
    tagFilterToggle.setAttribute("aria-expanded", "false");
  }

  tagFilterToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (tagFilterPanel.hidden) openTagFilter(); else closeTagFilter();
  });

  tagFilterClearBtn.addEventListener("click", function () {
    state.tags.clear();
    tagFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = false; });
    updateTagFilterLabel();
    renderLanes();
  });

  document.addEventListener("click", function (e) {
    if (tagFilterPanel.hidden) return;
    if (e.target.closest(".tag-filter")) return;
    closeTagFilter();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !tagFilterPanel.hidden) closeTagFilter();
  });

  // The nav drawer is the single place to browse: each category is a row,
  // and the current category's row expands in place to show its topic
  // checklist (Select all / Clear + per-topic checkboxes) nested underneath,
  // rather than that checklist living in a separate top-right control.
  // Other categories stay simple links -- switching category is a page
  // navigation today, so there's no topic list to nest under them yet.
  //
  // Only auto-expand the current category's checklist when it's the sole
  // category -- with just one category (today) there's nothing else it could
  // crowd out, so skipping the extra click is a pure win. Once a second
  // category exists, a 16-item checklist auto-expanding would push that
  // category's row off the bottom of the drawer with no hint it's there, so
  // every row starts collapsed and the full category list stays scannable.
  function renderNavList(categories) {
    navList.innerHTML = "";
    var soleCategory = categories.length === 1;
    categories.forEach(function (cat) {
      var isCurrent = cat.id === CATEGORY;
      var section = document.createElement("div");
      section.className = "cat-section";

      var row = document.createElement(isCurrent ? "button" : "a");
      row.className = "cat-row" + (isCurrent ? (soleCategory ? " expanded" : "") : " dim");
      if (isCurrent) {
        row.type = "button";
        row.setAttribute("aria-expanded", soleCategory ? "true" : "false");
      } else {
        row.href = "timeline.html?category=" + encodeURIComponent(cat.id);
      }

      var name = document.createElement("span");
      name.className = "name";
      if (isCurrent) {
        var chev = document.createElement("span");
        chev.className = "chev";
        chev.setAttribute("aria-hidden", "true");
        chev.textContent = "▶";
        name.appendChild(chev);
      }
      name.appendChild(document.createTextNode(cat.label));
      row.appendChild(name);

      var count = document.createElement("span");
      count.className = "count";
      count.textContent = cat.count;
      row.appendChild(count);

      section.appendChild(row);

      if (isCurrent) {
        var body = document.createElement("div");
        body.className = "cat-body";
        body.hidden = !soleCategory;

        var actions = document.createElement("div");
        actions.className = "topic-filter-actions";
        var allBtn = document.createElement("button");
        allBtn.type = "button";
        allBtn.textContent = "Select all";
        allBtn.addEventListener("click", function () {
          state.selectedTopics = new Set(TOPICS.map(function (t) { return t.id; }));
          topicFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = true; });
          updateTopicFilterCount();
          renderLanes();
        });
        var clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.textContent = "Clear";
        clearBtn.addEventListener("click", function () {
          state.selectedTopics = new Set();
          topicFilterList.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = false; });
          updateTopicFilterCount();
          renderLanes();
        });
        actions.appendChild(allBtn);
        actions.appendChild(clearBtn);
        body.appendChild(actions);

        var list = document.createElement("div");
        list.className = "topic-filter-list";
        body.appendChild(list);

        section.appendChild(body);

        topicFilterList = list;
        topicFilterCountEl = count;

        row.addEventListener("click", function () {
          var willOpen = body.hidden;
          body.hidden = !willOpen;
          row.classList.toggle("expanded", willOpen);
          row.setAttribute("aria-expanded", String(willOpen));
        });
      }

      navList.appendChild(section);
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
    var tagsContainer = document.getElementById("detailTags");
    tagsContainer.innerHTML = "";
    (ev.tags || []).forEach(function (tag) {
      var tagEl = document.createElement("span");
      tagEl.className = "detail-tag";
      tagEl.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
      tagsContainer.appendChild(tagEl);
    });

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
      // The image's intrinsic size (and so the panel's scrollHeight) isn't
      // known until it loads, so the fade computed right below can be wrong
      // until this fires -- recompute once it does.
      detailImage.onload = updateDetailScrollFade;
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
    panel.scrollTop = 0;
    panel.classList.add("open");
    // Shrinks the scroller (desktop only, see .stage.panel-open .scroller in
    // timeline.css) so the panel never overlays -- and hides -- markers that
    // happen to be scrolled into its strip on the right.
    document.getElementById("stage").classList.add("panel-open");
    detailScrollFadeDismissed = false;
    updateDetailScrollFade();
  }

  // One-time "there's more below, scroll to see it" nudge for the detail
  // panel: shown only in the pristine, just-opened state when content
  // overflows, and dismissed for good on the reader's first scroll of that
  // event -- not a running scroll-shadow that reappears/disappears as they
  // scroll through the middle of the content (tried that first; it meant
  // the fade sat over whatever line was currently at the bottom edge for as
  // long as the reader hadn't reached the literal end, which read as "stuck"
  // rather than as a cue). Scrolling back to the top doesn't bring it back.
  var detailPanelEl = document.getElementById("detailPanel");
  var detailScrollFadeEl = document.getElementById("detailScrollFade");
  var detailScrollFadeDismissed = false;
  function updateDetailScrollFade() {
    if (detailScrollFadeDismissed) {
      detailScrollFadeEl.classList.remove("visible");
      return;
    }
    var hasOverflow = detailPanelEl.scrollHeight - detailPanelEl.clientHeight > 4;
    detailScrollFadeEl.classList.toggle("visible", hasOverflow);
  }
  detailPanelEl.addEventListener("scroll", function () {
    if (detailScrollFadeDismissed) return;
    detailScrollFadeDismissed = true;
    detailScrollFadeEl.classList.remove("visible");
  });
  window.addEventListener("resize", updateDetailScrollFade);

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

  function closeDetailPanel() {
    detailPanelEl.classList.remove("open");
    document.getElementById("stage").classList.remove("panel-open");
  }

  document.getElementById("detailClose").addEventListener("click", closeDetailPanel);

  // Tapping/clicking anywhere outside the open panel dismisses it, mirroring
  // the nav drawer's scrim-click-to-close pattern. Marker clicks are
  // excluded since they already manage the panel's open state themselves via
  // selectEvent() (opening it, or swapping it to the newly clicked event) --
  // without this exclusion, clicking a new marker while the panel is already
  // open would immediately close the panel selectEvent() just opened, since
  // the click bubbles up to this listener right after the marker's own.
  document.addEventListener("click", function (e) {
    if (!detailPanelEl.classList.contains("open")) return;
    if (e.target.closest("#detailPanel") || e.target.closest(".marker")) return;
    closeDetailPanel();
  });

  // yearToX()/pxPerYear() are relative to the flexible track area, which
  // starts labelWidth() px into the (horizontally scrolling) content -- the
  // sticky lane-label column sits in front of it. Converting between a
  // screen x (e.g. a pointer position) and the year under it has to route
  // through that offset plus the current scroll position.
  function screenXToYear(clientX) {
    var rect = scroller.getBoundingClientRect();
    var screenX = clientX - rect.left;
    return xToYear(scroller.scrollLeft + screenX - labelWidth());
  }
  function scrollLeftToPinYear(year, clientX) {
    var rect = scroller.getBoundingClientRect();
    var screenX = clientX - rect.left;
    return labelWidth() + yearToX(year) - screenX;
  }

  // Re-renders at the new zoom, then corrects scrollLeft so `year` lands
  // back under `clientX` -- otherwise every zoom step would recenter on
  // the domain start instead of staying anchored under the gesture (or,
  // for the slider, under the viewport's center).
  function applyZoom(newZoom, year, clientX) {
    var clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, newZoom));
    if (clamped === state.zoom) return;
    state.zoom = clamped;
    zoomInput.value = clamped;
    updateZoomReadout();
    render();
    scroller.scrollLeft = scrollLeftToPinYear(year, clientX);
  }

  zoomInput.addEventListener("input", function () {
    var rect = scroller.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var year = screenXToYear(centerX);
    applyZoom(parseFloat(zoomInput.value), year, centerX);
  });

  // Pan (1 pointer) + pinch-zoom (2 pointers) over the timeline only, via
  // Pointer Events so touch and mouse share one code path. #scroller has
  // touch-action: none (see timeline.css) so the browser never intercepts a
  // touch gesture for native scroll/page-zoom -- everything below is the only
  // gesture handling that runs. Desktop trackpad pinch doesn't arrive as
  // pointer events; it comes as wheel events with ctrlKey set (the
  // cross-browser convention browsers use to report pinch on a trackpad,
  // indistinguishable from a literal ctrl+wheel), handled separately below.
  (function enablePanAndZoomGestures() {
    var pointers = new Map(); // pointerId -> {x, y}
    var mode = null; // "pan" | "pinch"
    var panStart = null; // {x, y, scrollX, scrollY}
    var lastPinchDistance = 0;

    function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function midpoint(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

    function beginPan() {
      mode = "pan";
      var p = pointers.values().next().value;
      panStart = { x: p.x, y: p.y, scrollX: scroller.scrollLeft, scrollY: scroller.scrollTop };
      scroller.classList.add("grabbing");
    }

    scroller.addEventListener("pointerdown", function (e) {
      // Ignore only when this is the sole (first) touch landing on a marker
      // or the label column, so tapping a marker still selects it. A second
      // finger for a pinch is tracked even if it happens to land on one.
      if ((e.target.closest(".marker") || e.target.closest(".lane-label")) && pointers.size === 0) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      // Best-effort: capture just keeps pointermove firing here if a finger
      // strays outside the element mid-gesture. The pan/pinch math below
      // doesn't depend on it, so a failure here shouldn't abort the gesture.
      try { scroller.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }

      if (pointers.size === 1) {
        beginPan();
      } else if (pointers.size === 2) {
        mode = "pinch";
        var pts = Array.from(pointers.values());
        lastPinchDistance = distance(pts[0], pts[1]);
        scroller.classList.remove("grabbing");
      }
    });

    scroller.addEventListener("pointermove", function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (mode === "pan" && pointers.size === 1) {
        scroller.scrollLeft = panStart.scrollX - (e.clientX - panStart.x);
        scroller.scrollTop = panStart.scrollY - (e.clientY - panStart.y);
      } else if (mode === "pinch" && pointers.size === 2) {
        var pts = Array.from(pointers.values());
        var mid = midpoint(pts[0], pts[1]);
        var dist = distance(pts[0], pts[1]);
        if (lastPinchDistance > 0 && dist > 0) {
          var year = screenXToYear(mid.x);
          applyZoom(state.zoom * (dist / lastPinchDistance), year, mid.x);
        }
        lastPinchDistance = dist;
      }
    });

    function release(e) {
      pointers.delete(e.pointerId);
      if (pointers.size === 1) {
        beginPan(); // dropped from pinch to one finger -- resume panning from here, no jump
      } else if (pointers.size === 0) {
        mode = null;
        scroller.classList.remove("grabbing");
      }
    }
    scroller.addEventListener("pointerup", release);
    scroller.addEventListener("pointercancel", release);

    // iOS Safari's page-pinch-zoom runs on its own proprietary gesture
    // recognizer (gesturestart/change/end) that sits outside both
    // touch-action and the touch/pointer event pipeline -- blocking it is
    // the standard, dedicated way to keep a custom pinch handler from also
    // triggering the browser's own page zoom. It's bound on `document`
    // rather than `#scroller`: the timeline strip doesn't fill the screen
    // (there's a header above and a footer below), so a real two-finger
    // pinch easily has one finger land outside `#scroller`'s box, where a
    // listener scoped to it would never see the event at all. This only
    // suppresses the browser's OWN zoom -- it doesn't touch pointer events,
    // so it can't interfere with the pan/pinch handling above, and the
    // actual zoom computation still only runs when the gesture started on
    // `#scroller` (see the pointerdown handler above).
    function preventNativeZoom(e) { e.preventDefault(); }
    document.addEventListener("gesturestart", preventNativeZoom);
    document.addEventListener("gesturechange", preventNativeZoom);
    document.addEventListener("gestureend", preventNativeZoom);

    // Trackpad pinch (and literal ctrl+wheel) zoom on desktop. Plain wheel
    // scroll (no ctrlKey) is left alone so normal two-finger scrolling still
    // pans the page/scroller natively.
    scroller.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      var year = screenXToYear(e.clientX);
      var factor = Math.exp(-e.deltaY * 0.008);
      applyZoom(state.zoom * factor, year, e.clientX);
    }, { passive: false });
  })();

  function render() {
    renderAxisAndEras();
    renderLanes();
  }

  // Rotating the phone (or resizing a desktop window) can cross the mobile
  // breakpoint that changes .axis-spacer's CSS width, which renderAxisAndEras
  // reads live via labelWidth() -- re-run it so the era overlay and track
  // width stay aligned with the sticky label column's actual rendered size.
  var initialized = false;
  var resizeReflowTimer = null;
  window.addEventListener("resize", function () {
    if (!initialized) return;
    clearTimeout(resizeReflowTimer);
    resizeReflowTimer = setTimeout(renderAxisAndEras, 150);
  });

  function init() {
    document.title = "History Zoomout — " + CATEGORY_LABEL;
    if (eventCountEl) eventCountEl.textContent = String(totalEventCount());
    if (topicCountEl) topicCountEl.textContent = String(TOPICS.length);

    fitDomainToData();
    state.selectedTopics = new Set(TOPICS.map(function (t) { return t.id; }));
    buildTopicFilter();
    buildTagFilter();
    updateZoomReadout();
    render();
    loadWorldMap();

    loadStateEl.hidden = true;
    stageEl.hidden = false;

    // Countries run right up to the present, and that's what readers open
    // this view to see -- start scrolled to the end of the timeline instead
    // of the medieval/early-modern founding at the far left. Has to happen
    // after stageEl is unhidden: scroller has no layout box (and so no
    // meaningful scrollWidth) while its ancestor is still `hidden`.
    if (CATEGORY === "country") scroller.scrollLeft = scroller.scrollWidth;
    initialized = true;

    showScrollHintIfNeeded();
  }

  // Nudges first-time users toward the fact that the timeline scrolls
  // horizontally: shown only if there's actually overflow to scroll into,
  // dismissed permanently on the first scroll/drag/wheel interaction.
  function showScrollHintIfNeeded() {
    if (scroller.scrollWidth <= scroller.clientWidth + 1) return;
    scrollHintEl.classList.add("visible");
    var dismiss = function () {
      scrollHintEl.classList.remove("visible");
      scroller.removeEventListener("scroll", dismiss);
      scroller.removeEventListener("pointerdown", dismiss);
      scroller.removeEventListener("wheel", dismiss);
    };
    scroller.addEventListener("scroll", dismiss, { passive: true });
    scroller.addEventListener("pointerdown", dismiss);
    scroller.addEventListener("wheel", dismiss, { passive: true });
  }

  function fetchTimelineData() {
    return Promise.all([
      fetch(API_BASE + "/topics?category=" + encodeURIComponent(CATEGORY)).then(function (res) {
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        return res.json();
      }),
      fetch(API_BASE + "/categories").then(function (res) {
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        return res.json();
      })
    ]);
  }

  // The API Lambda scales to zero when idle, so the first request after a
  // while can be slow enough that some browsers (mobile Safari/WebKit) abort
  // the fetch outright rather than waiting it out. One silent retry covers
  // this without surfacing a false "API is down" error to the user.
  function loadTimelineData(isRetry) {
    fetchTimelineData()
      .then(function (results) {
        TOPICS = results[0];
        var categories = results[1];
        var match = categories.filter(function (c) { return c.id === CATEGORY; })[0];
        if (match) CATEGORY_LABEL = match.label;
        renderNavList(categories);
        init();
      })
      .catch(function (err) {
        if (!isRetry) {
          setTimeout(function () { loadTimelineData(true); }, 1000);
          return;
        }
        loadStateEl.textContent = "Couldn't load the timeline — is the API running at " + API_BASE + "? (" + err.message + ")";
        loadStateEl.classList.add("error");
      });
  }

  loadTimelineData(false);
})();
