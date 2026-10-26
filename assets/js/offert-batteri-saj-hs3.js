(function(){
  "use strict";
  /* Samma form som bitar.kr(): hardspatie mellan tusental OCH fore kr, sa ett
     belopp aldrig bryts mitt itu vid radslut (agarbeslut 24 okt A8).
     toLocaleString ger olika avgransare i olika webblasare, och ett tal som
     ser olika ut pa tva stallen laser som tva olika tal. */
  var kr=function(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" kr"; };
  var $=function(i){ return document.getElementById(i); };
  var val=function(n){ var e=document.querySelector('input[name="'+n+'"]:checked'); return e?e.value:"0"; };
  var MODELL={"id": "saj-hs3", "namn": "SAJ HS3", "modul_kwh": 5.0, "batteri": "SAJ BU3", "storlekar": [{"kwh": 5.0, "moduler": 1, "brutto": 71250, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 10.0, "moduler": 2, "brutto": 80000, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 15.0, "moduler": 3, "brutto": 95312, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 20.0, "moduler": 4, "brutto": 128126, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 25.0, "moduler": 5, "brutto": 156250, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 30.0, "moduler": 6, "brutto": 173812, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 35.0, "moduler": 7, "brutto": 198138, "vaxelriktare": "SAJ HS3 12 kW"}, {"kwh": 40.0, "moduler": 8, "brutto": 215062, "vaxelriktare": "SAJ HS3 12 kW"}]};
  var FORVAL=3;
  var POTT=100000;
  var PERSONER=2;
  var GRANNRABATT=1500;
  var CEN={"5990": "Byte av elcentral, liten central", "9990": "Byte av elcentral, mellan central", "14900": "Byte av elcentral, stor central"};
  var LBP={"4450": "Laddbox Bas, Zaptec Go", "5740": "Laddbox Plus, Zaptec Go", "9170": "Laddbox Premium, Zaptec Go"};
  var BOCK="<span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span>";
  var INGAR={"hard": [{"namn": "Batterimoduler {batteri}", "spec": "{kwh} kWh{moduler}"}, {"namn": "Hybridväxelriktare", "spec": "{vaxelriktare}"}, {"namn": "Säkringar och skydd som installationen kräver", "spec": ""}], "jobb": ["Installation av våra egna elektriker", "Montering av batteri och växelriktare", "Anslutning till elcentralen, upp till 10 meter kabel", "Inkoppling mot dina befintliga solceller", "Föranmälan och färdiganmälan till nätbolaget", "Frakt hem till dig", "Konfigurering, driftsättning och funktionstest", "Kontrollmätning av anläggningen", "Genomgång av appen", "10 års produktgaranti"]};
  var ST=MODELL.storlekar, BAS=ST[FORVAL];
  /* GRON TEKNIK AR HALVA BRUTTOT, MEN HOGST POTTEN.
     Modellfilen bar BRUTTO per storlek sedan 24 okt: det fysiska priset,
     inklusive moms, fore avdrag. Potten ar 50 000 kr per person i hushallet
     med gron teknik, och personantalet ar en parameter per offert
     (innehall.json: personer, 2 som forval, agarsvar 38). Nettot harleds, och
     da ar "priset i listan det kunden betalar" sant for varje personantal
     (agarfeedback 24 okt A1). Samma rad som offert.py:s _netto, ord for ord,
     och oraklet jamfor dem: tva definitioner av ett pris ar hur taket en gang
     blev osynligt pa korten. */
  function netto(b){ return b - Math.min(Math.floor(b/2), POTT); }
  function kwh(v){ return String(v).replace(".",","); }
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

  /* ---- MER LAGRING. Agarfeedback 24 okt F4. ------------------------------
     Lagringen ar inte langre en egen sektion utan en kryssrad med en
     rullgardin, som laddboxens laddkabelrad. Varje alternativ bar data-steg:
     hur manga rader UPP i prislistans trappa fran forvalet. Ar raden
     ikryssad ar den EFFEKTIVA storleken ST[FORVAL+steg], och det ar DEN
     storlekens brutto som gar in i avdraget, for det ar samma fysiska
     produkt som en storre rad i prislistan. Radens eget value ar skillnaden
     i vad kunden betalar mellan de tva storlekarna, potten inraknad, och det
     ar det talet som star pa raden och i summeringen. Oraklet i offert.py
     raknar varje alternativ ur modellfilen pa disk och stoppar bygget om
     value eller texten avviker. */
  function lagringSteg(){
    var i=document.querySelector('input.add[data-grupp="lagring"]');
    if(!i || !i.checked) return 0;
    var s=i.closest(".o-rad").querySelector(".o-variant");
    var o=s && s.options[s.selectedIndex];
    return o ? (+o.getAttribute("data-steg") || 0) : 0;
  }

  /* Se allt som ingar: listan foljer den EFFEKTIVA storleken, alltsa det
     som faktiskt installeras. Markupen ar samma punktlista som laddboxens,
     bocken ur bitar.py via bygget. */
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

    var steg=lagringSteg(), s=ST[FORVAL+steg];

    /* TVA POTTER, HALLNA ISAR. Batteriet, o-driften och laddboxen ar gron
       teknik. Elcentralen, spotlights, termostat och dimmer ar ROT pa
       arbetskostnaden och bar data-rot. Allt som ar ROT raknas bort ur gron
       teknik-basen, annars raknas samma krona tva ganger. Inget ROT-belopp
       raknas eller visas: bara vad tjansterna kostar, efter avdrag.
       PAKETKORTEN. Laddboxen och elcentralen ar tva radiogrupper med pris,
       fodda ur gemensamt/bitar.py:tjanstekort. Namnet ar gruppen plus "pkg".
       Potten star ocksa i innehall.json, och offert.py stoppar bygget om de
       tva drar isar. */
    var cenInp=document.querySelector('input[name="elcentralpkg"]:checked');
    var cen=cenInp?+cenInp.value:0, lb=+val("laddboxpkg");
    /* GRON TEKNIK-BASEN AR BRUTTO. Batteriets brutto star i modellfilen.
       Laddboxpaketets pris ar laddboxmallens netto vid 50 procent, och
       o-driftens 30 000 ar kundens pris netto (innehall.json odrift_pott), sa
       deras brutto ar det dubbla. Summan av brutton far EN gang halva, upp
       till potten: taket biter ocksa pa KOMBINATIONER (SAJ 35 kWh plus
       o-drift passerar 100 000 fast ingen enskild rad gor det). */
    var gtBrutto=s.brutto + 2*lb, rot=cen, rotNamn=[], valda=[], lagringRad=null;
    if(cenInp) rotNamn.push(CEN[String(cen)]);
    rader().forEach(function(r){
      var inp=r.querySelector("input.add"); if(!inp) return;
      r.classList.toggle("vald", inp.checked);
      var pr=r.querySelector(".o-radpris");
      if(pr && !inp.disabled) pr.textContent="+"+kr(radVarde(r));
      if(!inp.checked) return;
      var v=radVarde(r), namn=radNamn(r), arRot=inp.hasAttribute("data-rot");
      /* Lagringsraden lagger inte sitt value pa bruttot: den storre storlekens
         brutto ligger redan i s.brutto ovan. Raden ar en summeringsrad. */
      if(inp.getAttribute("data-grupp")==="lagring"){ lagringRad={namn:namn, pris:v}; return; }
      /* BRUTTOT STAR PA RADEN. value ar nettot kunden laser, data-brutto ar
         det som gar in i avdraget; bygget skriver bada ur prisformen i
         innehall.json och oraklet raknar om dem fran disk. Ett pris som
         halveras ser ut som ett pris (koordinatorn 24 okt), sa skriptet
         gissar inte: saknas data-brutto ar raden ett fel, inte ett netto. */
      var bru=+inp.getAttribute("data-brutto");
      if(!arRot && !bru) throw new Error("tillaggsraden "+inp.getAttribute("data-grupp")+" saknar data-brutto");
      valda.push({namn:namn, pris:v, rot:arRot, brutto:bru});
      if(arRot){ rot+=v; rotNamn.push(namn); } else { gtBrutto+=bru; }
    });
    /* SIDAN FAR INTE LOVA MER AN POTTEN. Uppmatt 23 okt fore taket fanns:
       "Gron teknik, 50 procent, minus 107 531 kr" pa SAJ HS3 40 kWh, ett
       avdrag kunden inte kan fa, och det ar KUNDEN som star for det mot
       Skatteverket. */
    var harRot=rotNamn.length>0;
    var gtAvdrag=Math.min(Math.floor(gtBrutto/2), POTT);
    var gtNetto=gtBrutto-gtAvdrag;
    var takBiter=gtAvdrag<Math.floor(gtBrutto/2);
    var brutto=gtBrutto, total=gtNetto+rot;

    /* Hjalten. Specen sager den effektiva storleken: det som installeras. */
    $("prodSpec").textContent=kwh(s.kwh)+" kWh, monterad och driftsatt";
    $("calcGross").textContent=kr(brutto);
    /* ETIKETTEN MASTE FOLJA TALET. Nar taket biter ar avdraget potten och
       inte halva bruttot, och raden far inte saga "50 procent" da. Kunden kan
       dividera. OCH DEN KORTA ETIKETTEN FAR INTE VARA LANGRE AN DEN LANGA:
       "Gron teknik, taket for tva personer" brot till tva rader i hjaltens
       209 px och flyttade sidan 20 px under fingret. Vad taket betyder star i
       summeringen, bredvid raden som bar mellanskillnaden. */
    $("calcDedNamn").textContent = takBiter ? "Grön teknik"
                                            : "Grön teknik, 50 procent";
    $("calcDed").textContent="−"+kr(gtAvdrag);
    $("calcCenRad").classList.toggle("dold", !harRot);
    if(harRot){
      $("calcCenNamn").textContent = rotNamn.length===1 ? rotNamn[0] : "Tjänster med ROT";
      $("calcCen").textContent=kr(rot);
    }
    $("calcNet").textContent=kr(total);

    var lista=ingarLista(s);
    if($("incList").innerHTML!==lista) $("incList").innerHTML=lista;

    /* Summeringen. VARJE RAD SAGER DET RADEN PA SIDAN SAGER. Batteriraden ar
       grundaffaren, forvalets storlek med sitt eget netto. Mer lagring star
       direkt under den med sitt eget tal, sa de tva tillsammans ar exakt den
       storre storlekens netto. En annan gron teknik-rad visar sitt eget netto,
       en ROT-rad ar redan netto. gtRader ar summan av det kunden LASER, och
       skillnaden mot totalen ar takraden nedanfor: nar potten ar forbrukad av
       batteriet far o-driften inget avdrag alls, och det ska sta som en rad
       med sitt skal, inte gommas i totalen. Kunden kan rakna. */
    var gtRader=netto(BAS.brutto);
    var rows='<div class="o-sumrow"><span>'+MODELL.namn+', '+kwh(BAS.kwh)+' kWh</span><span class="kr">'+kr(netto(BAS.brutto))+'</span></div>';
    if(lagringRad){ gtRader+=lagringRad.pris;
      rows+='<div class="o-sumrow sub"><span>'+lagringRad.namn+'</span><span class="kr">'+kr(lagringRad.pris)+'</span></div>'; }
    valda.forEach(function(v){
      var p = v.rot ? v.pris : netto(v.brutto);
      if(!v.rot) gtRader += p;
      rows+='<div class="o-sumrow sub"><span>'+v.namn+'</span><span class="kr">'+kr(p)+'</span></div>';
    });
    if(lb){ gtRader += netto(2*lb);
      rows+='<div class="o-sumrow sub"><span>'+LBP[String(lb)]+'</span><span class="kr">'+kr(netto(2*lb))+'</span></div>'; }
    if(cen) rows+='<div class="o-sumrow sub"><span>'+CEN[String(cen)]+'</span><span class="kr">'+kr(cen)+'</span></div>';
    var takTillagg = gtNetto - gtRader;
    /* AGARSVAR 53, 25 OKTOBER. Tva lydelser om taket togs bort har, och
       agarens ord star ordagrant i uppdrag/2026-10-25-svaren.md och i
       gemensamt/orakel.py:STRUKNA_FRASER. De star INTE har: en kommentar i
       skriptet ar skickade bytes, lasbara i Visa kallkod, och en struken
       formulering ska inte ga att hitta pa den publicerade sidan.

       RADEN MASTE FINNAS KVAR, bara inte med den lydelsen. Den bar
       mellanskillnaden mellan vad raderna visar och vad totalen sager; utan
       den summerar kolumnen inte, och fem rader summerade en gang till
       115 623 kr under en total pa 118 856. Etiketten sager nu vad raden ar
       utan att namna taket och utan att skriva ut potten: potten ar det
       utrymme kunden har kvar hos Skatteverket, och agarsvar 25 sager att
       det ar kundens ansvar och aldrig var text. */
    if(takTillagg > 0) rows+='<div class="o-sumrow sub"><span>Del utan grön teknik-avdrag</span><span class="kr">'+kr(takTillagg)+'</span></div>';
    if(takBiter) rows+='<div class="o-sumnote">Räknat på '+(PERSONER===1?'en person':'två personer')+' i hushållet.</div>';
    /* Grannrabatten raknas pa SKICKADE inbjudningar, som laddboxen och
       elcentralen gor. Raden andrar inte talet kunden betalar i dag: rabatten
       dras pa fakturan nar grannen har bestallt. Beloppet ar mallens eget. */
    var grannar=document.querySelectorAll("#refLista li").length;
    if(grannar) rows+='<div class="o-sumrow disc"><span>Rekommendationsrabatt, '+grannar+(grannar>1?' personer inbjudna':' person inbjuden')+'</span><span class="kr">dras när de beställt</span></div>'
      +'<div class="o-sumnote">Upp till '+kr(grannar*GRANNRABATT)+' av, '+kr(GRANNRABATT)+' för varje person som beställer. Ditt pris här ändras inte förrän det hänt.</div>';
    $("sumRows").innerHTML=rows;
    /* POTTRADEN SKRIVS INTE HAR, DEN HAMTAS. Meningen bor i
       gemensamt/block/pottext.js och ar husets enda. Agaren, uppgift 3:
       "Det borde sta 'inklusive moms efter gron teknik och ROT' nar jag
       lagger till en elcentral", och om Plejd och spotlights: "da gar det
       aterigen under ROT, sa dar maste det uppdateras."
       BAREN FAR SAMMA MENING UTAN SIN INLEDNING. Pa mobilen ar baren den yta
       som bar "Att betala", och den sa "efter gron teknik" aven med en
       elcentral i: samma defekt, andra ytan. Hela meningen far inte plats i
       baren vid 375 px, sa inledningen kapas av EN harledd strang. Det ar
       ingen andra mening: andras pottext.js slutar kapningen traffa, och
       oraklet pottraden_ar_harledd i offert.py stoppar bygget da.
       RAPPORTERAT: ratt losning ar en svansform i pottext.js, men den filen
       ar delad och ror jag den ror jag fyra andra mallar mitt i deras pass. */
    var pott=window.ampyPottext("grön teknik", harRot);
    $("sumPott").textContent=pott;
    /* SVANSEN UR SAMMA HARLEDNING, inte ur en kapning. Raden kapade
       "inkl. moms, " ur hela meningen, vilket fungerar tills nagon andrar
       inledningen; da far baren en stympad mening och ingenting sager
       ifran. ampyPottsvans kom till for just det. */
    $("barPott").textContent=window.ampyPottsvans("grön teknik", harRot);
    $("sumTotal").textContent=kr(total);
    $("sumBrutto").textContent=kr(brutto+rot);
    $("barTotal").textContent=kr(total);
    $("barBrutto").textContent=kr(brutto+rot);
    rensningsknappar();
  }

  /* ---- LYSSNARNA. Ett val ar ett val oavsett vilken vag det gjordes. ---- */
  document.querySelectorAll('input[name="elcentralpkg"], input[name="laddboxpkg"], input.add').forEach(function(i){
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
  /* andrar man antalet ar det ett val, sa rutan kryssas i */
  document.querySelectorAll("[data-antal]").forEach(function(sel){
    sel.addEventListener("change", function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      if(!i.disabled) i.checked=true;
      render();
    });
    sel.addEventListener("click", function(e){ e.stopPropagation(); });
  });
  /* byter man alternativ i en rullgardin ar det ett val, sa rutan kryssas i:
     mer lagring och laddboxpaketet i Ovriga tjanster gar samma vag */
  document.querySelectorAll(".o-variant").forEach(function(s){
    s.addEventListener("change", function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      if(!i.disabled) i.checked=true;
      render();
    });
    s.addEventListener("click", function(e){ e.stopPropagation(); });
  });

  /* FOKUSRYCKNINGEN. Ett tryck pa en etikett flyttar fokus till den dolda
     kryssrutan och webblasaren drar in den i vyn. Fokus tas sjalv pa
     pointerdown med preventScroll, i fangstfasen, sa webblasarens egen fokus
     inte rullar. */
  document.addEventListener("pointerdown", function(e){
    var lab=e.target.closest && e.target.closest("label.o-opt, label.o-rad, label.o-pkg");
    if(!lab) return;
    var i=lab.querySelector("input");
    if(i && !i.disabled){ try{ i.focus({preventScroll:true}); }catch(_){} }
  }, true);

  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }

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
         stallet for omraknat, sa de inte kan dra isar. Storleken ar den
         effektiva: det som installeras. */
      var kv=$("oaKvitto");
      if(kv){
        var s=ST[FORVAL+lagringSteg()];
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

  /* informationsrutan om tillaggen */
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      var id="modal"+this.getAttribute("data-info").charAt(0).toUpperCase()+this.getAttribute("data-info").slice(1);
      var m=document.getElementById(id);
      if(m&&m.showModal) m.showModal();
    });
  });

  /* Fore och efter: handlaren bor i gemensamt/block/foreefter.js och
     laggs pa varje sida av bygget. Tva kopior hade redan drivit isar
     och servicemallen hade ingen alls. */

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

  /* grann.js i gemensamt behover kunna rakna om summan. Potten exponeras sa
     att en sond (offerter/batteri/sonder/tillagg.js) kan prova takregeln i
     den riktiga webblasaren utan att lasa skriptets kalla. */
  window.__render = render;
  window.__pott = POTT;
  render();
})();
