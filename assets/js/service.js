/* Serviceofferten. Den enda av de fem mallarna som inte konfigurerar nagot i
   sitt eget jobb: kunden laser en lista och svarar ja eller nej. Skriptet har
   darfor bara tre uppgifter, och ingen av dem ar att rakna ett avdrag.

   AGARDIREKTIV 23 OKTOBER: ROT-avdragets BELOPP far aldrig sta pa en sida.
   Priserna ar netto, sa det finns ingenting att rakna. */
(function(){
  var PRIS=7400;
  var JOBBNAMN="Byte av strömbrytare och uttag";
  var TID={"1500": "Prioritet, 3 till 5 dagar", "2500": "Express, 24 till 72 timmar"};
  var GRANNRABATT=1000;

  function $(id){ return document.getElementById(id); }
  /* ETT TAL, ETT TECKEN: hardspatie (U+00A0) mellan tusentalen och fore kr,
     avrundat EN gang har i renderaren. Samma rad som elcentralmallen; oraklet
     tusentalsavgransare i offert.py haller den och kor den i node. */
  function kr(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0kr"; }
  function val(namn){
    var e = document.querySelector('input[name="' + namn + '"]:checked');
    return e ? +e.value : 0;
  }

  /* ---- OVRIGA TJANSTER: VAD RAKNAS OCH VAD AR EN FRAGA ----------------
     AGARBESKED 25 OKTOBER, ORDAGRANT: "Nar jag lade till spotlights, laddbox
     och byte av elcentral stod det 'ingen kostnad nu'. Det har ar egentligen
     bara en logik som ska galla for solcellsbatterier. Byte av elcentral,
     laddbox, spotlights, lights och liknande ar nagonting som kan dras
     direkt."

     SKILLNADEN STAR I MARKUPEN, OCH MARKUPEN KOMMER UR KATALOGEN. En kontroll
     med data-intresse ar en intresseanmalan: den bar ett fran-pris, sidan vet
     inte vad den kostar, och raden sager "ingen kostnad nu". En kontroll med
     ett value ar en kopbar vara och raknas in i totalen. Ingen produktlista
     har inne, for en handskriven lista over "det har ar intresseanmalningar"
     ar precis den defektklass som gjorde att den har buggen fanns: FALLOR.md
     har fyra egna avsnitt om listor i skript som ska rakna upp allt.

     Samma tva grenar som laddboxmallens render(), och oraklet
     grenarna_som_laddboxmallen i offert.py laser bada skripten och haller dem
     ihop sa de inte kan glida isar. */

  /* ANTAL GANGER STYCKPRIS, som laddboxmallens radAntal/radVarde. En rad utan
     antalsvaljare ar ett exemplar. */
  function radAntal(r){
    var a = r.querySelector("[data-antal]");
    return a ? +a.value : 1;
  }
  function radVarde(r, i){
    var styck = i.getAttribute("data-styck");
    return styck ? (+styck) * radAntal(r) : +i.value;
  }
  function radNamn(r, i){
    var n = i.getAttribute("data-name");
    if (!i.getAttribute("data-styck")) return n;
    var an = radAntal(r);
    return n + ", " + an + " " + (an === 1 ? "styck" : "stycken");
  }

  /* Raderna och paketkorten som kunden har kryssat i, delade i tva listor:
     koparna (med belopp) och fragorna (utan).

     EN LOOP, I DOKUMENTORDNING. Forsta versionen hade tva looper, raderna
     forst och paketkorten sedan, och summeringen laste da bakvant: uppmatt
     25 okt med allt ikryssat stod spotlights, termostat och dimmer (foldens
     punkt 4, 5 och 6) OVANFOR laddboxen och elcentralen (punkt 1 och 2).
     querySelectorAll ger kontrollerna i den ordning de star pa sidan, sa
     summeringen laser nu i samma ordning som kunden mötte dem. */
  function ovriga(){
    var kopt = [], fragor = [];
    document.querySelectorAll('.o-rad > input.add, .o-rad > input.intresse, '
                            + '.o-tjanst input[type="radio"]').forEach(function(i){
      var rad = i.closest(".o-rad");
      if (rad){
        rad.classList.toggle("vald", i.checked);
        if (i.hasAttribute("data-intresse")){
          if (i.checked) fragor.push(i.getAttribute("data-name"));
          return;
        }
        /* Prisfaltet foljer antalet, annars laser kunden ett tal pa raden och
           ett annat i summeringen. Samma rad som laddboxmallen. */
        var v = radVarde(rad, i);
        var pf = rad.querySelector(".o-radpris");
        if (pf) pf.textContent = v ? "+" + kr(v) : "pris saknas";
        if (i.checked) kopt.push({namn: radNamn(rad, i), pris: v});
        return;
      }
      /* Kvar: paketkorten. Radens namn ar sektionens rubrik plus kortets,
         for "Bas" ensamt i en summering sager ingenting. */
      if (!i.checked) return;
      var sek = i.closest(".o-tjanst"), kort = i.closest(".o-pkg");
      var rub = sek ? sek.querySelector(".o-tjansttitel") : null;
      var titel = rub ? rub.textContent.replace(/^\s*\d+\s*/, "").trim() : i.name;
      var pn = kort ? kort.querySelector(".pname b") : null;
      var namn = titel + (pn ? ", " + pn.textContent.trim() : "");
      if (i.hasAttribute("value") && +i.value > 0) kopt.push({namn: namn, pris: +i.value});
      else fragor.push(namn);
    });
    return {kopt: kopt, fragor: fragor};
  }

  /* VAGEN TILLBAKA UR EN RADIOGRUPP. Samma knapp som batterimallen: syns
     bara nar nagot ar valt, och nar den gommer sig flyttas fokus till forsta
     kortet, sa fokus inte tappas till body. */
  function rensningsknappar(){
    document.querySelectorAll("[data-rensa]").forEach(function(b){
      b.hidden = !document.querySelector('input[name="' + b.getAttribute("data-rensa") + '"]:checked');
    });
  }

  function render(){
    /* Skriptet kor. Nu far prisytorna visas, se js-redo i system.css. */
    var _o = document.querySelector(".offer"); if (_o) _o.classList.add("js-redo");

    var tid = val("tid");
    var ovr = ovriga();
    var summa = PRIS + tid;
    ovr.kopt.forEach(function(v){ summa += v.pris; });

    /* Jobbets namn kommer ur datat (JOBBNAMN), inte ur hjalten: produktraden
       dar ar borta sedan 24 okt (E2), men summeringens rad heter anda det
       bokaren kallade jobbet. */
    var rows = '<div class="o-sumrow"><span>' + JOBBNAMN
             + '</span><span class="kr">' + kr(PRIS) + "</span></div>";
    if (tid) rows += '<div class="o-sumrow sub"><span>' + TID[String(tid)]
                   + '</span><span class="kr">' + kr(tid) + "</span></div>";
    /* DET KUNDEN KOPER STAR MED SITT BELOPP, i samma radform som jobbets egna
       tillval ovanfor. Agaren 25 okt: laddbox, elcentral, spotlights och
       liknande "kan dras direkt". */
    ovr.kopt.forEach(function(v){
      rows += '<div class="o-sumrow sub"><span>' + v.namn
            + '</span><span class="kr">' + kr(v.pris) + "</span></div>";
    });
    /* OCH DET KUNDEN FRAGAR OM star kvar utan belopp. Ett solcellsbatteri gar
       inte att prissatta utan att se taket och forbrukningen, sa raden bar
       ingen krona och totalen ror sig inte. Det ar den enda logik agaren vill
       ha kvar. */
    if (ovr.fragor.length){
      rows += '<div class="o-sumrow grp"><span>Vi hör av oss om</span><span></span></div>';
      ovr.fragor.forEach(function(x){
        rows += '<div class="o-sumrow sub"><span>' + x + '</span><span>ingen kostnad nu</span></div>';
      });
    }
    $("sumRows").innerHTML = rows;
    rensningsknappar();

    /* ETIKETTEN FOLJER PRISET, inte bara tidsvalet. Lade kunden till en
       laddbox utan att valja tid stod det "Ditt pris" over ett tal hennes
       eget kryss just hade flyttat. Villkoret ar darfor summan mot
       utgangslaget, sa etiketten inte kan hamna fel igen nar en ny sorts
       val kommer till. */
    $("calcFinalEtikett").textContent = (summa !== PRIS) ? "Ditt pris, med ditt val" : "Ditt pris";
    $("calcNet").textContent = kr(summa);
    $("sumTotal").textContent = kr(summa);
    $("barTotal").textContent = kr(summa);
  }
  window.__render = render;

  document.querySelectorAll('input[name="tid"]').forEach(function(i){
    i.addEventListener("change", render);
  });
  /* VARJE KONTROLL UNDER OVRIGA TJANSTER, inte en uppraknad lista.
     input.add kom in 25 oktober, och hade listan har stannat vid
     input.intresse hade kundens kryss pa en spotlight inte gjort nagonting
     alls: ingen summering, inget pris. Antalsvaljaren hor hit av samma skal,
     for den andrar ett belopp. */
  document.querySelectorAll('.o-rad > input.add, .o-rad > input.intresse, '
                          + '.o-tjanst input[type="radio"], .o-tjanst [data-antal]')
    .forEach(function(i){ i.addEventListener("change", render); });
  document.querySelectorAll("[data-rensa]").forEach(function(b){
    b.addEventListener("click", function(){
      var n = this.getAttribute("data-rensa");
      var inp = [].slice.call(document.querySelectorAll('input[name="' + n + '"]'));
      inp.forEach(function(i){ i.checked = false; });
      render();
      if (inp[0]){ try { inp[0].focus({preventScroll:true}); } catch(_){} }
    });
  });

  /* ---- panelerna ---- */
  [["fraga", "fragaPanel", "avbojPanel"], ["avboj", "avbojPanel", "fragaPanel"]]
    .forEach(function(par){
      var b = $(par[0]); if (!b) return;
      b.addEventListener("click", function(){
        var p = $(par[1]), other = $(par[2]);
        var open = p.hidden; p.hidden = !open;
        b.setAttribute("aria-expanded", open ? "true" : "false");
        if (open && other) other.hidden = true;
      });
    });

  var fs = $("fragaSend");
  if (fs) fs.addEventListener("click", function(){
    var ta = $("fragaText"), h = $("fragaHint");
    if (!ta.value.trim()){ h.textContent = "Skriv din fråga i rutan först."; ta.focus(); return; }
    h.textContent = "Frågan är mottagen.";
    this.disabled = true; ta.readOnly = true;
  });

  /* ---- skarmarna ---- */
  function visaSkarm(id){
    var s = $(id); if (!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden = false; s.classList.add("syns");

    if (id === "skarmAccept"){
      var kv = $("oaKvitto");
      if (kv){
        $("oaTotal").textContent = $("sumTotal").textContent;
        $("oaPaket").textContent = JOBBNAMN;
        kv.hidden = false;
      }
      /* Avbojspanelen nollas: ett ikryssat skal bakom en acceptskarm ar ett
         svar sidan aldrig fick. */
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked = false; });
      var tid = val("tid");
      var steg2 = s.querySelector('.oa__steps li:nth-child(2) small');
      if (steg2 && tid) steg2.textContent = "Du har valt " + TID[String(tid)] + ". Vi hör av oss för att boka tid.";
    }

    /* En skarmlasare maste fa veta att kopet gick igenom: regeln som visar
       skarmen slacker knappen som hade fokus, sa fokus hamnar pa body. */
    s.setAttribute("tabindex", "-1");
    if (!s.getAttribute("role")) s.setAttribute("role", "status");
    try { s.focus({preventScroll:true}); } catch(e){ try { s.focus(); } catch(e2){} }

    var sc = document.scrollingElement;
    if (sc) sc.scrollTop = 0; else window.scrollTo(0, 0);
  }
  var acc = $("acceptBtn");
  if (acc) acc.addEventListener("click", function(){ visaSkarm("skarmAccept"); });
  /* Prisbarens knapp leder till summeringen, som pa laddbox, elcentral och
     batteri. Forut accepterade den direkt (CMO-granskningen 23 okt, fynd 5c).

     MJUKT AR EN FRAGA, INTE ETT PASTAENDE. Raden under skrevs forst som
     scrollIntoView({behavior:"smooth"}) rakt av, alltsa mallens egen
     losning pa nagot laddbox- och batterimallen redan hade lost. Uppmatt
     25 okt vid 375, riktigt tryck pa knappen, reducerad rorelse pa:
       laddbox   scrollTop 0 -> 7509, summeringens topp 7509
       batteri   scrollTop 0 -> 2084, summeringens topp 2084
       service   scrollTop 0 ->    0, summeringens topp 1975
     Chrome slapper inte igenom en smooth-rullning alls nar kunden bett om
     mindre rorelse, sa knappen gjorde INGENTING for dem. Systrarna fragar
     forst och faller tillbaka pa ett direkt hopp; det gor den har nu ocksa.
     Oraklet barknappen_som_systrarna laser laddboxens skript och haller de
     tva ihop, sa de inte kan glida isar igen. */
  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }
  var go = $("barGo");
  if (go) go.addEventListener("click", function(){ scrollTill($("summering"), "start"); });
  var av = $("avbojSend");
  if (av) av.addEventListener("click", function(){ visaSkarm("skarmAvboj"); });

  /* ---- utskriften. En stangd <details> tar inte med sitt innehall pa
     papperet, oavsett vad CSS sager om barnet, for ::details-content bar
     content-visibility:hidden. ---- */
  (function(){
    var fore = [];
    function oppna(){
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
    if (window.matchMedia){
      var mq = window.matchMedia("print");
      if (mq.addEventListener) mq.addEventListener("change", function(e){ e.matches ? oppna() : aterstall(); });
    }
  })();

  render();
})();
