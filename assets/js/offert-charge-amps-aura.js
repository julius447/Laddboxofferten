(function(){
  var kr=function(n){return n.toLocaleString("sv-SE").replace(/ /g," ")+" kr";};
  var $=function(i){return document.getElementById(i);};
  var val=function(n){var e=document.querySelector('input[name="'+n+'"]:checked');return e?e.value:"0";};
  var BAS=14550;        /* ur modellfilen */

  /* PKG genereras av src/bygg.py ur src/paket.json, samma källa som
     punktlistan och brickorna i korten. Tre konsumenter, en sanning. */
  var PKG={"0": {"namn": "Bas", "spec": "11 kW, monterad och driftsatt", "kw": 11, "inc": "<li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Charge Amps Aura</b></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>11 kW</b><span>laddeffekt</span></span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Personskyddsautomat 16 A och egen grupp</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Upp till 10 meter installationskabel, 5G2,5</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Två håltagningar</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Installation av våra egna elektriker</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Driftsättning och genomgång av appen</span></li>"}, "1590": {"namn": "Plus", "spec": "11 kW med lastbalansering", "kw": 11, "inc": "<li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Charge Amps Aura</b></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>11 kW</b><span>laddeffekt</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Perific One</b><span>lastbalansering</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Zaptec Chill</b></span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Personskyddsautomat 16 A och egen grupp</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Upp till 10 meter installationskabel, 5G2,5</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Två håltagningar</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Installation av våra egna elektriker</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Driftsättning och genomgång av appen</span></li>"}, "3710": {"namn": "Premium", "spec": "22 kW med Perific Max", "kw": 22, "inc": "<li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Charge Amps Aura</b></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>22 kW</b><span>laddeffekt</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Perific Max</b><span>lastbalansering</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Laddkabel 22 kW</b><span>5 meter</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Zaptec Chill</b></span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Uppgraderad installation till 22 kW, större kabel och säkring</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Personskyddsautomat och egen grupp</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Upp till 10 meter installationskabel, 5G2,5</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Två håltagningar</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Installation av våra egna elektriker</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Driftsättning och genomgång av appen</span></li>"}};
  var INGAR={"0": [], "1590": ["perific", "kabelhallare"], "3710": ["kw22", "perific", "kabel11", "kabel22", "kabelhallare"]};
  var PKGVARIANT={"1590": {"perific": "Perific One"}, "3710": {"perific": "Perific Max"}};
  var TID={"0":"","1500":"Prioritet, 3 till 5 dagar","2500":"Express, 24 till 72 timmar"};
  /* De AGARLASTA talen, beslut C4 19 okt, samma som offerter/elcentral/
     paket.json. Laddboxsidan bar tidigare 9 900 och 12 900 ur Rasmus
     prislista, alltsa 90 kr och 2 000 kr fran vad elcentralofferten
     sager om samma produkt. Tva Ampy-ytor far inte saga olika. */
  var CEN={"5990":"Byte av elcentral, liten","9990":"Byte av elcentral, medel","14900":"Byte av elcentral, stor"};

  /* kundens egna kryss minns, så ett paketbyte aldrig raderar dem tyst */
  var kundval={};
  function rader(){ return [].slice.call(document.querySelectorAll(".o-rad")); }
  /* ANTAL GANGER STYCKPRIS. Spotlights saldes forut i fasta klumpar,
     "4 stycken" for 3 200, "6 stycken" for 4 800. Kunden vill ha SITT antal,
     inte vart. Agaren ville ha elcentralens sifferruta overallt. */
  function radAntal(r){
    var a=r.querySelector("[data-antal]");
    return a ? +a.value : 1;
  }
  function radVarde(r){
    var i=r.querySelector("input.add");
    var styck=i.getAttribute("data-styck");
    if(styck) return (+styck) * radAntal(r);
    var s=r.querySelector(".o-variant");
    return s ? +s.value : +i.value;
  }
  function radNamn(r){
    var i=r.querySelector("input.add");
    var n=i.getAttribute("data-name");
    if(i.getAttribute("data-styck")){
      var an=radAntal(r);
      return n+", "+an+" "+(an===1?"styck":"stycken");
    }
    var s=r.querySelector(".o-variant");
    return s ? n+", "+s.options[s.selectedIndex].text : n;
  }

  function toppAbs(e){var y=0;while(e){y+=e.offsetTop;e=e.offsetParent;}return y;}


  /* En variant ar en LANGD om alla dess val slutar pa "meter". Langdvalet
     overlever en paketlasning, allt annat lases med raden. */
  function arLangd(sel){
    var ok=true;
    Array.prototype.forEach.call(sel.options,function(o){
      if(!/meter\s*$/.test(o.textContent.trim())) ok=false;
    });
    return ok && sel.options.length>0;
  }
  function hittaRad(grupp){
    var i=document.querySelector('input.add[data-grupp="'+grupp+'"]');
    return i?i.closest(".o-rad"):null;
  }

  function render(){
    var pkg=val("pkg"), tid=val("tid"), cen=val("central"), plats=val("plats");
    /* Go 2-uppgraderingen finns BARA pa Zaptec Go-mallen. Pa de andra sex
       ar raden borttagen ur markupen, inte gomd, sa uppslaget maste tala att
       den saknas. Oraklet fangade det direkt: "skriptet slar upp id som inte
       finns i markupen: go2". */
    var go2ruta=$("go2"), go2=!!(go2ruta && go2ruta.checked);
    var p=PKG[pkg];

    /* 22 KW-KABELN VISAS BARA NAR 22 KW AR VALT. Prislistan 20 okt:
       "Visas endast om uppgraderad installation ar vald". En 22 kW-kabel i en
       11 kW-installation ar en dyrare kabel som inte laddar snabbare, alltsa
       ett tillagg kunden betalar for utan att fa nagot. Vacks valet bort
       slacks kabeln ocksa, annars ligger den kvar i summan osynlig. */
    var kw22ruta = document.querySelector('input.add[data-grupp="kw22"]');
    var har22 = (kw22ruta && kw22ruta.checked) || (p && p.kw === 22);
    var rad22 = document.querySelector('input.add[data-grupp="kabel22"]');
    if(rad22){
      var kort22 = rad22.closest(".o-rad");
      kort22.hidden = !har22;
      /* Bocka UR rutan, men glom inte kundens val. Forut nollades ocksa
         kundval, sa den som bockade av 22 kW och pa igen fick kabeln tyst
         borttagen ur summan medan langdvalet lag kvar i dropdownen.
         kabel11 sparade redan sitt kundval, sa samma fil hade tva olika
         angerregler for samma sorts val. */
      if(!har22 && rad22.checked){ rad22.checked = false; }
    }

    /* TRE LÅSNINGSORSAKER, INTE EN.

       Förut fanns bara "ingår i paketet", och det var roten till två fel.

       1. INGAR     kunden får den, den är betald i paketet.
       2. UTESLUTEN kunden får den INTE och kan inte köpa den, för något hon
                    redan har ersätter den.
       3. fri       valbar.

       DEFEKTEN SOM RÄTTAS: utestängningen av lastbalanseringar kördes BARA
       när kunden själv klickade i en ruta. Ingick en i paketet, som Zaptec
       Sense i Plus, låstes bara den raden medan Perific, Tibber och Easee
       Equalizer lämnades fria. En Plus-kund kunde alltså kryssa i tre till
       och betala för FYRA enheter som gör exakt samma sak.

       Och de två tillstånden får inte dela text. "Ingår i Premium" på
       11 kW-kabeln påstod att kunden får två kablar. Den ska säga att den är
       ersatt. */
    var ingar=INGAR[pkg]||[];
    var LB=["sense","equalizer","tibber","perific"];

    /* vilken lastbalansering paketet redan bär, om någon */
    var lbIPaket=null;
    LB.forEach(function(g){ if(ingar.indexOf(g)>=0) lbIPaket=g; });

    /* 22 kW-paket: 11 kW-kabeln är ersatt, inte inkluderad */
    var kabelErsatt = har22 ? "kabel11" : null;

    rader().forEach(function(r){
      var i=r.querySelector("input.add"), g=i.getAttribute("data-grupp");
      var med=ingar.indexOf(g)>=0 && g!==kabelErsatt;
      var ute=false, uteText="";

      if(!med && lbIPaket && LB.indexOf(g)>=0){
        /* KORT TEXT, INTE PRODUKTNAMNET.
           "Ingår redan: Perific lastbalansering" bryter radens layout: namnet
           ar langre an kolumnen och klipps mitt i ordet. Agaren: "da gar
           designen sonder... Vi vill bara morka ner dem." Tva ord racker, och
           raden ar redan nedtonad, sa skalet syns pa formen ocksa. */
        ute=true; uteText="Ingår redan";
      }
      if(g===kabelErsatt){
        ute=true; uteText="Ersatt av 22 kW";
      }

      var last=med||ute;
      r.classList.toggle("ingar",med);
      r.classList.toggle("utesluten",ute);
      i.disabled=last;
      if(last){ i.checked=false; }
      else if(kundval[g]){ i.checked=true; }

      /* LÄNGDEN FÅR ALDRIG LÅSAS. Ägaren: längd 5 eller 10 meter ska vara
         valbar oavsett paket. Förut låstes varianten tillsammans med raden,
         så en Premiumkund inte kunde välja 10 meter alls. */
      var s=r.querySelector(".o-variant");
      if(s) s.disabled = ute || (med && !arLangd(s));

      /* EN LAST RAD MASTE VISA DET PAKETET FAKTISKT BAR.
         Lases raden som "ingar" och paketet namnger en variant, stall
         dropdownen pa den och byt bilden med. Utan det sa Premium-raden
         "Perific One" medan kortet och priset bar Max. */
      if(s && !arLangd(s) && !med && !ute && kundvariant[g] !== undefined
         && s.selectedIndex !== kundvariant[g]){
        /* Raden ar fri igen: tillbaka till kundens eget val. */
        s.selectedIndex = kundvariant[g];
        var nk=s.getAttribute("data-bild");
        if(nk){
          var bd=r.querySelector(".o-radbild img"), n2=nk.split(",")[s.selectedIndex];
          if(bd && IMGS[n2]) bd.src=IMGS[n2];
        }
      }
      if(med && s && !arLangd(s)){
        var vill=(PKGVARIANT[pkg]||{})[g];
        if(vill){
          for(var vi=0; vi<s.options.length; vi++){
            if(s.options[vi].text.indexOf(vill)===0 || vill.indexOf(s.options[vi].text)===0){
              if(s.selectedIndex!==vi){
                s.selectedIndex=vi;
                var nyck=s.getAttribute("data-bild");
                if(nyck){
                  var bld=r.querySelector(".o-radbild img"), nn=nyck.split(",")[vi];
                  if(bld && IMGS[nn]){ bld.src=IMGS[nn]; bld.alt=vill; }
                }
              }
              break;
            }
          }
        }
      }

      var pr=r.querySelector(".o-radpris");
      if(med){ pr.textContent="Ingår i "+p.namn; pr.classList.add("ingarpris"); }
      else if(ute){ pr.textContent=uteText; pr.classList.add("ingarpris"); }
      else { pr.classList.remove("ingarpris"); }
    });

    var paketpris=BAS+(+pkg);
    var cenPris=(+cen>0)?+cen:0;
    var sum=paketpris+(+tid)+(+plats)+cenPris;   /* Go 2 är en vanlig tilläggsrad nu */
    var valda=[];
    /* ROT och grön teknik är två olika avdrag ur två olika potter. Laddpunkten
       är grön teknik; elcentralen, spotlightsen och termostaten är ROT på
       arbetskostnaden. Allt som är ROT måste därför bort ur grön teknik-basen,
       annars räknas samma krona två gånger och hjältetalet blir fel. */
    var rotSum=cenPris, rotNamn=[];
    if (cenPris) rotNamn.push(CEN[cen]);
    /* Intresseanmälan: krysset betyder "berätta mer", inte "lägg till".
       Ett batteri går inte att prissätta utan att se taket och förbrukningen,
       och en offert ska inte bära ett tal som inte är räknat. */
    var intresse=[];
    /* MELLANSKILLNADEN. En kabel som INGAR i paketet ar betald i 5-meters-
       utforande. Valjer kunden 10 meter far hon inte kabeln gratis, men hon
       ska inte heller betala hela 10-meterspriset: hon betalar SKILLNADEN.
       Agaren: langden ska vara valbar oavsett paket. Utan det har blocket var
       dropdownen valbar men andrade ingenting, vilket ar varre an en last
       dropdown: den ser ut att gora nagot. */
    rader().forEach(function(r){
      var i=r.querySelector("input.add");
      if(!i.disabled || !r.classList.contains("ingar")) return;
      var sel=r.querySelector(".o-variant");
      if(!sel || sel.disabled || sel.selectedIndex===0) return;
      var delta=(+sel.value) - (+sel.options[0].value);
      if(delta>0){
        sum+=delta; rotSum+=0;
        /* Nyckeln heter "pris", inte "v". Alla andra rader anvander pris, och
           summeringen laser pris. Med v: skrev sidan "pris saknas" bredvid en
           rad som hade ett helt korrekt tal i totalen. */
        valda.push({namn:radNamn(r)+" i stället för "+sel.options[0].text.trim(), pris:delta});
      }
    });

    rader().forEach(function(r){
      var i=r.querySelector("input.add");
      r.classList.toggle("vald", i.checked && !i.disabled);
      if(i.disabled) return;
      if(r.querySelector("input.add").hasAttribute("data-intresse")){
        if(i.checked) intresse.push(radNamn(r));
        return;
      }
      var v=radVarde(r);
      r.querySelector(".o-radpris").textContent = v ? "+"+kr(v) : "pris saknas";
      if(i.checked){
        sum+=v; valda.push({namn:radNamn(r), pris:v});
        if(i.hasAttribute("data-rot")){ rotSum+=v; rotNamn.push(radNamn(r)); }
      }
    });
    var mitt = sum;

    $("prodName").textContent = go2 ? "Zaptec Go 2" : "Charge Amps Aura";
    $("heroImg").src = go2 ? IMGS["zaptec-go-2"] : IMGS["charge-amps-aura"];
    $("prodSpec").textContent = p.spec;

    /* Markupen är genererad i bygget, inte här: listan i kortet och listan
       här ska aldrig kunna säga olika saker. Enda skillnaden är namnet när
       kunden har kryssat i Go 2. */
    var nyLista = go2 ? p.inc.replace("<b>Zaptec Go</b>","<b>Zaptec Go 2</b>") : p.inc;
    if ($("incList").innerHTML !== nyLista){
      /* Listan ligger OVANFÖR paketkorten. Byter man paket med folden öppen
         ändras dess höjd med upp till 106 px, och allt kunden tittar på
         trycks ner lika mycket. offsetTop är skaloberoende, till skillnad
         från getBoundingClientRect inne i en skalad ram. */
      $("incList").innerHTML = nyLista;
    }

    /* grön teknik gäller laddpunkten, inte elcentralbytet. Det är ROT och räknas separat. */
    /* Bruttot är grön teknik-basen före avdrag PLUS allt som är ROT, för ROT
       dras på arbetskostnaden och inte på hela priset. Raden räknade bara
       elcentralen tidigare; nu när spotlights och termostat också är ROT
       måste hela rotSum med, annars visar baren ett brutto som är för lågt. */
    var gtBas = mitt - rotSum;
    $("calcGross").textContent = kr(gtBas*2);
    /* MINUSTECKEN, inte ordet "minus". Agaren vande tre ganger och landade i:
     "Vi gor sa har. Kor gront. Andra minus till minustecken."
     Tecknet ar U+2212 MINUS SIGN, inte bindestreck och inte tankstreck:
     bindestrecket ar for kort bredvid siffror och tankstrecket ar ett
     AI-tell. Markupen bar samma tecken, annars blinkar ordet forbi innan
     forsta render. */
    $("calcDed").textContent = "\u2212" + kr(gtBas);
    $("calcCenRad").classList.toggle("dold", !rotSum);
    $("calcCenNot").classList.toggle("dold", !rotSum);
    if (rotSum){
      $("calcCenNamn").textContent = rotNamn.length===1 ? rotNamn[0] : "Tjänster med ROT";
      $("calcCen").textContent = kr(rotSum);
    }
    $("calcNet").textContent = kr(mitt);

    var rows = '<div class="o-sumrow"><span>Paket '+p.namn+'</span><span class="kr">'+kr(paketpris)+'</span></div>';
    valda.forEach(function(v){
      rows += '<div class="o-sumrow sub"><span>'+v.namn+'</span><span class="kr">'+(v.pris?kr(v.pris):"pris saknas")+'</span></div>';
    });
    if (+plats) rows += '<div class="o-sumrow sub"><span>Laddstolpe i stället för vägg</span><span class="kr">'+kr(+plats)+'</span></div>';
    if (+tid) rows += '<div class="o-sumrow sub"><span>'+TID[tid]+'</span><span class="kr">'+kr(+tid)+'</span></div>';
    if (+cen) rows += '<div class="o-sumrow sub"><span>'+CEN[cen]+'</span><span class="kr">'+(cenPris?kr(cenPris):"vi återkommer")+'</span></div>';
    if (intresse.length){
      rows += '<div class="o-sumrow grp"><span>Vi hör av oss om</span><span></span></div>';
      intresse.forEach(function(x){
        rows += '<div class="o-sumrow sub"><span>'+x+'</span><span>ingen kostnad nu</span></div>';
      });
    }
    var grannar=document.querySelectorAll("#refLista li").length;
    if (grannar) rows += '<div class="o-sumrow disc"><span>Grannrabatt, '+grannar+(grannar>1?' grannar inbjudna':' granne inbjuden')+'</span><span class="kr">dras när de beställt</span></div>'
      + '<div class="o-sumnote">Upp till '+kr(grannar*500)+' av, 500 kr för varje granne som beställer. Ditt pris här ändras inte förrän det hänt.</div>';
    $("sumRows").innerHTML = rows;
    $("sumTotal").textContent = kr(mitt);
    $("sumBrutto").textContent = kr(gtBas*2 + rotSum);
    $("barTotal").textContent = kr(mitt);
    $("barBrutto").textContent = kr(gtBas*2 + rotSum);

  }

  document.querySelectorAll('input[name="pkg"],input[name="tid"],input[name="central"],input[name="plats"]')
    .forEach(function(i){i.addEventListener("change",render);});

  /* Elcentralbytet är ett tillval utan "nej tack"-ruta. Klickar man på det
     kort man redan valt släpper valet, så man kan ångra sig utan att leta
     efter en avbrytknapp. */
  document.querySelectorAll('input[name="central"]').forEach(function(i){
    i.addEventListener("click",function(e){
      if(this.dataset.var==="1"){ this.checked=false; this.dataset.var=""; render(); }
      else { document.querySelectorAll('input[name="central"]').forEach(function(x){x.dataset.var="";});
             this.dataset.var="1"; }
    });
  });
  /* Ordningen är hela poängen. Tidigare satt render() som lyssnare FÖRE den här,
     så den hann läsa ett inaktuellt kundval och kryssa i rutan igen innan minnet
     uppdaterades. Resultatet var att man inte kunde avmarkera ett tillägg alls.
     Minnet skrivs nu först, render körs efteråt. */
  /* ENDAST EN LASTBALANSERING. Prislistan 20 okt: "endast 1 lastbalansering
     gar att valja". Forut var Sense, Equalizer, Tibber och Perific fyra
     oberoende kryssrutor, sa kunden kunde kopa fyra enheter som gor samma
     sak och betala for alla fyra. Kryssar man i en slacks de andra. */
  var LASTBALANS = ["sense","equalizer","tibber","perific"];

  document.querySelectorAll("input.add").forEach(function(i){
    i.addEventListener("change",function(){
      var g = this.getAttribute("data-grupp");
      if(!this.disabled) kundval[g] = this.checked;
      if(this.checked && LASTBALANS.indexOf(g) >= 0){
        LASTBALANS.forEach(function(annan){
          if(annan === g) return;
          var ruta = document.querySelector('input.add[data-grupp="'+annan+'"]');
          if(ruta && ruta.checked && !ruta.disabled){ ruta.checked = false; kundval[annan] = false; }
        });
      }
      render();
    });
  });


  /* andrar man antalet ar det ett val, sa rutan kryssas i */
  document.querySelectorAll("[data-antal]").forEach(function(sel){
    sel.addEventListener("change",function(){
      var r=this.closest(".o-rad"), i=r.querySelector("input.add");
      if(!i.disabled){ i.checked=true; kundval[i.getAttribute("data-grupp")]=true; }
      var pr=r.querySelector(".o-radpris");
      if(pr && !i.disabled) pr.textContent="+"+kr(radVarde(r));
      render();
    });
  });

  /* byter man variant i raden är det ett val, så rutan kryssas i */
  document.querySelectorAll(".o-variant").forEach(function(s){
    s.addEventListener("change",function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      i.checked=true;
      /* Minnet skrivs HAR, fore render(). Lag skrivningen i en egen lyssnare
         kordes render forst, och aterstallningen slog da tillbaka kundens
         just gjorda val. Samma falla som kundval en gang hade. */
      if(!arLangd(this)) kundvariant[this.getAttribute("data-grupp")]=this.selectedIndex;
      var nycklar=this.getAttribute("data-bild");
      if(nycklar){
        var bild=this.closest(".o-rad").querySelector(".o-radbild img");
        var n=nycklar.split(",")[this.selectedIndex];
        if(bild && IMGS[n]) bild.src=IMGS[n];
      }
      render();
    });
    s.addEventListener("click",function(e){ e.stopPropagation(); });
  });


  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* FOKUSRYCKNINGEN.
     Varje val är en etikett runt en dold kryssruta. Ett tryck på etiketten
     flyttar fokus till kryssrutan, och webbläsaren drar då in den i vyn. Är
     kortet högre än skärmen går det inte att se hela: man trycker på den
     synliga nedre delen och sidan rycker upp överkanten. Uppmätt vid 390 x 812
     med kortet mitt i vyn: noll i sju fall av åtta, men Premiumkortet är 989 px
     högt mot en skärm på 812 och rycker 415 px. Med scroll-behavior: smooth
     animeras hela sträckan, vilket är det som känns som att flängas.
     Åtgärden: ta fokus SJÄLVA på pointerdown, med preventScroll. Då är rutan
     redan fokuserad när webbläsarens egen fokus kommer, och den rullar inte.
     Capture-fasen, så vi hinner före. */
  document.addEventListener("pointerdown", function(e){
    var lab = e.target.closest && e.target.closest("label.o-pkg, label.o-opt, label.o-rad, label.o-plats");
    if (!lab) return;
    var i = lab.querySelector("input");
    if (i && !i.disabled) { try { i.focus({preventScroll:true}); } catch(_) { } }
  }, true);

  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }

  function panel(btnId,panelId,other){
    var b=$(btnId), p=$(panelId);
    b.addEventListener("click",function(){
      var open=p.hidden; p.hidden=!open; b.setAttribute("aria-expanded",open?"true":"false");
      if(open&&other) $(other).hidden=true;
      if(open){var ta=p.querySelector("textarea"); if(ta) ta.focus();}
    });
  }
  panel("fraga","fragaPanel","avbojPanel");
  panel("avboj","avbojPanel","fragaPanel");

  /* I produktion är accept och avböj egna sidor. Prototypen visar dem som
     egna skärmar i stället för en inline-rad, så flödet går att granska. */
  function visaSkarm(id){
    var s=document.getElementById(id);
    if(!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden=false; s.classList.add("syns");
    var sc=document.getElementById("scroller")||document.scrollingElement;
    if(sc) sc.scrollTop=0; else window.scrollTo(0,0);
  }

  var avbojSend=document.getElementById("avbojSend");
  if (avbojSend) avbojSend.addEventListener("click",function(){ visaSkarm("skarmAvboj"); });

  $("fragaSend").addEventListener("click",function(){
    var ta=$("fragaText"), h=$("fragaHint");
    if(!ta.value.trim()){ h.textContent="Skriv din fråga i rutan först."; ta.focus(); return; }
    h.textContent="Frågan är mottagen.";
    this.disabled=true; ta.readOnly=true;
  });
  /* Chips-faltet ligger i gemensamt/block/grann.js: markupen ar delad,
     sa koden ska vara det ocksa. */
  /* KUNDENS EGET VARIANTVAL, skilt fran paketets.
     Nar ett paket laser en rad satts varianten till det paketet bar. Lamnas
     bara det kvar nar kunden gar tillbaka till Bas har paketet tyst andrat
     ett val kunden sjalv gjort. Samma skal som kundval finns for kryssen. */
  var kundvariant = {};
  document.querySelectorAll(".o-variant").forEach(function(s){
    if(!arLangd(s)) kundvariant[s.getAttribute("data-grupp")] = s.selectedIndex;
  });

  window.__render = render;

  /* informationsrutorna */
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click",function(e){
      e.preventDefault(); e.stopPropagation();
      var id="modal"+this.getAttribute("data-info").charAt(0).toUpperCase()+this.getAttribute("data-info").slice(1);
      var m=document.getElementById(id);
      if(m&&m.showModal) m.showModal();
    });
  });

  /* före och efter */
  (function(){
    var r=$("feReglage"); if(!r) return;
    var box=r.closest(".o-fe");
    r.addEventListener("input",function(){ box.style.setProperty("--fe", this.value); });
  })();

  $("barGo").addEventListener("click",function(){ scrollTill($("summering"),"start"); });

  $("acceptBtn").addEventListener("click",function(){ visaSkarm("skarmAccept"); });



  var frame=$("frame"), stage=document.querySelector(".stage");
  /* INGEN SKALNING AV RAMEN.
     Förut skalades bredare lägen ner med transform: scale(). Tre följder:
     1. En granskningsram som skalar ljuger om renderingen.
     2. getBoundingClientRect returnerar SKALADE mått, och allt inuti ramen som
        mäter sig självt får fel svar. Splide mäter sig självt: karusellen
        parkerade mellan två kort och såg ut att ha fastnat mitt i ett svep.
     3. avail kunde bli negativt i ett fönster som rapporterar innerWidth 0,
        och skalan blev -0,107, alltså spegelvänd och en tiondel.
     Nu renderar ramen 1:1 och scenen scrollar i sidled när fönstret är smalare
     än läget. Uppmätt i webbläsaren: skala -0,107 blev ingen skala alls, och
     spårets rect gick från 36,6 till 343, samma som offsetWidth. */
  function fit(){
    if(!frame) return;
    frame.style.transform="";
    stage.style.width=(parseInt(frame.style.width,10)||375)+"px";
    stage.style.height=(parseInt(frame.style.height,10)||812)+"px";
  }
  document.querySelectorAll(".switch button").forEach(function(b){
    b.addEventListener("click",function(){
      document.querySelectorAll(".switch button").forEach(function(o){o.setAttribute("aria-pressed",o===b?"true":"false");});
      frame.style.width=b.getAttribute("data-w")+"px";
      frame.style.height=b.getAttribute("data-h")+"px";
      fit(); measure();
    });
  });
  window.addEventListener("resize", fit);
  function measure(){
    if(!frame||parseInt(frame.style.width,10)!==390) return;
    var sc=$("scroller");
    if($("mHeight")) $("mHeight").textContent=(sc.scrollHeight/844).toFixed(1).replace(".",",")+" skärmar";
  }

  render(); fit();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(function(){fit();measure();},60);});}
  setTimeout(function(){fit();measure();},600);
})();
