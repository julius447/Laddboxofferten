(function(){
  "use strict";
  var kr=function(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" kr"; };
  var $=function(i){ return document.getElementById(i); };
  var val=function(n){ var e=document.querySelector('input[name="'+n+'"]:checked'); return e?e.value:"0"; };
  var MODELL={"id": "dyness-solis", "namn": "Dyness Stack 100 Pro + Solis S6", "modul_kwh": 5.12, "batteri": "Dyness Stack 100 Pro", "storlekar": [{"kwh": 15.36, "moduler": 3, "brutto": 91850, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 20.38, "moduler": null, "brutto": 103000, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 25.6, "moduler": 5, "brutto": 113676, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 30.72, "moduler": 6, "brutto": 124588, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 35.84, "moduler": 7, "brutto": 135500, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 40.96, "moduler": 8, "brutto": 147876, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 46.08, "moduler": 9, "brutto": 161076, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 51.28, "moduler": 10, "brutto": 174562, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 56.32, "moduler": 11, "brutto": 190000, "vaxelriktare": "Solis S6 10 kW"}, {"kwh": 61.44, "moduler": 12, "brutto": 199126, "vaxelriktare": "Solis S6 10 kW"}]};
  var FORVAL=3;
  var POTT=100000;
  var PERSONER=2;
  var GRANNRABATT=3000;
  var CEN={"5990": "Byte av elcentral, liten central", "9750": "Byte av elcentral, medel central", "17250": "Byte av elcentral, stor central"};
  var BOCK="<span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span>";
  var LBP={"4450": "Laddbox Bas, Zaptec Go", "5740": "Laddbox Plus, Zaptec Go", "9170": "Laddbox Premium, Zaptec Go"};
  var INGAR={"hard": [{"namn": "Batterimoduler {batteri}", "spec": "{kwh} kWh{moduler}"}, {"namn": "Hybridväxelriktare", "spec": "{vaxelriktare}"}, {"namn": "Säkringar och skydd som installationen kräver", "spec": ""}], "jobb": ["Montering och installation, egna elektriker", "Anslutning till elcentral och dina solceller", "Upp till 10 meter kabel, frakt hem till dig", "För- och färdiganmälan, driftsättning, test", "Kontrollmätning, genomgång av appen, 10 års produktgaranti"]};
  var ST=MODELL.storlekar, BAS=ST[FORVAL];
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
  function lagringSteg(){
    var i=document.querySelector('input.add[data-grupp="lagring"]');
    if(!i || !i.checked) return 0;
    var s=i.closest(".o-rad").querySelector(".o-variant");
    var o=s && s.options[s.selectedIndex];
    return o ? (+o.getAttribute("data-steg") || 0) : 0;
  }
  function ingarLista(s){
    var mod = s.moduler ? ", "+s.moduler+(s.moduler===1?" modul à ":" moduler à ")+kwh(MODELL.modul_kwh)+" kWh" : "";
    function fyll(t){
      return t.replace("{batteri}", MODELL.batteri).replace("{kwh}", kwh(s.kwh))
              .replace("{moduler}", mod).replace("{vaxelriktare}", s.vaxelriktare);
    }
    return INGAR.hard.map(function(h){
      var spec=fyll(h.spec);
      return '<li class="prod">'+BOCK+'<span><b>'+fyll(h.namn)+'</b>'+(spec?'<span>'+spec+'</span>':'')+'</span></li>';
    }).join("");
  }
  function render(){
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');
    var steg=lagringSteg(), s=ST[FORVAL+steg];
    var cenInp=document.querySelector('input[name="elcentralpkg"]:checked');
    var cen=cenInp?+cenInp.value:0, lb=+val("laddboxpkg");
    var gtBrutto=s.brutto + 2*lb, rot=cen, rotNamn=[], valda=[], lagringRad=null;
    if(cenInp) rotNamn.push(CEN[String(cen)]);
    rader().forEach(function(r){
      var inp=r.querySelector("input.add"); if(!inp) return;
      r.classList.toggle("vald", inp.checked);
      var pr=r.querySelector(".o-radpris");
      if(pr && !inp.disabled) pr.textContent="+"+kr(radVarde(r));
      if(!inp.checked) return;
      var v=radVarde(r), namn=radNamn(r), arRot=inp.hasAttribute("data-rot");
      if(inp.getAttribute("data-grupp")==="lagring"){ lagringRad={namn:namn, pris:v}; return; }
      var bru=+inp.getAttribute("data-brutto");
      if(!arRot && !bru) throw new Error("tillaggsraden "+inp.getAttribute("data-grupp")+" saknar data-brutto");
      valda.push({namn:namn, pris:v, rot:arRot, brutto:bru});
      if(arRot){ rot+=v; rotNamn.push(namn); } else { gtBrutto+=bru; }
    });
    var harRot=rotNamn.length>0;
    var gtAvdrag=Math.min(Math.floor(gtBrutto/2), POTT);
    var gtNetto=gtBrutto-gtAvdrag;
    var takBiter=gtAvdrag<Math.floor(gtBrutto/2);
    var brutto=gtBrutto, total=gtNetto+rot;
    $("prodSpec").textContent="Monterad och driftsatt";
    $("calcGross").textContent=kr(brutto);
    $("calcDedNamn").textContent = takBiter ? "Avdrag för grön teknik"
                                            : "50 % avdrag för grön teknik";
    $("calcDed").textContent="−"+kr(gtAvdrag);
    $("calcCenRad").classList.toggle("dold", !harRot);
    if(harRot){
      $("calcCenNamn").textContent = rotNamn.length===1 ? rotNamn[0] : "Tjänster med ROT";
      $("calcCen").textContent=kr(rot);
    }
    $("calcNet").textContent=kr(total);
    var lista=ingarLista(s);
    if($("incList").innerHTML!==lista) $("incList").innerHTML=lista;
    var gtRader=netto(BAS.brutto);
    var rows='<div class="o-sumrow"><span>'+MODELL.namn+'</span><span class="kr">'+kr(netto(BAS.brutto))+'</span></div>';
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
    if(takTillagg > 0) rows+='<div class="o-sumrow sub"><span>Del utan grön teknik-avdrag</span><span class="kr">'+kr(takTillagg)+'</span></div>';
    if(takBiter) rows+='<div class="o-sumnote">Räknat på '+(PERSONER===1?'en person':'två personer')+' i hushållet.</div>';
    var grannar=document.querySelectorAll("#refLista li").length;
    if(grannar) rows+='<div class="o-sumrow disc"><span>Rekommendationsrabatt, '+grannar+(grannar>1?' personer inbjudna':' person inbjuden')+'</span><span class="kr">dras när de beställt</span></div>'
      +'<div class="o-sumnote">Upp till '+kr(grannar*GRANNRABATT)+' av, '+kr(GRANNRABATT)+' för varje person som beställer. Ditt pris här ändras inte förrän det hänt.</div>';
    $("sumRows").innerHTML=rows;
    var pott=window.ampyPottext("grön teknik", harRot);
    $("sumPott").textContent=pott;
    $("barPott").textContent=window.ampyPottsvans("grön teknik", harRot);
    $("sumTotal").textContent=kr(total);
    $("sumBrutto").textContent=kr(brutto+rot);
    $("barTotal").textContent=kr(total);
    $("barBrutto").textContent=kr(brutto+rot);
    rensningsknappar();
  }
  document.querySelectorAll('input[name="elcentralpkg"], input[name="laddboxpkg"], input.add').forEach(function(i){
    i.addEventListener("change", render);
  });
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
  document.querySelectorAll("[data-antal]").forEach(function(sel){
    sel.addEventListener("change", function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      if(!i.disabled) i.checked=true;
      render();
    });
    sel.addEventListener("click", function(e){ e.stopPropagation(); });
  });
  document.querySelectorAll(".o-variant").forEach(function(s){
    s.addEventListener("change", function(){
      var i=this.closest(".o-rad").querySelector("input.add");
      if(!i.disabled) i.checked=true;
      render();
    });
    s.addEventListener("click", function(e){ e.stopPropagation(); });
  });
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
  function visaSkarm(id){
    var sk=$(id);
    if(!sk) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    sk.hidden=false; sk.classList.add("syns");
    if(id==="skarmAccept"){
      var kv=$("oaKvitto");
      if(kv){
        var s=ST[FORVAL+lagringSteg()];
        var od=document.querySelector('input.add[data-grupp="odrift"]:checked');
        $("oaTotal").textContent=$("sumTotal").textContent;
        $("oaPaket").textContent=MODELL.namn+", "+kwh(s.kwh)+" kWh"+(od?", med ö-drift":"");
        kv.hidden=false;
      }
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked=false; });
    }
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
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      var id="modal"+this.getAttribute("data-info").charAt(0).toUpperCase()+this.getAttribute("data-info").slice(1);
      var m=document.getElementById(id);
      if(m&&m.showModal) m.showModal();
    });
  });
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
  window.__render = render;
  window.__pott = POTT;
  render();
})();
