/* ANKARET. Ett val far inte flytta det man just tryckte pa.

   Uppmatt 23 oktober pa batterisidan vid 375 px: ett klick pa laddboxpaketet
   gav summeringen sin andra rad, #sumRows vaxte fran 20 till 48 px, hela
   summeringen fran 411 till 439, och eftersom summeringen ligger OVANFOR
   korsforsaljningskorten i den smala kolumnen flyttade kortet sig 28 px nedat
   under fingret. Elcentral- och laddboxsidorna matte 1 px i samma prov, inte
   for att de ar byggda annorlunda utan for att Chromes egen scroll-ankring
   rakade valja ett ankare som hjalpte dar. En rattning som forlitar sig pa
   webblasarens heuristik ar ingen rattning: den galler pa de sidor dar den
   rakar fungera.

   Harleds inte ur en px-nudgning och inte ur en reserverad hojd: summeringen
   vaxer en rad per val och det gar inte att reservera for alla. I stallet
   halls elementets egen position i vyn konstant, vilket galler varje kontroll
   pa varje mall, aven de som laggs till i morgon.

   Ligger utanfor mallarnas egen js med flit: regeln ar husets, inte en malls,
   och bygg.py lagger den sist pa varje sida. */
(function (w, d) {
  var mal = null, foreTopp = 0, foreScroll = 0;

  function valbart(t) {
    if (!t || !t.closest) return null;
    var lab = t.closest("label.o-pkg,label.o-rad,label.o-opt,label.o-plats");
    return (lab && lab.closest(".offer")) ? lab : null;
  }

  /* FORST, i CAPTURE-fasen pa click, alltsa fore allt annat: las positionen
     innan nagot har hant. Forsta lasningen i en interaktion vinner, for ett
     klick pa en etikett ger TVA click-handelser (etiketten, och den som
     webblasaren vidarebefordrar till kontrollen). */
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
    /* FLYTTADE SIDAN SCROLLEN SJALV ar det ett avsiktligt drag, till exempel
       accept-skarmen som tar fokus. Da ska ankaret inte bråka med den. */
    if (w.scrollY !== foreScroll) { mal = null; return; }
    var flytt = m.getBoundingClientRect().top - foreTopp;
    if (flytt) { w.scrollBy(0, flytt); foreScroll = w.scrollY; }
    mal = null;
  }

  /* SEDAN, pa CHANGE: det ar dar sidan ritar om. Forsta versionen kompenserade
     pa click-bubblan och gjorde ingenting, for en kryssruta och en radioknapp
     avfyrar input och change EFTER att click har bubblat klart. Vid min
     matning hade kortet alltsa inte flyttat sig an: flytt var 0, mal nollades,
     och nar omritningen sedan kom fanns inget ankare kvar. Uppmatt: 28 px
     stod kvar pa en sida dar ankaret bevisligen var inlast och korde. */
  d.addEventListener("change", kompensera, false);

  /* OCH TVA ANDRA CHANSER for en omritning som sker asynkront. Ar allt redan
     kompenserat ar mal null och bada ar no-op. */
  d.addEventListener("click", function () {
    w.requestAnimationFrame(kompensera);
    w.setTimeout(kompensera, 0);
  }, false);
})(window, document);
