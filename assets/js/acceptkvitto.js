
(function () {
  "use strict";
  var skarm = document.getElementById("skarmAccept");
  if (!skarm) return;
  var MANAD = ["januari", "februari", "mars", "april", "maj", "juni", "juli",
               "augusti", "september", "oktober", "november", "december"];
  function svensktDatum(d) {
    return d.getDate() + " " + MANAD[d.getMonth()] + " " + d.getFullYear();
  }
  function folden(rubrik) {
    var alla = document.querySelectorAll(".offer details.o-fold, .o-main details.o-fold, details.o-fold");
    for (var i = 0; i < alla.length; i++) {
      var s = alla[i].querySelector("summary");
      if (!s) continue;
      if (s.textContent.trim().toLowerCase() === rubrik.toLowerCase()) {
        if (alla[i].closest("#skarmAccept")) continue;   
        return alla[i];
      }
    }
    return null;
  }
  var fylld = false;
  function fyll(tvinga) {
    if (!tvinga && fylld) return;
    fylld = true;
    var etikett = document.getElementById("oaPaket");
    if (etikett) etikett.textContent = "Att betala";
    var mal = document.getElementById("oaRader");
    if (mal) {
      var kalla = document.getElementById("sumRows");
      var html = kalla ? kalla.innerHTML.trim() : "";
      if (!html) {
        var art = document.querySelector(".o-sum ul.o-art");
        if (art) html = "<ul class=\"o-ingar o-art\">" + art.innerHTML.trim() + "</ul>";
      }
      mal.innerHTML = html;
      mal.hidden = !html;
    }
    var dat = document.getElementById("oaDatum");
    if (dat) {
      dat.textContent = "Accepterad " + svensktDatum(new Date());
      dat.hidden = false;
    }
    var rutan = document.getElementById("oaFolds");
    if (rutan) {
      rutan.innerHTML = "";
      function las(el) {
        if (!el) return;
        var k = el.cloneNode(true);
        k.removeAttribute("id");
        k.removeAttribute("open");
        k.querySelectorAll("[id]").forEach(function (e) { e.removeAttribute("id"); });
        rutan.appendChild(k);
      }
      las(folden("Kostnader som kan tillkomma"));
      var mallen = document.getElementById("oaForbered");
      if (mallen && mallen.content) {
        var f = mallen.content.querySelector("details.o-fold");
        if (f) las(f);
      }
      las(folden("Villkor"));
      rutan.hidden = !rutan.children.length;
    }
  }
  document.addEventListener("click", function () {
    if (!skarm.hidden) fyll(false);
  });
  new MutationObserver(function () {
    fylld = false;
    if (!skarm.hidden) fyll(true);
  }).observe(skarm, { attributes: true, attributeFilter: ["hidden"] });
  if (!skarm.hidden) fyll(true);
})();
