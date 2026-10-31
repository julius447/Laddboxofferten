
(function () {
  var reglage = document.querySelectorAll(".o-fereglage");
  for (var i = 0; i < reglage.length; i++) {
    (function (r) {
      var box = r.closest(".o-fe");
      if (!box) return;
      r.addEventListener("input", function () {
        box.style.setProperty("--fe", this.value);
      });
    })(reglage[i]);
  }
})();
