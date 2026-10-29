/*! ACCEPTSKARMENS KVITTO. Delat av alla fem mallarna.

   VAD SOM VAR FEL. Skarmen visade tva saker: ett paketnamn och en summa.
   Uppmatt 28 oktober pa en konfigurerad laddboxorder med sex rader (paket
   9 170, Zaptec Go 2 1 310, RFID 175, arbetstimme 850, laddstolpe 3 950,
   Express 2 500, totalt 17 955 efter avdrag): skarmen sa "Paket Premium
   17 955 kr" och ingenting mer. Alltsa stod ett RADNAMN bredvid TOTALEN, och
   de fem valen kunden just gjort fanns inte pa sidan. Orderbekraftelsens eget
   kontrakt (Offer-accepted-preview/KONTRAKT.md, order.etikett) forbjuder
   precis det: "Far aldrig vara ett radnamn: 'Paket Premium 14 345 kr' i
   huvudet och 'Paket Premium 9 170 kr' i raden under sager tva saker om samma
   namn." Etiketten ar darfor "Att betala" har ocksa.

   VARFOR INGEN MARKTE DET. Varje innehallsprov i sviten hoppar over
   #skarmAccept med flit (audit.js, lankar.js, desktop.js, typ.js, logik.py,
   agarpunkter.py). Det enda prov som over huvud taget trycker pa
   acceptknappen ar rorelse.js, och det mater animationer. Skarmen har alltsa
   aldrig blivit last av nagon kontroll. En yta ingen prover ar inte gron, den
   ar omatt. sonder/acceptkvitto.js stanger det.

   EN KALLA, INTE EN AVSKRIFT. Raderna klonas ur #sumRows och foldarna ur
   sidans egna <details>. Ingen text kopieras in i den har filen, for en
   avskrift blir en andra sanning som driver isar fran den forsta. Mallar som
   saknar en fold (service och tillagg har ingen "Kostnader som kan tillkomma")
   far bara de som finns.

   DATUMET. Agarsvar 46, 25 oktober: "Ja, lagg till datum." I produktion satter
   CRM:et det i samma ogonblick kunden trycker acceptera (falt `accepterad` i
   AMPY_ORDER). Har pa mallsidan finns inget CRM, sa skarmen skriver dagens
   datum i webblasaren: accepten skedde nyss, i den har fliken. Formen ar
   svensk lang form, samma som orderbekraftelsen skriver ur sitt ISO-datum, sa
   de tva ytorna inte kan visa tva former. */
