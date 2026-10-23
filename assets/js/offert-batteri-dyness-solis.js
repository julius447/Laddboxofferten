(function(){
  "use strict";
  /* Samma form som offert.py:s _kr: hardspatie mellan tusental, vanligt
     mellanslag fore kr. toLocaleString ger olika avgransare i olika
     webblasare, och ett tal som ser olika ut pa tva stallen laser som tva
     olika tal. */
  var kr=function(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" kr"; };
  var $=function(i){ return document.getElementById(i); };
  var val=function(n){ var e=document.querySelector('input[name="'+n+'"]:checked'); return e?e.value:"0"; };
  var MODELL={"id": "dyness-solis", "namn": "Dyness Stack 100 Pro + Solis S6", "modul_kwh": 5.12, "batteri": "Dyness Stack 100 Pro", "storlekar": [{"kwh": 15.36, "moduler": 3, "pris": 45925, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 20.38, "moduler": null, "pris": 51500, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 25.6, "moduler": 5, "pris": 56838, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 30.72, "moduler": 6, "pris": 62294, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 35.84, "moduler": 7, "pris": 67750, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 40.96, "moduler": 8, "pris": 73938, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 46.08, "moduler": 9, "pris": 80538, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 51.28, "moduler": 10, "pris": 87281, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 56.32, "moduler": 11, "pris": 95000, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 61.44, "moduler": 12, "pris": 99563, "vaxelriktare": "Solis S6 10 kW"}]};
  var FORVAL=3;
  var GRANNRABATT=1500;
  var CEN={"5990": "Byte av elcentral, liten central", "9990": "Byte av elcentral, mellan central", "14900": "Byte av elcentral, stor central"};
  var LBP={"4450": "Laddbox Bas, Zaptec Go", "5740": "Laddbox Plus, Zaptec Go", "9170": "Laddbox Premium, Zaptec Go"};
  var BOCK="<span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span>";
  var INGAR={"hard": [{"namn": "Batterimoduler {batteri}", "spec": "{kwh} kWh{moduler}"}, {"namn": "Hybridväxelriktare", "spec": "{vaxelriktare}"}, {"namn": "Säkringar och skydd som installationen kräver", "spec": ""}], "jobb": ["Installation av våra egna elektriker", "Montering av batteri och växelriktare", "Anslutning till elcentralen, upp till 10 meter kabel", "Inkoppling mot dina befintliga solceller", "Föranmälan och färdiganmälan till nätbolaget", "Frakt hem till dig", "Konfigurering, driftsättning och funktionstest", "Kontrollmätning av anläggningen", "Genomgång av appen", "10 års produktgaranti"]};
  var ST=MODELL.storlekar;
  function kwh(v){ return String(v).replace(".",","); }
  function radios(){ return [].slice.call(document.querySelectorAll('input[name="lagring"]')); }
  function valdIndex(){ var r=radios(); for(var i=0;i<r.length;i++){ if(r[i].checked) return i; } return FORVAL; }
  function rader(){ return [].slice.call(document.querySelectorAll(".o-rad")); }
  function radAntal(r){ var a=r.querySelector("[data-antal]"); return a ? +a.value : 1; }
  function radVarde(r){
    var i=r.querySelector("input.add");
    var styck=i.getAttribute("data-styck");
    if(styck) return (+styck)*radAntal(r);
    var s=r.querySelector(".o-variant");
    return s ? +s.value : +i.value;
  }
  function radNamn(r){
    var i=r.querySelector("input.add");
    var n=i.getAttribute("data-name");
    if(i.getAttribute("data-styck")){ var an=radAntal(r); return n+", "+an+" "+(an===1?"styck":"stycken"); }
    var s=r.querySelector(".o-variant");
    return s ? n+", "+s.options[s.selectedIndex].text : n;
  }

  /* ---- ANKARET. Riktning C, agarbeslut 23 okt. ----------------------------
     Hela trappan ligger i markupen som en radiogrupp. Har satts bara VILKA
     tre som syns, vilket som ar mitten, och skillnaden pa sidokorten. Talen
     pa korten ar byggda, inte skrivna har, sa oraklet kan lasa dem. */
  function ritaLagring(i){
    var r=radios(), a=ST[i];
    r.forEach(function(inp,k){
      var lab=inp.closest(".o-lv"); if(!lab) return;
      var syn=(k>=i-1 && k<=i+1);
      lab.hidden=!syn;
      lab.classList.toggle("mitt", k===i);
      lab.classList.toggle("sida", syn && k!==i);
      var sp=lab.querySelector(".o-lv__spec"); if(sp) sp.hidden=(k!==i);
      var d=lab.querySelector(".o-lv__delta");
      if(!d) return;
      if(k===i){ d.hidden=true; d.textContent=""; return; }
      var s=ST[k], dk=Math.round((s.kwh-a.kwh)*100)/100, dp=s.pris-a.pris;
      d.hidden=false;
      d.innerHTML='<span>'+(k<i?"ett steg mindre":"ett steg större")+'</span>'
        +'<span class="kr">'+(dk>0?"+":"−")+kwh(Math.abs(dk))+' kWh</span>'
        +'<span class="kr">'+(dp>0?"+":"−")+kr(Math.abs(dp))+'</span>';
    });
    $("lvTomNer").hidden = i>0;
    $("lvTomUpp").hidden = i<ST.length-1;
    [].slice.call(document.querySelectorAll("#lvTabell tr[data-i]")).forEach(function(tr){
      var k=+tr.getAttribute("data-i");
      tr.classList.toggle("vald", k===i);
      var b=tr.querySelector(".o-lv-valj"); if(b) b.setAttribute("aria-pressed", k===i?"true":"false");
    });
  }

  /* Se allt som ingar: listan foljer den valda storleken. Markupen ar samma
     punktlista som laddboxens, bocken ur bitar.py via bygget. */
  function ingarLista(s){
    var mod = s.moduler ? ", "+s.moduler+(s.moduler===1?" modul à ":" moduler à ")+kwh(MODELL.modul_kwh)+" kWh" : "";
    function fyll(t){
      return t.replace("{batteri}", MODELL.batteri).replace("{kwh}", kwh(s.kwh))
              .replace("{moduler}", mod).replace("{vaxelriktare}", s.vaxelriktare);
    }
    var ut=INGAR.hard.map(function(h){
      var spec=fyll(h.spec);
      return '<li class="prod">'+BOCK+'<span><b>'+fyll(h.namn)+'</b>'+(spec?'<span>'+spec+'</span>':'')+'</span></li>';
    });
    ut=ut.concat(INGAR.jobb.map(function(j){ return '<li>'+BOCK+'<span>'+j+'</span></li>'; }));
    return ut.join("");
  }

  function render(){
    /* Skriptet kor. Nu far prisytorna visas, se js-redo i system.css. */
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');

    var i=valdIndex(), s=ST[i];
    ritaLagring(i);

    /* TVA POTTER, HALLNA ISAR. Batteriet, o-driften och laddboxen ar gron
       teknik. Elcentralen, spotlights, termostat och dimmer ar ROT pa
       arbetskostnaden och bar data-rot. Allt som ar ROT raknas bort ur gron
       teknik-basen, annars raknas samma krona tva ganger. Inget ROT-belopp
       raknas eller visas: bara vad tjansterna kostar, efter avdrag. */
    /* PAKETKORTEN. Laddboxen och elcentralen ar tva radiogrupper med pris,
       fodda ur gemensamt/bitar.py:tjanstekort. Namnet ar gruppen plus "pkg".
       Laddboxen ar GRON TEKNIK, elcentralen ar ROT pa arbetskostnaden: tva
       potter som aldrig far rakna samma krona. Potten star ocksa i
       innehall.json, och offert.py stoppar bygget om de tva drar isar. */
    var cen=+val("elcentralpkg"), lb=+val("laddboxpkg");
    var gt=s.pris, rot=cen, rotNamn=[], valda=[];
    if(cen) rotNamn.push(CEN[String(cen)]);
    if(lb) gt+=lb;
    rader().forEach(function(r){
      var inp=r.querySelector("input.add"); if(!inp) return;
      r.classList.toggle("vald", inp.checked);
      var pr=r.querySelector(".o-radpris");
      if(pr && !inp.disabled) pr.textContent="+"+kr(radVarde(r));
      if(!inp.checked) return;
      var v=radVarde(r), namn=radNamn(r);
      valda.push({namn:namn, pris:v});
      if(inp.hasAttribute("data-rot")){ rot+=v; rotNamn.push(namn); } else { gt+=v; }
    });
    /* GRON TEKNIK HAR ETT TAK, OCH SIDAN FAR INTE LOVA MER AN TAKET.
       Prislistans kolumn I ar halva bruttot rakt av, utan tak. Men avdraget
       ar hogst 50 000 kr per person och ar, alltsa 100 000 for tva, och pa
       SAJ HS3 40 kWh gav formeln 107 531 kr. Sidan sa da "Gron teknik,
       50 procent, minus 107 531 kr", vilket ar ett avdrag kunden inte kan fa,
       och det ar KUNDEN som star for det mot Skatteverket.

       Taket biter ocksa pa KOMBINATIONER: SAJ 35 kWh plus o-drift passerar
       100 000 fast ingen enskild rad gor det. Darfor raknas det har, inte i
       datat.

       Pa de rader dar taket inte biter ar gtNetto exakt lika med
       prislistans tal, sa ingenting andras pa 51 av 55 rader. Pa de ovriga
       blir priset hogre an listan, och det ar det RIKTIGA priset.
       AGARFRAGA 2: antingen rattas prislistan, eller star priset hogre har. */
    var GT_TAK = 100000;
    var gtBrutto = gt * 2;
    var gtAvdrag = Math.min(gtBrutto * 0.5, GT_TAK);
    var gtNetto = gtBrutto - gtAvdrag;
    var takBiter = gtAvdrag < gtBrutto * 0.5 - 0.5;
    var brutto = gtBrutto, netto = gtNetto + rot;

    /* Hjalten */
    $("prodSpec").textContent=kwh(s.kwh)+" kWh, monterad och driftsatt";
    $("calcGross").textContent=kr(brutto);
    /* ETIKETTEN MASTE FOLJA TALET. Nar taket biter ar avdraget 100 000 av ett
       brutto pa 215 062, alltsa 46,5 procent, och raden sa anda "Gron teknik,
       50 procent". Kunden kan dividera, och en rad som sager en procentsats
       sidan inte raknar med misskrediterar varje annat tal pa sidan. */
    /* OCH DEN NYA ETIKETTEN FAR INTE VARA LANGRE AN DEN GAMLA.
       Forsta forsoket hette "Gron teknik, taket for tva personer" och brot
       till TVA rader i hjaltens 209 px: uppmatt vaxte raden 20 -> 40 px,
       kortet 499 -> 519 och hela hjalten 745 -> 766, och hopp.py matte ett
       hopp pa 20 px nar kunden valde den storsta storleken. En rattning som
       flyttar sidan under fingret ar en halv rattning. Vad taket betyder
       star i summeringen, bredvid raden som bar mellanskillnaden. */
    $("calcDedNamn").textContent = takBiter ? "Grön teknik, taket"
                                            : "Grön teknik, 50 procent";
    $("calcDed").textContent="−"+kr(gtAvdrag);
    /* Forklaringen bor i SUMMERINGEN, bredvid raden den forklarar, inte i
       hjalten. Lag den i hjalten flyttades lagringskorten 59 px ner i samma
       ogonblick som kunden tryckte pa ett av dem: innehall som dyker upp
       OVANFOR det kunden ror vid ar en layoutflytt under fingret. */
    $("calcCenRad").classList.toggle("dold", !rot);
    $("calcCenNot").classList.toggle("dold", !rot);
    if(rot){
      $("calcCenNamn").textContent = rotNamn.length===1 ? rotNamn[0] : "Tjänster med ROT";
      $("calcCen").textContent=kr(rot);
    }
    $("calcNet").textContent=kr(netto);

    var lista=ingarLista(s);
    if($("incList").innerHTML!==lista) $("incList").innerHTML=lista;

    /* Summeringen */
    var rows='<div class="o-sumrow"><span>'+MODELL.namn+', '+kwh(s.kwh)+' kWh</span><span class="kr">'+kr(s.pris)+'</span></div>';
    valda.forEach(function(v){
      rows+='<div class="o-sumrow sub"><span>'+v.namn+'</span><span class="kr">'+kr(v.pris)+'</span></div>';
    });
    if(lb) rows+='<div class="o-sumrow sub"><span>'+LBP[String(lb)]+'</span><span class="kr">'+kr(lb)+'</span></div>';
    if(cen) rows+='<div class="o-sumrow sub"><span>'+CEN[String(cen)]+'</span><span class="kr">'+kr(cen)+'</span></div>';
    /* NAR TAKET BITER MASTE RADERNA ANDA GA IHOP MED TOTALEN.
       Radernas tal ar prislistans NETTOPRISER, raknade med halva bruttot. Slar
       taket i betalar kunden mellanskillnaden, och da summerade de fem raderna
       till 115 623 kr medan totalen sa 118 856. Kunden kan rakna.
       Raden nedan ar den skillnaden, med sitt skal. */
    var takTillagg = gtNetto - gt;
    if(takTillagg > 0) rows+='<div class="o-sumrow sub"><span>Över grön teknik-taket, '
      +kr(GT_TAK)+' för två personer</span><span class="kr">'+kr(takTillagg)+'</span></div>'
      +'<div class="o-sumnote">Grön teknik är högst 50 000 kr per person och år. '
      +'Här slår taket i, så avdraget är '+kr(GT_TAK)+' i stället för halva priset.</div>';
    /* Grannrabatten raknas pa SKICKADE inbjudningar, som laddboxen och
       elcentralen gor. Raden andrar inte talet kunden betalar i dag: rabatten
       dras pa fakturan nar grannen har bestallt. Beloppet ar mallens eget. */
    var grannar=document.querySelectorAll("#refLista li").length;
    if(grannar) rows+='<div class="o-sumrow disc"><span>Grannrabatt, '+grannar+(grannar>1?' grannar inbjudna':' granne inbjuden')+'</span><span class="kr">dras när de beställt</span></div>'
      +'<div class="o-sumnote">Upp till '+kr(grannar*GRANNRABATT)+' av, '+kr(GRANNRABATT)+' för varje granne som beställer. Ditt pris här ändras inte förrän det hänt.</div>';
    $("sumRows").innerHTML=rows;
    $("sumTotal").textContent=kr(netto);
    $("sumBrutto").textContent=kr(brutto+rot);
    $("barTotal").textContent=kr(netto);
    $("barBrutto").textContent=kr(brutto+rot);
    rensningsknappar();
  }

  /* ---- LYSSNARNA. Ett val ar ett val oavsett vilken vag det gjordes. ---- */
  document.querySelectorAll('input[name="lagring"], input[name="elcentralpkg"], '
    + 'input[name="laddboxpkg"], input.add').forEach(function(i){
    i.addEventListener("change", render);
  });

  /* VAGEN TILLBAKA UR EN RADIOGRUPP. Tre paketkort gar att valja mellan men
     inte att avmarkera med musen, sa utan den har knappen kan kunden lagga
     till en laddbox och aldrig ta bort den igen. Knappen syns bara nar nagot
     ar valt, och nar den gommer sig sjalv flyttas fokus till forsta kortet i
     gruppen: ett gomt element som har fokus tappar fokus till body. */
  function rensningsknappar(){
    document.querySelectorAll("[data-rensa]").forEach(function(b){
      b.hidden = !document.querySelector('input[name="'+b.getAttribute("data-rensa")+'"]:checked');
    });
  }
  document.querySelectorAll("[data-rensa]").forEach(function(b){
    b.addEventListener("click", function(){
      var n=this.getAttribute("data-rensa");
      var inp=[].slice.call(document.querySelectorAll('input[name="'+n+'"]'));
      inp.forEach(function(i){ i.checked=false; });
      render();
      if(inp[0]){ try{ inp[0].focus({preventScroll:true}); }catch(_){} }
    });
  });
  /* Tabellen i folden: ett tryck pa en rad valjer den storleken, alltsa
     samma radio som korten styr. En vag till samma sanning, inte en andra. */
  document.querySelectorAll(".o-lv-valj").forEach(function(b){
    b.addEventListener("click", function(){
      var r=radios()[+this.getAttribute("data-i")];
      if(!r || r.checked) return;
      r.checked=true; render();
    });
  });
  /* andrar man antalet ar det ett val, sa rutan kryssas i */
  document.querySelectorAll("[data-antal]").forEach(function(sel){
    sel.addEventListener("change", function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      if(!i.disabled) i.checked=true;
      render();
    });
    sel.addEventListener("click", function(e){ e.stopPropagation(); });
  });
  /* byter man paket i laddboxraden ar det ett val, sa rutan kryssas i */
  document.querySelectorAll(".o-variant").forEach(function(s){
    s.addEventListener("change", function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      if(!i.disabled) i.checked=true;
      render();
    });
    s.addEventListener("click", function(e){ e.stopPropagation(); });
  });

  /* FOKUSRYCKNINGEN. Ett tryck pa en etikett flyttar fokus till den dolda
     radion och webblasaren drar in den i vyn. Fokus tas sjalv pa pointerdown
     med preventScroll, i fangstfasen, sa webblasarens egen fokus inte rullar. */
  document.addEventListener("pointerdown", function(e){
    var lab=e.target.closest && e.target.closest("label.o-lv, label.o-opt, label.o-rad, label.o-pkg");
    if(!lab) return;
    var i=lab.querySelector("input");
    if(i && !i.disabled){ try{ i.focus({preventScroll:true}); }catch(_){} }
  }, true);

  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollTill(el){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:"start"}:{block:"start"}); }

  function panel(btnId,panelId,other){
    var b=$(btnId), p=$(panelId);
    b.addEventListener("click", function(){
      var open=p.hidden; p.hidden=!open; b.setAttribute("aria-expanded", open?"true":"false");
      if(open&&other) $(other).hidden=true;
      if(open){ var ta=p.querySelector("textarea"); if(ta) ta.focus(); }
    });
  }
  panel("fraga","fragaPanel","avbojPanel");
  panel("avboj","avbojPanel","fragaPanel");

  /* I produktion ar accept och avboj egna sidor. Prototypen visar dem som
     egna skarmar, sa flodet gar att granska. Samma funktion som laddboxen. */
  function visaSkarm(id){
    var sk=$(id);
    if(!sk) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    sk.hidden=false; sk.classList.add("syns");
    if(id==="skarmAccept"){
      /* KVITTOT. Samma tal som summeringen just visade, last ur DOM:en i
         stallet for omraknat, sa de inte kan dra isar. */
      var kv=$("oaKvitto");
      if(kv){
        var s=ST[valdIndex()];
        var od=document.querySelector('input.add[data-grupp="odrift"]:checked');
        $("oaTotal").textContent=$("sumTotal").textContent;
        $("oaPaket").textContent=MODELL.namn+", "+kwh(s.kwh)+" kWh"+(od?", med ö-drift":"");
        kv.hidden=false;
      }
      /* Ett ikryssat skal bakom en acceptskarm ar ett svar sidan aldrig fick. */
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked=false; });
    }
    /* EN SKARMLASARE MASTE FA VETA ATT KOPET GICK IGENOM. */
    sk.setAttribute("tabindex","-1");
    if(!sk.getAttribute("role")) sk.setAttribute("role","status");
    try{ sk.focus({preventScroll:true}); }catch(e){ try{ sk.focus(); }catch(e2){} }
    var sc=document.scrollingElement;
    if(sc) sc.scrollTop=0; else window.scrollTo(0,0);
  }
  $("avbojSend").addEventListener("click", function(){ visaSkarm("skarmAvboj"); });
  $("acceptBtn").addEventListener("click", function(){ visaSkarm("skarmAccept"); });
  $("fragaSend").addEventListener("click", function(){
    var ta=$("fragaText"), h=$("fragaHint");
    if(!ta.value.trim()){ h.textContent="Skriv din fråga i rutan först."; ta.focus(); return; }
    h.textContent="Frågan är mottagen.";
    this.disabled=true; ta.readOnly=true;
  });
  $("barGo").addEventListener("click", function(){ scrollTill($("summering")); });

  /* informationsrutan om o-drift */
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      var id="modal"+this.getAttribute("data-info").charAt(0).toUpperCase()+this.getAttribute("data-info").slice(1);
      var m=document.getElementById(id);
      if(m&&m.showModal) m.showModal();
    });
  });

  /* fore och efter, samma tva rader som laddboxen */
  (function(){
    var r=$("feReglage"); if(!r) return;
    var box=r.closest(".o-fe");
    r.addEventListener("input", function(){ box.style.setProperty("--fe", this.value); });
  })();

  /* UTSKRIFTEN. En stangd <details> tar inte med sitt innehall pa papperet.
     Foldarna oppnas fore utskrift och aterstalls efterat, med sparren mot
     att oppnaren fyrar tva ganger. */
  (function(){
    var fore=[];
    function oppna(){
      if(fore.length) return;
      fore=[].slice.call(document.querySelectorAll("details"));
      fore.forEach(function(e){ e.dataset.varOppen=e.open?"1":"0"; e.open=true; });
    }
    function aterstall(){
      fore.forEach(function(e){ e.open=e.dataset.varOppen==="1"; delete e.dataset.varOppen; });
      fore=[];
    }
    window.addEventListener("beforeprint", oppna);
    window.addEventListener("afterprint", aterstall);
    if(window.matchMedia){
      var mq=window.matchMedia("print");
      var lyssna=mq.addEventListener?mq.addEventListener.bind(mq,"change"):null;
      if(lyssna) lyssna(function(e){ e.matches?oppna():aterstall(); });
    }
  })();

  /* grann.js i gemensamt behover kunna rakna om summan. */
  window.__render = render;
  render();
})();
