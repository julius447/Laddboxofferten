
(function (w, d) {
  var mal = null, foreTopp = 0, foreScroll = 0;
  function valbart(t) {
    if (!t || !t.closest) return null;
    var lab = t.closest("label.o-pkg,label.o-rad,label.o-opt,label.o-plats");
    return (lab && lab.closest(".offer")) ? lab : null;
  }
  d.addEventListener("click", function (e) {
    var lab = valbart(e.target);
    if (!lab) return;
    if (mal) return;
    mal = lab;
    foreTopp = lab.getBoundingClientRect().top;
    foreScroll = w.scrollY;
  }, true);
  function kompensera() {
    if (!mal) return;
    var m = mal;
    if (w.scrollY !== foreScroll) { mal = null; return; }
    var flytt = m.getBoundingClientRect().top - foreTopp;
    if (flytt) { w.scrollBy(0, flytt); foreScroll = w.scrollY; }
    mal = null;
  }
  d.addEventListener("change", kompensera, false);
  d.addEventListener("click", function () {
    w.requestAnimationFrame(kompensera);
    w.setTimeout(kompensera, 0);
  }, false);
})(window, document);