(function () {
  "use strict";
  var skarm = document.getElementById("skarmAccept");
  if (!skarm) return;

  var MANAD = ["januari", "februari", "mars", "april", "maj", "juni", "juli",
               "augusti", "september", "oktober", "november", "december"];

  function svensktDatum(d) {
    return d.getDate() + " " + MANAD[d.getMonth()] + " " + d.getFullYear();
  }

  /* Folden hamtas pa sin SYNLIGA rubrik och inte pa en klass eller en
     ordningsposition: rubriken ar det enda som betyder samma sak i alla fem
     mallarna, och den ar agargodkand text. */
  function folden(rubrik) {
    var alla = document.querySelectorAll(".offer details.o-fold, .o-main details.o-fold, details.o-fold");
    for (var i = 0; i < alla.length; i++) {
      var s = alla[i].querySelector("summary");
      if (!s) continue;
      if (s.textContent.trim().toLowerCase() === rubrik.toLowerCase()) {
        if (alla[i].closest("#skarmAccept")) continue;   /* inte vara egna kloner */
        return alla[i];
      }
    }
    return null;
  }

  /* FYLLD EN GANG PER OPPNING, INTE EN GANG PER KLICK. Forsta versionen
     fyllde pa varje klick i dokumentet, och det ar en bugg som ser ut som att
     foldarna ar trasiga: kunden trycker pa "Villkor", browsern oppnar den, och
     i SAMMA klick bygger den har filen om #oaFolds fran grunden sa den oppnade
     folden byts mot en ny stangd klon. Uppmatt 29 oktober: details.open blev
     true, men elementet lag inte kvar i dokumentet. Agaren sag det som att
     ingenting hande. */
  var fylld = false;

  function fyll(tvinga) {
    if (!tvinga && fylld) return;
    fylld = true;
    var etikett = document.getElementById("oaPaket");
    if (etikett) etikett.textContent = "Att betala";

    /* RADERNA. Fyra mallar bygger dem i #sumRows vid varje val. Tillagget
       har inga val alls och darfor inget #sumRows: dess artiklar star som
       statisk markup i ul.o-art. Bada ar "det kunden just sa ja till", sa
       skarmen tar den som finns och ingen av dem skrivs av hit. */
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

      /* ORDNINGEN AR VAND SEDAN 28 OKTOBER, OCH DET AR ETT AGARBESLUT.
         Da stod villkoren forst och kostnaderna under. Agardokumentet
         "Bokningsbekraftelse & Godkand offert" 29 oktober sager tvartom,
         ordagrant: "Det vi behover lagga till ar ovanfor villkor", och
         raknar sedan upp kostnaderna som 1 och forberedelserna som 2.
         Villkoren ligger darfor sist. */
      function las(el) {
        if (!el) return;
        var k = el.cloneNode(true);
        k.removeAttribute("id");
        k.removeAttribute("open");
        k.querySelectorAll("[id]").forEach(function (e) { e.removeAttribute("id"); });
        rutan.appendChild(k);
      }

      las(folden("Kostnader som kan tillkomma"));

      /* FORBEREDELSERNA kommer inte ur en fold pa sidan utan ur en
         <template id="oaForbered"> som bygg.py renderar ur
         katalog/forberedelser.json. Texten hor hemma forst nar kunden har
         sagt ja, sa den far inte ligga synlig pa offerten. Men den far inte
         heller skrivas av in i det delade blocket: den sager olika saker for
         laddbox, elcentral och batteri, och service och tillagg har ingen
         alls. En <template> ar bade EN kalla och osynlig, vilket ar precis
         de tva kraven. */
      var mallen = document.getElementById("oaForbered");
      if (mallen && mallen.content) {
        var f = mallen.content.querySelector("details.o-fold");
        if (f) las(f);
      }

      las(folden("Villkor"));
      rutan.hidden = !rutan.children.length;
    }
  }

  /* HOOKEN AR EN BUBBLANDE KLICKLYSSNARE PA document, OCH DET AR INTE
     GODTYCKLIGT. Forsta forsoket var en MutationObserver pa hidden-attributet.
     Den fungerar for en manniska men inte for ett prov: observerade callbacks
     kors som MIKROUPPGIFT efter det synkrona blocket, sa en sond som klickar
     och sedan direkt laser #oaRader laser en tom ruta. Uppmatt 28 oktober,
     fem mallar, alla fem "acceptskarmen bar INGA rader" trots att fyllningen
     fanns pa sidan. Ett prov som inte kan se ratt svar ar lika oanvandbart som
     ett som inte kan se fel svar.

     En lyssnare pa document i bubbelfasen kors i SAMMA klickhandelse, efter
     mallens egen hanterare pa sjalva knappen, eftersom en hanterare pa
     elementet alltid gar fore en pa document. Alltsa synkront, och utan att
     rora fem separata visaSkarm(). Observern star kvar for de vagar som inte
     gar via ett klick. */
  document.addEventListener("click", function () {
    if (!skarm.hidden) fyll(false);
  });

  /* Observern aterstaller flaggan nar skarmen gommes och fyller OM nar den
     visas igen, sa en kund som gar tillbaka, andrar sina val och accepterar en
     gang till far de nya raderna och inte de gamla. */
  new MutationObserver(function () {
    fylld = false;
    if (!skarm.hidden) fyll(true);
  }).observe(skarm, { attributes: true, attributeFilter: ["hidden"] });

  if (!skarm.hidden) fyll(true);
})();
