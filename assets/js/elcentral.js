(function(){
  "use strict";
  function $(id){ return document.getElementById(id); }
  /* ETT TAL, ETT TECKEN. Tusentalen skiljs med HARDSPATIE (U+00A0) och enheten
     sitter fast vid talet med samma tecken, sa ett belopp aldrig kan brytas
     "10 / 490 kr" i en smal rad. Forut byttes toLocaleString:s hardspatie mot
     ett VANLIGT mellanslag, sa 22 av 22 belopp pa sidan bar ett annat tecken
     an servicemallen (NBSP 16 av 16) och laddboxen (NBSP 28 av 31), uppmatt
     23 okt. Samma rad som servicemallen och som byggets _kr i offert.py:
     oraklet tusentalsavgransare haller dem lika och bevisar raden med node.
     Avrundas EN gang, har, i renderaren. */
  function kr(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0kr"; }

  var PKG={"5990": {"namn": "Liten", "spec": "", "passar": "Passar till lägenheter eller mindre hus, där centralen matar det som redan finns.", "bildsrc": "assets/img/hager-liten.webp", "grupper": 7}, "9990": {"namn": "Medel", "spec": "", "passar": "Passar till villor och radhus som de ser ut i dag, med plats kvar för det som kommer sedan.", "bildsrc": "assets/img/hager-mellan.webp", "grupper": 16}, "14900": {"namn": "Stor", "spec": "", "passar": "Passar till hus som ska bära laddbox, värmepump och solceller utan att centralen rörs igen.", "bildsrc": "assets/img/hager-stor.webp", "grupper": 32}};
  var TAK={"5990": 7, "9990": 9, "14900": null};
  var RYMS={"5990": 0, "9990": 0, "14900": 10};
  var TJANSTPOTT={"laddbox": "gt"};
  var GRANNRABATT=500;
  var ORDNING = Object.keys(PKG).sort(function(a,b){ return a - b; });

  var offer = document.querySelector(".offer");
  if (!offer) return;

  /* ---- RULLNINGEN FRAGAR OM RORELSE ------------------------------------
     Chrome kor INGEN mjuk rullning alls nar prefers-reduced-motion: reduce
     ar satt, sa scrollIntoView({behavior:"smooth"}) rakt av blir en DOD
     knapp, inte en snabbare rullning. Uppmatt 25 okt vid 375 px med riktigt
     tryck (pointerdown fore click) och reducerad rorelse pa:

       mall       scrollY fore -> efter   summeringens topp   nadde
       laddbox    0 -> 7509               7509                ja
       batteri    0 -> 2084               2084                ja
       elcentral  0 -> 0                  6198                NEJ

     De tva raderna nedan ar BYTE-IDENTISKA med offerter/laddbox/skript.js.
     Det ar inte kopiering for kopieringens skull: oraklet rullningen_fragar
     i offert.py laser laddboxens rader och stoppar bygget om de inte star
     ordagrant har, sa de kan inte driva isar, och koordinatorn kan lyfta dem
     till gemensamt/bitar.py utan att rora en enda mall. En tredje variant av
     samma rad ar precis den defektklassen vi arbetar bort. */
  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }

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
      /* VAD SIDAN GOR, INTE VAD VI ONSKAR. Bilden lamnar aldrig webblasaren
         (se ovan), sa "Felix tittar pa bilden" var ett lofte sidan inte kunde
         halla, och "innan du behover bestamma dig" stod bredvid en aktiv
         Acceptera-knapp (CMO-granskningen 23 okt, fynd 1). Texten sager nu det
         som ar sant: bilden ar vald, och priset galler den storlek kunden
         sjalv valjer. Vad steget ska vara ar en agarfraga med tre riktningar. */
      rad.textContent = "Tack, bilden är vald. Priset här gäller den storlek du själv väljer i steg 2.";
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
        variant: sel ? sel.options[sel.selectedIndex].textContent : null,
        /* Batteriraderna (bitar.tjanstrader) bar sitt fran-pris i data-fran.
           Det ar inte ett belopp pa summan, men det ar talet raden visar, och
           summeringen ska saga samma sak som raden. */
        fran: c.getAttribute("data-fran") || null
      });
    });
    return ut.concat(tjansteval());
  }

  /* ---- PAKETKORTEN UNDER OVRIGA TJANSTER --------------------------------
     tjanstekort() i gemensamt/bitar.py ritar laddboxens och batteriets
     paket som radiokort med name="<grupp>pkg", samma kort som originalmallens
     laddboxkort. Raden i summeringen heter kortets rubrik plus paketets namn,
     talet ar radions value, och potten kommer ur TJANSTPOTT som bygget
     skriver ur paket.json (laddbox = gron teknik). En radio utan value ar en
     intresseanmalan och hamnar under "Vi hor av oss om", som batteriet.
     Fore 23 okt lag laddboxen i en rullgardin och batteriet i en kryssruta
     utan bild; agarbeskedet samma dag kraver att paketen VISAS. */
  var TJANSTEVAL = '.o-tjanst input[type="radio"]';
  function tjansteval(){
    var ut = [];
    offer.querySelectorAll(TJANSTEVAL + ":checked").forEach(function(r){
      var sek = r.closest(".o-tjanst"), kort = r.closest(".o-pkg");
      var grupp = r.name.replace(/pkg$/, "");
      var rub = sek ? sek.querySelector(".o-tjansttitel") : null;
      var namn = rub ? rub.textContent.replace(/^\s*\d+\s*/, "").trim() : grupp;
      var pn = kort ? kort.querySelector(".pname b") : null;
      var v = r.hasAttribute("value") ? parseInt(r.value, 10) : NaN;
      ut.push({
        namn: namn + (pn ? ", " + pn.textContent.trim() : ""),
        grupp: grupp, antal: 1,
        styck: isNaN(v) ? null : v, belopp: isNaN(v) ? null : v,
        pott: TJANSTPOTT[grupp] || "rot", variant: null
      });
    });
    return ut;
  }

  /* En radiogrupp kan aldrig tommas av kunden. Agarkravet "gar att valja bort"
     (originalmallen): ett andra tryck pa ett redan valt kort kryssar ur det.
     Var kortet valt FORE trycket las pa etikettens pointerdown, for det ar
     etiketten man trycker pa och inte den dolda radion. Avkrysset satts i
     radions egen click, som ar det syntetiska klicket etiketten skickar
     EFTER att webblasaren redan satt checked: att satta false dar star sig. */
  (function(){
    var varVald = null;
    offer.querySelectorAll(".o-tjanst label.o-pkg").forEach(function(lbl){
      var r = lbl.querySelector('input[type="radio"]');
      if (!r) return;
      lbl.addEventListener("pointerdown", function(){ varVald = r.checked ? r : null; }, true);
      r.addEventListener("click", function(){
        if (varVald === r) { r.checked = false; varVald = null; rakna(); }
      });
    });
  })();

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
      if (bild && p.bildsrc) { bild.src = p.bildsrc; bild.alt = p.namn + " elcentral från Hager"; }
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
    /* "Liten, " med slapande komma stod i summeringen: spec ar tom sedan korten
       bara bar namnet (agarbesked 19 okt), och raden limmade anda ihop namn
       och spec med ett komma. Uppmatt 23 okt pa den byggda sidan. Samma form
       som laddboxmallens rad "Paket Bas". */
    if (p) rows += '<div class="o-sumrow"><span>Paket ' + p.namn + '</span><span class="kr">' + kr(bas) + "</span></div>";
    if (tid) rows += '<div class="o-sumrow"><span>' + (tid === 1500 ? "Prioritet" : "Express") + '</span><span class="kr">' + kr(tid) + "</span></div>";

    var utanPris = [];
    rader.forEach(function(r){
      if (r.belopp == null) { utanPris.push(r); return; }
      var etikett = r.variant ? (r.namn + ", " + r.variant) : r.namn;
      if (r.antal > 1) etikett += ", " + r.antal + " st";
      rows += '<div class="o-sumrow"><span>' + etikett + '</span><span class="kr">' + kr(r.belopp) + "</span></div>";
    });
    if (utanPris.length) {
      rows += '<div class="o-sumrow"><span><b>Vi hör av oss om</b></span><span></span></div>';
      /* "pris saknas" bredvid en rad som visar "fr. 35 625 kr" ar tva olika
         svar pa samma fraga pa samma sida. En intresserad med fran-pris
         (batteriraderna, data-fran ur tjanstrader) visar fran-priset har
         ocksa; en utan visar att priset saknas. Ingetdera laggs pa summan. */
      utanPris.forEach(function(r){
        rows += '<div class="o-sumrow"><span>' + r.namn + '</span>'
          + (r.fran ? '<span class="kr">' + r.fran + '</span>' : '<span class="kr saknas">pris saknas</span>')
          + '</div>';
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

    platsen(nyckel, rader, taket(nyckel, rader));
  }

  /* ---- TAKET. Den arliga merforsaljningen. ------------------------------
     Nar de extra dvargbrytarna gor den valda storleken minst lika dyr som
     nasta sager sidan det sjalv. Talet kommer ur TAK, som bygget harleder ur
     priserna och ett orakel haller sant. Sidan kan alltsa inte saga fel sak
     aven om nagon andrar ett pris. */
  function taket(nyckel, rader){
    var rad = $("takRad");
    if (!rad) return false;
    var tak = TAK[nyckel];
    var extra = null;
    rader.forEach(function(r){ if (r.grupp === "dvargbrytare") extra = r; });
    if (tak == null || !extra || extra.antal <= tak) { rad.hidden = true; return false; }

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
      scrollTill(offer.querySelector("#pkgs"));
    };
    return true;
  }

  /* ---- PLATSEN. Motsagelsen som blev en upplysning. -----------------------
     Raden "Extra dvargbrytare +500 kr" ar kopbar pa varje storlek (agarsvar
     23 okt: "Lat den vara kopbar"), men jamfortabellen pa samma sida sager
     "ryms: inga, inga, 10 till". Kunden kunde kopa tre brytare for 1 500 kr
     till en central sidan sjalv sager ar full, utan att sidan sa nagot (CMO-
     granskningen 23 okt, 3.4). Nu sager sidan vad som da kravs: en extra
     kapsling (priset ur kapslingsradens eget value) eller nasta storlek.
     RYMS kommer ur bygget, samma _ryms som tabellen, aldrig ett eget tal.
     Takraden gar fore: sager den redan "byt storlek" tacker den aven platsen. */
  /* PLATSMENING START */
  function platsMening(namn, ryms, antal, kapslingPris, nasta, nastaGrupper){
    if (ryms <= 0) {
      return "I " + namn + " ryms inga extra dvärgbrytare. Då behövs en extra kapsling, +" + kr(kapslingPris)
        + (nasta ? ", eller " + nasta + " som har plats för " + nastaGrupper + " grupper från början." : ".");
    }
    return "I " + namn + " ryms " + ryms + " extra dvärgbrytare. För " + antal
      + " behövs en extra kapsling, +" + kr(kapslingPris) + ".";
  }
  /* PLATSMENING SLUT */
  function platsen(nyckel, rader, takSyns){
    var rad = $("platsRad");
    if (!rad) return;
    var extra = null;
    rader.forEach(function(r){ if (r.grupp === "dvargbrytare") extra = r; });
    var kapsling = offer.querySelector('.o-rad input[data-grupp="kapsling"]');
    var ryms = RYMS[nyckel];
    if (takSyns || !extra || ryms == null || extra.antal <= ryms || (kapsling && kapsling.checked)) {
      rad.hidden = true; return;
    }
    var i = ORDNING.indexOf(nyckel);
    var nasta = ORDNING[i + 1] ? PKG[ORDNING[i + 1]] : null;
    var kp = kapsling ? parseInt(kapsling.value, 10) : NaN;
    $("platsText").textContent = platsMening(PKG[nyckel].namn, ryms, extra.antal, isNaN(kp) ? 0 : kp,
                                             nasta ? nasta.namn : null, nasta ? nasta.grupper : null);
    rad.hidden = false;
    var k = $("platsKnapp");
    k.textContent = "Lägg till extra kapsling";
    k.onclick = function(){
      if (!kapsling) return;
      var ant = kapsling.closest(".o-rad").querySelector("[data-antal]");
      if (ant) ant.value = 1;
      kapsling.checked = true;
      rakna();
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
    if (e.target.matches('input[name="pkg"], input[name="tid"], .add, .intresse, [data-antal], .o-variant, ' + TJANSTEVAL)) rakna();
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
    scrollTill($("summering"));
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

  /* ---- INFORMATIONSRUTORNA. Samma lyssnare som originalmallen (och
     laddboxofferten, tail.html rad 898): data-info="tillagg" slar upp
     #modalTillagg. preventDefault behovs eftersom knappen kan ligga inne i en
     etikett. Nar dialogen stangs, med Escape eller med knappen, gar fokus
     tillbaka till (i)-knappen som oppnade den: close-handelsen fyrar for bada
     vagarna, och utan den star en tangentbordsanvandare pa body efter att ha
     last klart. */
  var infoOppnare = null;
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      var n = this.getAttribute("data-info");
      var m = document.getElementById("modal" + n.charAt(0).toUpperCase() + n.slice(1));
      if (m && m.showModal) {
        infoOppnare = this;
        /* Knappen far fokus INNAN dialogen oppnas. Ett musklick ger inte
           fokus i Safari, och Chrome aterstaller fokus till "det forra
           elementet" EFTER close-handelsen, sa en refokus i handlern blev
           overkord: uppmatt 23 okt, fokus pa body nar knappen inte var
           fokuserad fore klicket. Med fokus satt har pekar bada vagarna pa
           knappen. */
        try { this.focus({ preventScroll: true }); } catch (fel) { try { this.focus(); } catch (f2) {} }
        m.showModal();
      }
    });
  });
  document.querySelectorAll(".o-modal").forEach(function(m){
    m.addEventListener("close", function(){
      var k = infoOppnare; infoOppnare = null;
      if (!k) return;
      /* Nasta tick: webblasarens egen aterstallning kor efter den har
         handelsen, och den som fokuserar sist vinner. */
      setTimeout(function(){ try { k.focus({ preventScroll: true }); } catch (fel) { k.focus(); } }, 0);
    });
  });

