/* Shared nav dropdown behaviour for every page.
   The dropdowns are native <details class="links"> elements. On their own they
   stay open until their own summary is clicked again, and opening one does not
   close another. This script adds the expected menu behaviour:
   - opening one dropdown closes any other open one
   - a click or tap anywhere outside an open dropdown closes it
   - Escape closes it and returns focus to its summary
   Keyboard toggling (Enter/Space on the summary) stays native. */
(function () {
  "use strict";
  function menus() {
    return Array.prototype.slice.call(document.querySelectorAll("details.links"));
  }
  function sync(d) {
    var s = d.querySelector("summary");
    if (s) s.setAttribute("aria-expanded", d.open ? "true" : "false");
  }
  function closeAll(except) {
    menus().forEach(function (d) {
      if (d !== except && d.open) d.open = false;
    });
  }
  function init() {
    menus().forEach(function (d) {
      sync(d);
      d.addEventListener("toggle", function () {
        sync(d);
        if (d.open) closeAll(d);
      });
    });
    document.addEventListener("pointerdown", function (e) {
      var inside = e.target.closest && e.target.closest("details.links");
      closeAll(inside || null);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" && e.key !== "Esc") return;
      var open = menus().filter(function (d) { return d.open; });
      if (!open.length) return;
      var focusIn = open.filter(function (d) { return d.contains(document.activeElement); })[0];
      closeAll(null);
      if (focusIn) { var s = focusIn.querySelector("summary"); if (s) s.focus(); }
    });
    /* Choosing a link inside a menu (e.g. a same-page #anchor) closes it. */
    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("details.links .links-menu a");
      if (link) closeAll(null);
    });
    /* Moving keyboard focus out of an open menu closes it too. */
    document.addEventListener("focusin", function (e) {
      var inside = e.target.closest && e.target.closest("details.links");
      closeAll(inside || null);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
