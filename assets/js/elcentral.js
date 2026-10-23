(function(){
  "use strict";
  function $(id){ return document.getElementById(id); }
  function kr(n){ return n.toLocaleString("sv-SE").replace(/ /g," ") + " kr"; }

  var PKG={"5990": {"namn": "Liten", "spec": "", "passar": "Passar till lägenheter eller mindre hus, där centralen matar det som redan finns.", "bildsrc": "assets/img/hager-liten.webp"}, "9990": {"namn": "Medel", "spec": "", "passar": "Passar till villor och radhus som de ser ut i dag, med plats kvar för det som kommer sedan.", "bildsrc": "assets/img/hager-mellan.webp"}, "14900": {"namn": "Stor", "spec": "", "passar": "Passar till hus som ska bära laddbox, värmepump och solceller utan att centralen rörs igen.", "bildsrc": "assets/img/hager-stor.webp"}};
  var TAK={"5990": 7, "9990": 9, "14900": null};
  var TRAPPA={"ellevio": {"namn": "Ellevio", "omrade": "Stockholms stad, Lidingö, Ekerö", "galler": "2026-06-01", "villa": {"16": 450, "20": 590, "25": 740, "35": 1130, "50": 1730, "63": 2480}, "lagenhetPlatt": 120, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": false}, "vattenfall": {"namn": "Vattenfall Eldistribution", "omrade": "Huvudsta, Huddinge, Drefviken, Tyresö, Uppsala, stora delar av Mälardalen", "galler": "2026-01-01", "villa": {"16": 481, "20": 674, "25": 844, "35": 1158, "50": 1662, "63": 2240}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": 25, "effektavgift": false}, "nacka": {"namn": "Nacka Energi", "omrade": "Nacka", "galler": "2026-01-01", "villa": {"16": 276, "20": 444, "25": 549, "35": 1126, "50": 1408, "63": 1971}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": true}, "seom": {"namn": "SEOM", "omrade": "Sollentuna", "galler": "2026-01-01", "villa": {"16": 148, "20": 148, "25": 148, "35": 265, "50": 373}, "lagenhetPlatt": null, "plattUppTill": 25, "enfas16UppTill": null, "effektavgift": true}, "boo": {"namn": "Boo Energi", "omrade": "Saltsjö-Boo", "galler": "2026-01-01", "villa": {"16": 333, "20": 379, "25": 440, "35": 580, "50": 794, "63": 980}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": false}, "malarenergi": {"namn": "Mälarenergi Elnät", "omrade": "Västerås", "galler": "2026-07-01", "villa": {"16": 360, "20": 385, "25": 420, "35": 490, "50": 600, "63": 690}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": false}, "eem": {"namn": "EEM Elnät", "omrade": "Eskilstuna", "galler": "2026-01-01", "villa": {"16": 405, "20": 536, "25": 654}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": false}, "norrtalje": {"namn": "Norrtälje Energi", "omrade": "Norrtälje", "galler": "2025-04-01", "villa": {"20": 393, "25": 582, "35": 1067, "50": 1650, "63": 2332}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": false}, "upplands": {"namn": "Upplands Energi", "omrade": "Uppland", "galler": "2025-01-01", "villa": {"16": 361, "20": 520, "25": 640, "35": 822, "50": 1150, "63": 1572}, "lagenhetPlatt": null, "plattUppTill": null, "enfas16UppTill": null, "effektavgift": false}};
  var KAPACITET={"16": 11, "20": 14, "25": 17, "35": 24, "50": 35, "63": 44};
  var EFFEKT_FINNS=false;
  var KARENS=12;
  var LEDTID=10;
  var HS_TEST="Byt mätarsäkringarna ett steg ner och lev med det genom en period när huset drar som mest. Håller det byter vi bottenplattan sedan. Håller det inte sätter vi tillbaka dem, och du har inte bundit dig vid någonting.";
  var HS_RIKTNING="A";
  var GRANNRABATT=500;
  var BOKARE="assets/img/felix.webp";
  var ARBETSANDEL=0.8;
  var ORDNING = Object.keys(PKG).sort(function(a,b){ return a - b; });

  var offer = document.querySelector(".offer");
  if (!offer) return;

  /* ---- BILDSTEGET. Bilderna lamnar ALDRIG webblasaren -------------------
     Ingen fetch, ingen FormData, ingen base64 in i sidan. createObjectURL
     ger en blob:-adress som bara finns i den har fliken och som aterkallas
     nar den byts ut. Bildregeln i GRENEN.md ar skriven for produktion, men
     prototypen far inte heller vara det stallet dar en kundbild forst
     hamnar nagon annanstans. */
  var bildVald = { bildCentral:false };
  var inpBild = $("bildCentral");
  if (inpBild) inpBild.addEventListener("change", function(){
    var ruta = inpBild.closest(".o-bildruta");
    var status = document.querySelector('.o-bildstatus[data-for="bildCentral"]');
    var har = !!(inpBild.files && inpBild.files.length);
    bildVald.bildCentral = har;
    if (ruta) ruta.classList.toggle("har", har);
    if (status) status.textContent = har ? "Vald" : "";
    rekommendera();
  });

  /* ---- REKOMMENDATIONEN -------------------------------------------------
     GRIND: det har ar den enda platsen dar en automatisk storleksrekommendation
     skulle bo, och den ar MEDVETET tom. Experimentet som avgor om tre
     elektriker ens ar overens om samma bild ar inte kort. Tills det ar kort
     sager sidan vad som hander harnast, och gissar inte at kunden.
     Se beslutsunderlaget punkt C. */
  function rekommendera(){
    var rad = $("rekRad");
    if (!rad) return;
    if (bildVald.bildCentral) {
      rad.hidden = false;
      rad.textContent = "Tack. Felix tittar på bilden och bekräftar vilken storlek som gäller innan du behöver bestämma dig.";
    } else {
      rad.hidden = true;
    }
  }

  /* ---- STORLEKEN -------------------------------------------------------- */
  function valdStorlek(){
    var v = offer.querySelector('input[name="pkg"]:checked');
    return v ? v.value : Object.keys(PKG)[0];
  }
  function valdTid(){
    var v = offer.querySelector('input[name="tid"]:checked');
    return v ? parseInt(v.value, 10) : 0;
  }

  /* ---- SUMMAN, OCH DE TVA POTTERNA -------------------------------------
     Elcentralen och tillaggen ar ROT, 30 procent av arbetskostnaden.
     Laddboxen under Ovriga tjanster ar GRON TEKNIK, 50 procent rakt av.
     Tva avdragsbaser far aldrig blandas i en kolumn, sa alla tal pa sidan ar
     BRUTTO. Laddboxens tal ar darfor laddboxsidans nettopris gange tva.
     Raknar vi nagonsin ut ett nettopris maste potterna hallas isar, annars
     raknas samma krona tva ganger. Darfor bar varje rad sin pott redan nu,
     fast inget avdrag visas an. */
  function poster(){
    var ut = [];
    offer.querySelectorAll(".add:checked, .intresse:checked").forEach(function(c){
      var rad = c.closest(".o-rad");
      var ant = rad ? rad.querySelector("[data-antal]") : null;
      var sel = rad ? rad.querySelector(".o-variant") : null;
      var n = ant ? Math.max(1, parseInt(ant.value, 10) || 1) : 1;
      var styck = sel ? parseInt(sel.value, 10) : parseInt(c.value, 10);
      ut.push({
        namn: c.getAttribute("data-name"),
        grupp: c.getAttribute("data-grupp"),
        antal: n,
        styck: isNaN(styck) ? null : styck,
        belopp: isNaN(styck) ? null : styck * n,
        pott: c.getAttribute("data-avdrag") || "rot",
        variant: sel ? sel.options[sel.selectedIndex].textContent : null
      });
    });
    return ut;
  }

  function rakna(){
    /* Skriptet kor. Nu far prisytorna visas, se js-redo i system.css. */
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');

    var nyckel = valdStorlek();
    var p = PKG[nyckel];
    var bas = parseInt(nyckel, 10);
    var tid = valdTid();
    var rader = poster();

    var summa = bas + tid;
    var potter = { rot: bas + tid, gt: 0 };
    rader.forEach(function(r){
      if (r.belopp == null) return;
      summa += r.belopp;
      potter[r.pott === "gt" ? "gt" : "rot"] += r.belopp;
    });

    /* Hjalten */
    if (p) {
      /* Agarbesked 19 okt: hjalten sager Elcentral + installation, inte
         storleksnamnet. Raden fanns statiskt i markupen men JS skrev over den
         med namn + spec, och spec ar tom sedan korten bara bar namnet, sa det
         stod "Liten, " pa sidan. Rubriken ar konstant nu; valet syns i
         spec-raden under och i summeringen. */
      $("prodName").textContent = "Elcentral + installation";
      $("prodSpec").textContent = p.passar;
      var bild = $("heroImg");
      if (bild && p.bildsrc) { bild.src = p.bildsrc; bild.alt = "Hager elcentral, " + p.spec; }
    }
    $("calcFinalEtikett").textContent = (summa > bas) ? "Ditt pris, med dina val" : "Ditt pris";

    /* INGET AVDRAG RAKNAS HAR LANGRE.
       Agarbesked 22 okt: "Elcentral och installation for 5 990 ar inklusive
       moms efter ROT-avdrag. Det ar bara det vi SKA visa."
       Talen i paket.json och i katalogen ar alltsa NETTO, precis som pa
       laddboxsidorna. Den har mallen drog ROT en gang till ovanpa det, sa
       samma lilla central kostade 5 990 kr pa laddboxsidan och 4 552 har.
       Motorn summerar nu och ingenting annat.

       Det gamla bruttot gick inte heller att rakna: det byggde pa
       ARBETSANDEL 0,8, som star som oppet [GAP] i paket.json med Felix som
       agare. Ett harlett tal ur en ogissad andel ar en gissning med
       decimaler. */
    var netto = summa;

    /* Summeringen */
    var rows = "";
    if (p) rows += '<div class="o-sumrow"><span>' + p.namn + ", " + p.spec + '</span><span class="kr">' + kr(bas) + "</span></div>";
    if (tid) rows += '<div class="o-sumrow"><span>' + (tid === 1500 ? "Prioritet" : "Express") + '</span><span class="kr">' + kr(tid) + "</span></div>";

    var utanPris = [];
    rader.forEach(function(r){
      if (r.belopp == null) { utanPris.push(r.namn); return; }
      var etikett = r.variant ? (r.namn + ", " + r.variant) : r.namn;
      if (r.antal > 1) etikett += ", " + r.antal + " st";
      rows += '<div class="o-sumrow"><span>' + etikett + '</span><span class="kr">' + kr(r.belopp) + "</span></div>";
    });
    if (utanPris.length) {
      rows += '<div class="o-sumrow"><span><b>Vi hör av oss om</b></span><span></span></div>';
      utanPris.forEach(function(n){
        rows += '<div class="o-sumrow"><span>' + n + '</span><span class="kr saknas">pris saknas</span></div>';
      });
    }

    /* ---- GRANNRABATTEN I SUMMERINGEN ------------------------------------
       Rabatten nadde aldrig hit. Uppmatt 23 okt: granne@exempel.se inbjuden,
       #refLista fick en rad, sumTotal stod kvar pa 5 990 kr, ingen rabattrad
       och inget omnamnande av grannar. Strangarna "Grannrabatt", "500" och
       "refLista" fanns inte i filen.
       Raden andrar INTE talet kunden ska betala i dag, och det ar avsiktligt:
       rabatten dras pa fakturan nar grannen har bestallt, sa ett lagre pris
       har hade varit ett lofte vi inte kan halla. Samma val som laddboxmallen.
       RAKNAT PA SKICKADE INBJUDNINGAR, inte pa chips i faltet. Det delade
       grann.js exponerar window.__grannar(), men den raknar adresser.length +
       lista.children.length, alltsa ocksa adresser kunden har skrivit men inte
       skickat. En rad som sager "1 granne inbjuden" medan ingen inbjudan ar
       skickad ar ett falskt pastaende pa en sida vars hela premiss ar candour.
       #refLista li ar de faktiskt skickade, och det ar samma rakning som
       laddboxmallen gor (offerter/laddbox/skript.js:358), sa de tva ytorna
       beter sig likadant. grann.js anropar window.__render() efter varje
       andring, bade nar ett chip laggs till och nar listan vaxer. */
    var grannar = document.querySelectorAll("#refLista li").length;
    if (grannar) {
      rows += '<div class="o-sumrow disc"><span>Grannrabatt, ' + grannar
        + (grannar > 1 ? " grannar inbjudna" : " granne inbjuden")
        + '</span><span class="kr">dras när de beställt</span></div>'
        + '<div class="o-sumnote">Upp till ' + kr(grannar * GRANNRABATT) + ' av, '
        + GRANNRABATT + ' kr för varje granne som beställer. Ditt pris här ändras inte '
        + 'förrän det hänt.</div>';
    }
    $("sumRows").innerHTML = rows;
    $("calcNet").textContent = kr(netto);
    $("sumTotal").textContent = kr(netto);
    $("barTotal").textContent = kr(netto);

    /* Potterna namnges bara nar bada finns. En rad om tva avdrag pa en sida
       med bara ett avdrag ar brus. */
    /* Potterna namnges nar bada finns. Inga belopp: avdragen ar redan dragna
       i talen, och ett tal till hade varit ett pastaende om hur mycket just
       den har kunden far tillbaka, vilket beror pa hennes eget utrymme. */
    var potRad = $("sumPotter");
    if (potter.gt > 0) {
      potRad.hidden = false;
      potRad.textContent = "Två avdrag: elcentralen är ROT, laddpunkten är grön teknik. "
        + "Priserna är inklusive moms och efter avdrag.";
    } else {
      potRad.hidden = true;
    }

    taket(nyckel, rader);
  }

  /* ---- TAKET. Den arliga merforsaljningen. ------------------------------
     Nar de extra dvargbrytarna gor den valda storleken minst lika dyr som
     nasta sager sidan det sjalv. Talet kommer ur TAK, som bygget harleder ur
     priserna och ett orakel haller sant. Sidan kan alltsa inte saga fel sak
     aven om nagon andrar ett pris. */
  function taket(nyckel, rader){
    var rad = $("takRad");
    if (!rad) return;
    var tak = TAK[nyckel];
    var extra = null;
    rader.forEach(function(r){ if (r.grupp === "dvargbrytare") extra = r; });
    if (tak == null || !extra || extra.antal <= tak) { rad.hidden = true; return; }

    var i = ORDNING.indexOf(nyckel);
    var nasta = ORDNING[i + 1];
    var np = PKG[nasta];
    rad.hidden = false;
    $("takText").innerHTML = "Med " + extra.antal + " extra dvärgbrytare kostar "
      + PKG[nyckel].namn + " <b>" + kr(parseInt(nyckel, 10) + extra.belopp) + "</b>. "
      + np.namn + " kostar <b>" + kr(parseInt(nasta, 10)) + "</b> och har plats för dem från början.";
    var k = $("takKnapp");
    k.textContent = "Byt till " + np.namn;
    k.onclick = function(){
      var inp = offer.querySelector('input[name="pkg"][value="' + nasta + '"]');
      if (!inp) return;
      inp.checked = true;
      var ruta = offer.querySelector('[data-antal="dvargbrytare"]');
      if (ruta) ruta.value = 1;
      var kryss = offer.querySelector('.o-rad input[data-grupp="dvargbrytare"]');
      if (kryss) kryss.checked = false;
      rakna();
      var k2 = offer.querySelector("#pkgs");
      if (k2) k2.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  /* ---- VARIANTRADEN: ETT VAL AR ETT VAL --------------------------------
     .o-variant stod INTE i den har listan, sa ett byte i laddboxens
     paketvaljare rorde ingenting. Uppmatt 23 okt pa den byggda sidan: kryssa
     laddboxraden, summan 14 970 kr, valj Premium i dropdownen, summan
     fortfarande 14 970 kr. Kunden valde det dyraste paketet och sidan
     debiterade det billigaste.
     Och radens egen prislapp skrevs aldrig om: den stod kvar pa Bas-priset
     medan dropdownen sa Premium. Det ar samma defektklass som value mot
     etikett, bara mellan tva element i samma rad. Laddboxmallen skriver om
     .o-radpris vid variantbyte (skript.js:288); nu gor den har det ocksa. */
  function variantpris(sel){
    var rad = sel.closest(".o-rad");
    var pr = rad ? rad.querySelector(".o-radpris") : null;
    var v = parseInt(sel.value, 10);
    if (pr && !isNaN(v)) pr.textContent = "+" + kr(v);
  }
  offer.querySelectorAll(".o-variant").forEach(function(sel){ variantpris(sel); });

  offer.addEventListener("change", function(e){
    if (e.target.matches(".o-variant")) {
      variantpris(e.target);
      /* Ett val i dropdownen ar ett val av raden. Utan det kunde kunden byta
         paket utan att raden var ikryssad, och ingenting hande. */
      var kryss = e.target.closest(".o-rad").querySelector("input.add");
      if (kryss && !kryss.checked) kryss.checked = true;
    }
    if (e.target.matches('input[name="pkg"], input[name="tid"], .add, .intresse, [data-antal], .o-variant')) rakna();
  });
  /* Antalsfaltet ligger inne i etiketten. Utan det har kryssar ett tryck i
     siffran ur hela raden, och kunden tappar valet nar hen andrar antalet. */
  offer.addEventListener("click", function(e){
    if (e.target.matches("[data-antal]")) e.stopPropagation();
  });

  /* ---- FOKUS UTAN SCROLLHOPP -------------------------------------------
     Ett tryck pa en etikett flyttar fokus till den dolda kryssrutan och
     webblasaren drar in den i vyn. Uppmatt pa laddboxsidan: upp till 3 728 px
     hopp. Ett programmatiskt click() ger noll aven utan atgard, sa buggen
     overlever vanliga tester. */
  offer.addEventListener("pointerdown", function(e){
    var lbl = e.target.closest("label");
    if (!lbl) return;
    var inp = lbl.querySelector('input[type="radio"], input[type="checkbox"]');
    if (inp && inp.focus) inp.focus({ preventScroll: true });
  }, true);

  /* ---- KNAPPARNA -------------------------------------------------------- */
  var go = $("barGo");
  if (go) go.addEventListener("click", function(){
    var s = $("summering");
    if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  var fr = $("fraga");
  if (fr) fr.addEventListener("click", function(){
    var panel = $("fragaPanel");
    var oppen = panel.hidden;
    panel.hidden = !oppen;
    fr.setAttribute("aria-expanded", oppen ? "true" : "false");
  });
  var frSend = $("fragaSend");
  if (frSend) frSend.addEventListener("click", function(){
    $("fragaHint").textContent = "Skickad. Felix svarar på samma mejladress som offerten kom till.";
  });

  /* ---- FORE OCH EFTER. Samma tva rader som laddboxofferten. ------------- */
  (function(){
    var r = $("feReglage");
    if (!r) return;
    var box = r.closest(".o-fe");
    r.addEventListener("input", function(){ box.style.setProperty("--fe", this.value); });
  })();

  /* ---- EFTERSPELET -------------------------------------------------------
     Accept- och avbonsskarmarna ar samma som laddboxoffertens, hamtade ur den
     vid bygget. En kund som fatt bada offerterna ska mota samma efterspel. */
  function visaSkarm(id){
    var sk = $(id);
    if (!sk) return;
    offer.classList.add("visarSkarm");
    sk.hidden = false;
    sk.classList.add("syns");
    /* EN SKARMLASARE MASTE FA VETA ATT KOPET GICK IGENOM.
       Uppmatt med riktigt Enter pa Acceptera offert: fokus hamnade pa body,
       for regeln .offer.visarSkarm > *:not(.o-skarm) slacker knappen som hade
       fokus. Skarmen hade varken role, aria-live eller tabindex, sa en blind
       kund horde ingenting efter ett kop pa tiotusentals kronor och hade en
       enda fokuserbar sak kvar pa sidan: telefonnumret.
       tabindex -1 plus focus() flyttar lasmarkoren in i skarmen, och da laser
       uppläsaren rubriken och det som star under den. */
    sk.setAttribute("tabindex", "-1");
    if (!sk.getAttribute("role")) sk.setAttribute("role", "status");
    try { sk.focus({preventScroll:true}); } catch(e) { try { sk.focus(); } catch(e2){} }

    /* Laddboxofferten slar upp #scroller, som ar granskningsramens element.
       Elcentralen har ingen ram och inget #scroller. document.scrollingElement
       racker, och ett id som inte finns hade stoppats av byggets orakel anda. */
    var sc = document.scrollingElement;
    if (sc) sc.scrollTop = 0; else window.scrollTo(0, 0);
  }
  var acc = $("acceptBtn");
  if (acc) acc.addEventListener("click", function(){ visaSkarm("skarmAccept"); });

  /* ---- AVBOJ. Saknades helt i v1, pastod av head of sales 19 okt. -------- */
  var av = $("avboj");
  if (av) av.addEventListener("click", function(){
    var panel = $("avbojPanel");
    var oppen = panel.hidden;
    panel.hidden = !oppen;
    av.setAttribute("aria-expanded", oppen ? "true" : "false");
  });
  var avSend = $("avbojSend");
  if (avSend) avSend.addEventListener("click", function(){ visaSkarm("skarmAvboj"); });

  /* ===== HUVUDSAKRINGEN ===================================================
     Eget steg, som vagg-eller-stolpe i laddboxofferten.

     TRE GRINDAR, och alla tre ar sanningar och inte designval:

     1. BESPARINGEN RAKNAS, den pastas inte. Trappan kommer ur natbolag.json
        och ar normaliserad till kr per manad inkl moms i bygget. Ett belopp far
        aldrig skrivas i copyn: andras en avgift ska en fil andras.

     2. NOLLFALLET AR HUVUDFALLET. Fyra fall ger exakt noll: Ellevio lagenhet
        har platt avgift, SEOM har platt pris for hela 16 till 25 A, Vattenfall
        enfas upp till 25 A betalar 16 A-priset, och den som redan ligger
        lagst kan inte ga ner. Ett block som visar en besparing dar tappar
        fortroendet pa sidans enda stalle dar vi pastar nagot om kundens egen
        faktura. Noll star som ett BESKED, inte som ett misslyckande.

     3. EFFEKTBERAKNINGEN AR DOLD tills effekttalen finns. Att summera
        markeffekter rakt av ger ett tal som ar for hogt, och ett gissat
        effekttal ar ett rad om nagon annans huvudsakring. Apparatlistan
        visas inte forran EFFEKT_FINNS ar sant. */

  var HS_TRAPPA_NIVAER = [16, 20, 25, 35, 50, 63];

  function hsNastaNer(amp){
    var i = HS_TRAPPA_NIVAER.indexOf(amp);
    return (i > 0) ? HS_TRAPPA_NIVAER[i - 1] : null;
  }

  /* Returnerar ett besked, aldrig ett tal utan forklaring. */
  function hsBesked(amp, bolagId, boende, enfas){
    var t = TRAPPA[bolagId];
    if (!t) return null;
    if (!amp || HS_TRAPPA_NIVAER.indexOf(amp) < 0) {
      return { typ: "okant", text: "Vanliga storlekar är 16, 20, 25, 35, 50 och 63 ampere. "
        + "Står det något annat på din mätartavla tittar vi på den tillsammans." };
    }
    if (boende === "lagenhet" && t.lagenhetPlatt != null) {
      return { typ: "noll", text: "Hos " + t.namn + " är lägenhetsavgiften densamma oavsett säkring. "
        + "En sänkning ger dig <b>ingenting</b>, så vi föreslår den inte." };
    }
    var ner = hsNastaNer(amp);
    if (ner == null) {
      return { typ: "noll", text: amp + " A är den lägsta vanliga storleken. "
        + "Det finns inget steg ner, och det är ett gott tecken: du betalar redan minst." };
    }
    if (t.plattUppTill && amp <= t.plattUppTill && ner <= t.plattUppTill) {
      return { typ: "noll", text: "Hos " + t.namn + " kostar 16 till " + t.plattUppTill
        + " A exakt lika mycket. Du betalar alltså redan som om du hade " + ner
        + " A, och en sänkning ger <b>ingenting</b>." };
    }
    if (enfas && t.enfas16UppTill && amp <= t.enfas16UppTill) {
      return { typ: "noll", text: "Med enfas och " + amp + " A betalar du redan 16 A-priset hos "
        + t.namn + ". En sänkning ger <b>ingenting</b>." };
    }
    var fran = t.villa[String(amp)], till = t.villa[String(ner)];
    if (fran == null || till == null) {
      return { typ: "okant", text: "Vi har inte " + t.namn + "s pris för " + amp
        + " A inläst. Felix kontrollerar det och återkommer." };
    }
    var diff = fran - till;
    if (diff <= 0) {
      return { typ: "noll", text: "Hos " + t.namn + " kostar " + ner + " A inte mindre än "
        + amp + " A. En sänkning ger <b>ingenting</b>." };
    }
    return { typ: "besparing", kr: diff, fran: amp, till: ner, bolag: t.namn,
      effektavgift: t.effektavgift };
  }

  /* ---- TRE RIKTNINGAR -----------------------------------------------------
     En mall i DOM:en at gangen, sa id:n aldrig dubbleras. Vaxlaren hor till
     granskningen. Besked-funktionen ar DELAD: alla tre far samma svar, och det
     ar presentationen som skiljer dem at, inte sanningen. */
  var NIVAER = [63, 50, 35, 25, 20, 16];
  var hsVariant = "A", hsSettResultat = false, hsSettNoll = false, hsAngiven = false;

  function hsLas(){
    var a = $("hsAmp"), b = $("hsBolag"), bo = $("hsBoende"), f = $("hsEnfas");
    if (!a) return null;
    var amp = parseInt(a.value, 10);
    var t = TRAPPA[b.value];
    /* Fasfragan stalls BARA nar den andrar svaret. En ruta som aldrig spelar
       roll kostar konvertering gratis. */
    var behovs = !!(t && t.enfas16UppTill && amp && amp <= t.enfas16UppTill && bo.value === "villa");
    var svep = f && (f.closest(".hsA__f") || f.closest(".hsC__f") || f.closest(".hsB__fas"));
    if (svep) svep.hidden = !behovs;
    return { amp: amp, bolag: b.value, boende: bo.value, enfas: behovs && f && f.value === "1" };
  }

  function hsVagarHtml(b){
    return '<div class="o-card o-hs__vag"><b class="o-hs__vagtitel">Prova först, byt sen</b>'
      + '<p class="t-small" style="color:var(--muted);">' + HS_TEST + "</p>"
      + '<label class="o-rad o-rad--utanbild o-rad--naken">'
      + '<input type="checkbox" class="intresse" data-grupp="hs-test" data-name="Prova en lägre säkring först">'
      + '<span class="mark sq"></span><span class="o-radtext">'
      + '<span class="o-radnamn">Byt mätarsäkringarna åt mig</span>'
      + '<span class="o-radspec">pris saknas</span></span></label></div>'
      + '<div class="o-card o-hs__vag"><b class="o-hs__vagtitel">Sänk på riktigt</b>'
      + '<p class="t-small" style="color:var(--muted);">Vi byter bottenplattan och anmäler till '
      + "nätägaren. Det kostar ingenting hos nätbolaget och börjar gälla efter " + LEDTID
      + " dagar. <b>Sedan måste den sitta kvar i " + KARENS + " månader</b> innan den får ändras "
      + "igen, så det är värt att vara säker först.</p>"
      + '<label class="o-rad o-rad--utanbild o-rad--naken">'
      + '<input type="checkbox" class="intresse" data-grupp="hs-sank" data-name="Sänk huvudsäkringen">'
      + '<span class="mark sq"></span><span class="o-radtext">'
      + '<span class="o-radnamn">Sänk min huvudsäkring</span>'
      + '<span class="o-radspec">pris saknas</span></span></label></div>';
  }

  /* --- A. TRAPPAN. Mekanismen ritad: du betalar for ett steg du star pa. --- */
  function hsRitaA(v, b){
    var t = TRAPPA[v.bolag], lista = $("hsTrappa"), svar = $("hsSvar");
    if (!lista) return;
    var html = "";
    NIVAER.forEach(function(n){
      var pris = t.villa[String(n)];
      if (pris == null) return;
      var kl = "hsA__steg", lapp = "";
      if (v.amp === n) { kl += " nu"; lapp = '<span class="hsA__lapp">Du är här</span>'; }
      else if (b.typ === "besparing" && b.till === n) { kl += " mal"; lapp = '<span class="hsA__lapp">minus ' + kr(b.kr) + "</span>"; }
      else if (v.amp && n > v.amp) kl += " over";
      html += '<li class="' + kl + '"><b>' + n + " A</b>" + lapp
        + '<span class="hsA__kr">' + kr(pris) + "/mån</span></li>";
    });
    lista.innerHTML = html;
    /* Trappan visar sjalv besparingen, sa svarsraden behovs bara nar det INTE
       finns nagon. Och den satts bara nar det finns text: ett tomt lage gav
       tidigare innerHTML = undefined, som star kvar som ordet "undefined". */
    var harText = (b.typ !== "besparing") && !!b.text;
    svar.hidden = !harText;
    svar.innerHTML = harText ? b.text : "";
  }

  /* --- B. BESKEDET. Ett svar fran Felix, inte ett resultat. -------------- */
  function hsRitaB(v, b){
    var svar = $("hsSvar");
    if (!svar) return;
    var text = (b.typ === "besparing")
      ? "Du betalar <b>" + kr(TRAPPA[v.bolag].villa[String(b.fran)]) + " i månaden</b> för din "
        + b.fran + " A hos " + b.bolag + ". Går du ner till " + b.till + " A blir det <b>"
        + kr(b.kr) + " mindre</b> varje månad. Jag räknar igenom om huset klarar det innan vi gör något."
      : b.text;
    svar.hidden = false;
    svar.innerHTML = '<span class="hsB__foto"><img src="' + BOKARE + '" alt="" width="192" height="192"></span>'
      + '<div class="hsB__text"><p>' + text + "</p>"
      + '<figcaption class="hsB__namn">Felix C, har räknat på ditt jobb</figcaption></div>';
  }

  /* --- C. KVITTOT. Kundens egen rad pa natfakturan. ----------------------- */
  function hsRitaC(v, b){
    var ruta = $("hsSvar");
    if (!ruta) return;
    ruta.hidden = false;
    if (b.typ !== "besparing") { ruta.innerHTML = '<p class="hsC__noll">' + b.text + "</p>"; return; }
    var t = TRAPPA[v.bolag];
    ruta.innerHTML =
      '<div class="hsC__rad"><span>Din fasta nätavgift i dag, ' + b.fran + " A</span>"
      + '<span class="hsC__belopp">' + kr(t.villa[String(b.fran)]) + "/mån</span></div>"
      + '<div class="hsC__rad"><span>Samma rad med ' + b.till + " A</span>"
      + '<span class="hsC__belopp">' + kr(t.villa[String(b.till)]) + "/mån</span></div>"
      + '<hr class="hsC__strek">'
      + '<div class="hsC__diff"><span>Skillnad</span><span class="hsC__tal">' + kr(b.kr) + "</span></div>"
      + '<p class="hsC__not">Per månad, inklusive moms, hos ' + b.bolag
      + ". Överföringsavgiften per kWh är densamma oavsett säkring.</p>";
  }

  function hsRita(){
    var v = hsLas();
    if (!v) return;
    var svar = $("hsSvar"), vagar = $("hsVagar");
    if (!v.amp) { if (svar) svar.hidden = true; if (vagar) vagar.hidden = true;
      if (hsVariant === "A") hsRitaA(v, { typ: "tom" }); return; }

    var b = hsBesked(v.amp, v.bolag, v.boende, v.enfas);
    if (hsVariant === "A") hsRitaA(v, b);
    else if (hsVariant === "B") hsRitaB(v, b);
    else hsRitaC(v, b);

    if (vagar) {
      vagar.hidden = (b.typ !== "besparing");
      if (b.typ === "besparing" && !vagar.innerHTML) vagar.innerHTML = hsVagarHtml(b);
    }
    if (b.typ === "besparing" && !hsSettResultat) {
      hsSettResultat = true; hsHandelse("huvudsakring_resultat_sett", { kr: b.kr, variant: hsVariant });
    }
    if (b.typ === "noll" && !hsSettNoll) {
      hsSettNoll = true; hsHandelse("huvudsakring_nollbesparing_visad", { amp: v.amp, bolag: v.bolag });
    }
  }

  function hsVisa(bokstav){
    var yta = $("hsYta"), mall = document.getElementById("hsVariant" + bokstav);
    if (!yta || !mall) return;
    hsVariant = bokstav;
    yta.innerHTML = "";
    yta.appendChild(mall.content.cloneNode(true));
    var a = $("hsAmp");
    if (a) {
      ["input", "change"].forEach(function(e){
        a.addEventListener(e, function(){
          if (!hsAngiven && parseInt(a.value, 10)) {
            hsAngiven = true;
            hsHandelse("huvudsakring_angiven", { amp: parseInt(a.value, 10) });
          }
          hsRita();
        });
      });
    }
    ["hsBolag", "hsBoende", "hsEnfas"].forEach(function(id){
      var e = $(id); if (e) e.addEventListener("change", hsRita);
    });
    hsRita();
  }

  /* ---- HANDELSERNA. Samtyckesgrindade, koade tills kontraktet finns. ----- */
  var HS_KO = [];
  function hsHandelse(namn, data){
    HS_KO.push({ h: namn, d: data || {}, t: Date.now() });
    window.ampyHandelser = HS_KO;
  }

  /* RIKTNINGEN KOMMER UR DATAT, INTE UR EN VAXLARE PA SIDAN.
     Fram till 23 okt hangde hela huvudsakringsblocket pa att en A/B/C-vaxlare
     fanns i markupen: utan den anropades hsVisa aldrig och #hsYta stod tom.
     Vaxlaren var samtidigt synlig for kunden, 44 px hog, och klicken bytte
     faktiskt block. Nu satter bygget in BARA den valda mallen och HS_RIKTNING
     sager vilken, sa blocket renderas utan att nagot gar att vaxla. */
  if ($("hsYta")) hsVisa(HS_RIKTNING);
  offer.addEventListener("change", function(e){
    if (e.target.matches('.add[data-grupp="laddbox"]')) hsRita();
    if (e.target.matches('.intresse[data-grupp^="hs-"]') && e.target.checked)
      hsHandelse("huvudsakring_intresse", { val: e.target.getAttribute("data-grupp") });
  });

  /* GRANNRABATTEN LIGGER I DET DELADE BLOCKET, INTE HAR.
     Den har kopian hade fyra odeklarerade variabler: kop, f, skick, mej och
     lista. Raden `if (!kop) return;` kastade ReferenceError vid laddning, och
     felet propagerade ut genom bada IIFE:erna, sa rakna() pa raden under
     kordes ALDRIG. Foljden, uppmatt pa den byggda sidan: hjalten stod pa
     "5 990 till 12 900 kr", ROT-raden pa literalen [GAP], summeringen pa noll
     rader och hjaltebilden visade Medel fast Liten var ikryssad.
     Forsta klicket lakte allt, for change-lyssnaren hann registreras fore
     kraschen, och darfor overlevde felet.
     gemensamt/block/grann.js gor redan jobbet och laddas via META js_efter. */

  rakna();
  rekommendera();

  /* UTSKRIFTEN. En stangd <details> tar inte med sitt innehall pa papperet,
     oavsett vad CSS sager om barnet, for ::details-content bar
     content-visibility:hidden. Villkoren och kostnaderna som kan tillkomma
     saknades darfor i den utskrivna offerten. Foldarna oppnas har och
     aterstalls efterat, sa skarmen ser likadan ut som forut. */
  (function(){
    var fore = [];
    function oppna(){
      /* Bade beforeprint och matchMedia("print") fyrar i vissa webblasare, och
         den har kordes da tva ganger. Andra varvet las e.open, som forsta
         varvet just satt till true, sa alla foldar mindes sig sjalva som
         oppna och stod kvar oppna efter utskriften. Mat: [0,0,0,0,0] blev
         [1,1,1,1,1]. Minnet skrivs darfor bara nar det ar tomt. */
      if (fore.length) return;
      fore = [].slice.call(document.querySelectorAll("details"));
      fore.forEach(function(e){ e.dataset.varOppen = e.open ? "1" : "0"; e.open = true; });
    }
    function aterstall(){
      fore.forEach(function(e){ e.open = e.dataset.varOppen === "1"; delete e.dataset.varOppen; });
      fore = [];
    }
    window.addEventListener("beforeprint", oppna);
    window.addEventListener("afterprint", aterstall);
    if (window.matchMedia) {
      var mq = window.matchMedia("print");
      var lyssna = mq.addEventListener ? mq.addEventListener.bind(mq, "change") : null;
      if (lyssna) lyssna(function(e){ e.matches ? oppna() : aterstall(); });
    }
  })();

  /* grann.js i gemensamt behover kunna rakna om summan.
     Raden lag UTANFOR IIFE:n, dar rakna inte finns, sa typeof gav "undefined"
     och window.__render sattes aldrig. Grannrabatten nadde darfor aldrig
     summeringen: uppmatt, granne inbjuden och summan ororlig. */
  window.__render = rakna;

})();
