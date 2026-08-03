(function () {
  "use strict";

  var API_BASE = window.HISTORYZOOMOUT_API_BASE || "http://localhost:8000";

  var loadStateEl = document.getElementById("loadState");
  var gridEl = document.getElementById("categoryGrid");

  function renderCategories(categories) {
    gridEl.innerHTML = "";
    categories.forEach(function (cat) {
      var card = document.createElement("a");
      card.className = "category-card";
      card.href = "timeline.html?category=" + encodeURIComponent(cat.id);
      card.innerHTML =
        '<span class="category-card-label">' + cat.label + "</span>" +
        '<span class="category-card-count">' + cat.count + (cat.count === 1 ? " topic" : " topics") + "</span>" +
        '<span class="category-card-arrow" aria-hidden="true">↗</span>';
      gridEl.appendChild(card);
    });

    loadStateEl.hidden = true;
    gridEl.hidden = false;
  }

  fetch(API_BASE + "/categories")
    .then(function (res) {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    })
    .then(renderCategories)
    .catch(function (err) {
      loadStateEl.textContent = "Couldn't load categories — is the API running at " + API_BASE + "? (" + err.message + ")";
      loadStateEl.classList.add("error");
    });
})();
