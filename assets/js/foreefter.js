/* FORE OCH EFTER. Reglaget som visar elcentralen fore och efter bytet.

   EN HANDLARE, INTE EN PER MALL. Till 25 oktober fanns den i tva kopior,
   i offerter/laddbox/skript.js och offerter/batteri/skript.js, och de skilde
   sig redan: laddboxens aria-etikett sa "Dra at sidan for att jamfora fore
   och efter", batteriets bara "Jamfor fore och efter". Servicemallen hade
   ingen alls, vilket var precis det agaren hittade 25 oktober:

     "byte av elcentral sa har du inte den har fore- och efter-sliden, vilket
      ar nagonting vi vill ha. Varenda gang pa ovriga tillagg som vi visar
      elcentral. Da ska vi aven ha den har fore- och efter-sliden inkluderad
      pa samma satt som vi har pa laddbox."

   Filen laggs pa VARJE sida av bygg.py, utan att mallen ber om det, som
   ankare.js. En regel varje mall maste komma ihag att lista i sin META ar en
   regel en mall kommer att glomma, och det var sa servicemallen tappade
   reglaget.

   Den ar ofarlig pa en sida utan reglage: saknas elementet gor den ingenting.
   Flera reglage pa samma sida hanteras ocksa, for id ar inte en garanti nar
   korsforsaljningen vaxer. */
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