/* ---- FÖRE OCH EFTER ---------------------------------------------------
     Reglaget är en enhancement, hämtad 1:1 ur julius447/f-re-efter-CRO-
     (dist/03-fore-efter.js). Utan den här koden står blocket kvar med båda
     bilderna i DOM och sömmen på 50 procent: inget innehåll går förlorat.

     PEKARKONTRAKTET (källans kodgranskning 2026-08-17, tre bevisade defekter):
     ett drag ägs av EN pekare, identifierad med pointerId, och allt annat
     ignoreras. En vilande tumme kapade sömmen; att lyfta det andra fingret
     frös draget; pointerleave avbröt draget vid ramkanten. Därför: andra
     fingret ignoreras helt, bara ägarens pointerup släpper, och pointerleave
     lyssnas inte på alls.

     SCROLLKONTRAKTET (källans granskning 2026-09-17, bevisat på iOS och
     Android): ett finger som landar på fotot är INTE en interaktion förrän det
     rört sig i sidled. Annars ryckte sömmen vid varje vanlig vertikal scroll
     som råkade börja på bilden. Touch och penna bekräftas först efter 6 px i
     sidled OCH mer sidled än höjdled; lyfts fingret utan rörelse var det ett
     tryck och sömmen placeras där. Musen har inget scrollproblem och hoppar
     direkt.

     Blockets mätning (dataLayer-pushen) är inte med: offerten har varken
     dataLayer eller samtyckeslager, och en mätkrok som aldrig kan brinna är
     död kod. */
  (function(){
    var VILOLAGE = 50, STEG_PIL = 5, STEG_SIDA = 10, TROSKEL_PX = 6;

    /* iOS: ett tryck som stoppar en pågående rullning är inget tryck. EN
       lyssnare för sidan, inte en per figur. */
    var sistScrollad = 0;
    window.addEventListener("scroll", function(){ sistScrollad = Date.now(); }, { passive: true });

    function initiera(figur){
      var ram = figur.querySelector(".o-ffram");
      var reglage = figur.querySelector(".o-ffreglage");
      if (!ram || !reglage) return;

      var aktivPekare = null, vidrord = false, vinkningPagar = false;
      var sistAviserat = null, vantandeX = null, ramad = 0;
      var startX = 0, startY = 0, bekraftat = false;

      function satt(procent, egenInteraktion){
        if (!isFinite(procent)) procent = VILOLAGE;
        procent = Math.max(0, Math.min(100, procent));
        var avrundat = Math.round(procent);
        figur.style.setProperty("--ff-pos", procent + "%");
        if (Number(reglage.value) !== avrundat) reglage.value = String(avrundat);
        /* Skärmläsaren ska höra vad sömmen betyder, inte ett råtal, och bara
           när talet faktiskt ändrats: annars blir det uppläsningsspam. */
        if (avrundat !== sistAviserat){
          sistAviserat = avrundat;
          reglage.setAttribute("aria-valuetext", "Efter syns till " + (100 - avrundat) + " procent");
        }
        if (egenInteraktion && !vidrord){
          vidrord = true;
          avbrytVinkning();
        }
      }

      function mjukt(pa){ figur.classList.toggle("mjuk", !!pa); }

      function procentAv(klientX){
        var r = ram.getBoundingClientRect();
        if (!r.width) return VILOLAGE;
        return ((klientX - r.left) / r.width) * 100;
      }

      /* rAF-koalescering: pekarhändelser kan komma tätare än skärmen ritar, så
         sömmen skrivs högst en gång per bildruta. Rutan hämtas i callbacken,
         så ett drag överlever att sidan scrollar under fingret. */
      function schemalagg(klientX){
        vantandeX = klientX;
        if (ramad) return;
        ramad = (window.requestAnimationFrame || function(f){ return setTimeout(f, 16); })(function(){
          ramad = 0;
          if (vantandeX === null) return;
          satt(procentAv(vantandeX), true);
        });
      }

      function slappDraget(){
        if (aktivPekare === null) return;
        aktivPekare = null; bekraftat = false; vantandeX = null;
      }

      /* Bältet till hängslena i CSS: webbläsaren får aldrig starta sin egen
         drag-and-drop mitt i en jämförelse. */
      ram.addEventListener("dragstart", function(e){ e.preventDefault(); });

      /* Draget är bekräftat: NU tar reglaget fokus och sömmen får följa
         fingret. preventScroll så sidan inte hoppar när fokus flyttas.
         Klassen talar om för CSS:en att fokus kom från en pekare. */
      function bekrafta(){
        if (bekraftat) return;
        bekraftat = true;
        figur.classList.add("pekarfokus");
        try { reglage.focus({ preventScroll: true }); } catch (fel) { /* äldre motorer */ }
        mjukt(false);
      }

      ram.addEventListener("pointerdown", function(e){
        if (aktivPekare !== null) return;                      // ett drag åt gången
        if (e.button !== undefined && e.button !== 0) return;  // bara primär knapp
        aktivPekare = e.pointerId;
        startX = e.clientX; startY = e.clientY; bekraftat = false;
        if (ram.setPointerCapture){
          try { ram.setPointerCapture(e.pointerId); } catch (fel) { /* strunt samma */ }
        }
        if (e.pointerType === "mouse"){
          e.preventDefault();          // ingen textmarkering, ingen bilddragning
          bekrafta();                  // musen kan inte scrolla med knappen nere
          satt(procentAv(e.clientX), true);
        }
        /* Touch och penna: vi rör ingenting ännu. Går fingret uppåt eller nedåt
           tar webbläsaren över (touch-action: pan-y) och skickar pointercancel. */
      });

      ram.addEventListener("pointermove", function(e){
        if (e.pointerId !== aktivPekare) return;               // fel finger
        if (e.pointerType === "mouse" && e.buttons === 0){ slappDraget(); return; }
        if (!bekraftat){
          var dx = e.clientX - startX, dy = e.clientY - startY;
          if (Math.abs(dx) <= TROSKEL_PX) return;              // för lite för att veta
          if (Math.abs(dx) <= Math.abs(dy) * 1.5) return;      // mer höjdled än sidled
          bekrafta();
        }
        schemalagg(e.clientX);
      });

      ram.addEventListener("pointerup", function(e){
        if (e.pointerId !== aktivPekare) return;
        if (!bekraftat && Date.now() - sistScrollad > 120){
          bekrafta();                  // ett rent tryck: placera sömmen där fingret var
          satt(procentAv(e.clientX), true);
        }
        slappDraget();
      });

      ["pointercancel", "lostpointercapture"].forEach(function(typ){
        ram.addEventListener(typ, function(e){
          if (e.pointerId === aktivPekare) slappDraget();      // bara släpp, aldrig flytta
        });
      });

      /* Skyddsnät: tappar vi ändå slutet av ett drag, fönstret förlorar fokus
         eller fliken byts, ska sömmen inte fastna i fingret. */
      window.addEventListener("blur", slappDraget);
      window.addEventListener("pointerup", function(e){
        if (e.pointerId === aktivPekare) slappDraget();
      });
      window.addEventListener("pointercancel", function(e){
        if (e.pointerId === aktivPekare) slappDraget();
      });

      // Trycker man direkt på reglaget kom fokus också från en pekare.
      reglage.addEventListener("pointerdown", function(){ figur.classList.add("pekarfokus"); });
      // Första tangenttrycket: nu ÄR det en tangentbordsanvändare, visa ringen.
      reglage.addEventListener("keydown", function(){ figur.classList.remove("pekarfokus"); }, true);
      reglage.addEventListener("blur", function(){ figur.classList.remove("pekarfokus"); });

      reglage.addEventListener("input", function(){ mjukt(false); satt(Number(reglage.value), true); });

      reglage.addEventListener("keydown", function(e){
        var v = Number(reglage.value), traff = true;
        switch (e.key){
          case "ArrowLeft":
          case "ArrowDown":  v -= STEG_PIL; break;
          case "ArrowRight":
          case "ArrowUp":    v += STEG_PIL; break;
          case "PageDown":   v -= STEG_SIDA; break;
          case "PageUp":     v += STEG_SIDA; break;
          case "Home":       v = 0; break;
          case "End":        v = 100; break;
          default: traff = false;
        }
        if (!traff) return;
        e.preventDefault();
        mjukt(true);                   // tangentbord får glida, inte hoppa
        satt(v, true);
      });

      /* Engångsvinkningen lär ut mekaniken när paret kommer in i vyn. Den
         respekterar prefers-reduced-motion och avbryts av minsta egen
         interaktion. */
      var vinkningsTimers = [];
      function avbrytVinkning(){
        vinkningsTimers.forEach(clearTimeout);
        vinkningsTimers = [];
        if (vinkningPagar){ vinkningPagar = false; mjukt(false); }
      }
      function vinka(){
        if (vidrord || vinkningPagar) return;
        if (document.activeElement === reglage) return;   // rör aldrig ett reglage någon står på
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        /* Utan @property går --ff-pos inte att animera: vinkningen blir två
           hopp i stället för en glidning. Då hoppar vi över den. */
        if (!(window.CSS && typeof CSS.registerProperty === "function")) return;
        vinkningPagar = true;
        mjukt(true);
        satt(VILOLAGE + 13, false);
        vinkningsTimers.push(setTimeout(function(){ satt(VILOLAGE, false); }, 460));
        vinkningsTimers.push(setTimeout(function(){ vinkningPagar = false; mjukt(false); }, 760));
      }
      if ("IntersectionObserver" in window){
        var blick = new IntersectionObserver(function(poster){
          poster.forEach(function(post){
            if (post.isIntersecting && post.intersectionRatio >= 0.55){
              blick.disconnect();
              setTimeout(vinka, 420);
            }
          });
        }, { threshold: [0.55] });
        blick.observe(ram);
      }

      /* Startläget läses ur reglaget, inte ur konstanten: webbläsare återställer
         formulärvärden vid mjuk omladdning och bakåtnavigering, och då ska
         sömmen hamna där tummen står. */
      var start = parseFloat(reglage.value);
      satt(isFinite(start) ? start : VILOLAGE, false);
    }

    var figurer = document.querySelectorAll(".o-fffig");
    for (var i = 0; i < figurer.length; i++) initiera(figurer[i]);
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
    /* KVITTOT. Det delade blocket bar en kvittorad (#oaKvitto) som laddbox- och
       servicemallen fyller med samma varden som summeringen. Elcentralen lamnade
       den dold: kunden accepterade ett belopp och fick tillbaka en bock utan
       tal. Talet och paketnamnet las ur summeringen, inte raknas om, sa de kan
       inte dra isar. */
    if (id === "skarmAccept") {
      var kv = $("oaKvitto");
      if (kv) {
        var forsta = $("sumRows").querySelector(".o-sumrow span");
        $("oaTotal").textContent = $("sumTotal").textContent;
        $("oaPaket").textContent = forsta ? forsta.textContent : $("prodName").textContent;
        kv.hidden = false;
      }
    }
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

  /* HUVUDSAKRINGEN AR INTE ETT EGET STEG. Agarsvar 23 okt: 'Ta bort helt och
     klona vad vi gjorde i original pa elcentral mallen.' Den ar en kopbar rad
     bland tillaggen (paket.json _tillagg, grupp huvudsakring) och behover darfor
     ingen egen logik: poster() laser den som vilken rad som helst. */

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
