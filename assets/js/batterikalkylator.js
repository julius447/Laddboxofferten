
window.AMPY_BATTERY_DATA = {
 "BATTERIES": [
  {
   "id": "eway",
   "inverterKw": 10,
   "powerKwPerKwh": 0.65,
   "name": "Eway Pro",
   "defaultKwh": 27.66,
   "tier": "Prisvärd",
   "image": "img/batteri-eway.webp",
   "pitch": "Mest lagring för pengarna, med robusta LFP-celler.",
   "available": true,
   "roundTripEfficiencyPct": 92,
   "depthOfDischargePct": 95,
   "supportsStodtjanster": true,
   "chemistry": "LiFePO4",
   "slug": "/solcellsbatterier/eway",
   "moduleKwh": 9.22,
   "variants": [
    {
     "capacityKwh": 18.44,
     "totalPrice": 120322,
     "usableCapacityKwh": 17.52,
     "kolumnI": 45161,
     "tillagg": 15000
    },
    {
     "capacityKwh": 27.66,
     "totalPrice": 134884,
     "usableCapacityKwh": 26.28,
     "kolumnI": 52442,
     "tillagg": 15000
    },
    {
     "capacityKwh": 36.88,
     "totalPrice": 151946,
     "usableCapacityKwh": 35.04,
     "kolumnI": 60973,
     "tillagg": 15000
    },
    {
     "capacityKwh": 46.1,
     "totalPrice": 166506,
     "usableCapacityKwh": 43.8,
     "kolumnI": 68253,
     "tillagg": 15000
    },
    {
     "capacityKwh": 55.32,
     "totalPrice": 182318,
     "usableCapacityKwh": 52.55,
     "kolumnI": 76159,
     "tillagg": 15000
    },
    {
     "capacityKwh": 64.54,
     "totalPrice": 196878,
     "usableCapacityKwh": 61.31,
     "kolumnI": 83439,
     "tillagg": 15000
    }
   ]
  },
  {
   "id": "saj-hs3",
   "inverterKw": 12,
   "powerKwPerKwh": 0.71,
   "name": "SAJ HS3",
   "defaultKwh": 20,
   "tier": "Premium",
   "image": "img/batteri-saj.webp",
   "pitch": "Premiumsystem som byggs ut steg för steg när behovet växer.",
   "available": true,
   "roundTripEfficiencyPct": 93,
   "depthOfDischargePct": 90,
   "supportsStodtjanster": true,
   "chemistry": "LiFePO4",
   "slug": "/solcellsbatterier/saj-hs3",
   "variants": [
    {
     "capacityKwh": 5,
     "totalPrice": 100000,
     "usableCapacityKwh": 4.5,
     "kolumnI": 40000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 10,
     "totalPrice": 110000,
     "usableCapacityKwh": 9.0,
     "kolumnI": 45000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 15,
     "totalPrice": 124000,
     "usableCapacityKwh": 13.5,
     "kolumnI": 52000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 20,
     "totalPrice": 158000,
     "usableCapacityKwh": 18.0,
     "kolumnI": 69000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 25,
     "totalPrice": 186000,
     "usableCapacityKwh": 22.5,
     "kolumnI": 83000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 30,
     "totalPrice": 204000,
     "usableCapacityKwh": 27.0,
     "kolumnI": 92000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 35,
     "totalPrice": 230000,
     "usableCapacityKwh": 31.5,
     "kolumnI": 105000,
     "tillagg": 10000
    },
    {
     "capacityKwh": 40,
     "totalPrice": 244000,
     "usableCapacityKwh": 36.0,
     "kolumnI": 112000,
     "tillagg": 10000
    }
   ]
  }
 ],
 "REGIONS": {
  "SE1": {
   "label": "SE1 – Norra Sverige",
   "spotVariationFactor": 0.45,
   "note": ""
  },
  "SE2": {
   "label": "SE2 – Norra Mellansverige",
   "spotVariationFactor": 0.5,
   "note": ""
  },
  "SE3": {
   "label": "SE3 – Södra Mellansverige",
   "spotVariationFactor": 1,
   "note": ""
  },
  "SE4": {
   "label": "SE4 – Södra Sverige",
   "spotVariationFactor": 1.7,
   "note": ""
  }
 },
 "RATES": {
  "stodtjansterPerKwYear": 500,
  "spotArbitragePerKwhYear": 160,
  "effekttoppPerKwhYear": 200,
  "egenanvandningPerKwhYear": 370,
  "egenConsumptionElasticity": 0.6,
  "egenSolarElasticity": 0.6,
  "spotConsumptionElasticity": 0.3,
  "gronTeknikRate": 0.5,
  "gronTeknikCapPerApplicant": 50000,
  "maxApplicants": 2,
  "uncertaintyBand": 0.12
 },
 "ADVANCED_DEFAULTS": {
  "annualConsumptionKwh": 20000,
  "consumptionMin": 5000,
  "consumptionMax": 40000,
  "solarProductionKwh": 12000,
  "solarProductionMin": 2000,
  "solarProductionMax": 20000,
  "solarProductionStep": 500,
  "hasEffekttariffDefault": false
 },
 "defaultRegion": "SE3"
};
;
(function (root) {
  'use strict';
  function findBattery(data, id) {
    return data.BATTERIES.find(function (b) { return b.id === id; }) || null;
  }
  function findVariant(battery, capacityKwh) {
    if (!battery) return null;
    return battery.variants.find(function (v) { return v.capacityKwh === capacityKwh; }) || null;
  }
  function calculate(inputs, data) {
    var R = data.RATES;
    var A = data.ADVANCED_DEFAULTS;
    var battery = findBattery(data, inputs.batteryId);
    var variant = findVariant(battery, inputs.capacityKwh);
    if (!battery || !battery.available || !variant) return { unavailable: true, battery: battery };
    var totalCost = variant.totalPrice;
    var gronTeknik = inputs.hasSolar
      ? Math.min(totalCost * R.gronTeknikRate, R.gronTeknikCapPerApplicant * inputs.applicants)
      : 0;
    var netToPay = totalCost - gronTeknik;
    var region = data.REGIONS[inputs.region];
    var usable = variant.usableCapacityKwh;
    var effective = usable * (battery.roundTripEfficiencyPct / 100);
    var consumption = inputs.consumptionKwh != null ? inputs.consumptionKwh : A.annualConsumptionKwh;
    var production = inputs.solarProductionKwh != null ? inputs.solarProductionKwh : A.solarProductionKwh;
    var useF = consumption / A.annualConsumptionKwh, solF = production / A.solarProductionKwh;
    var bidKw = battery.powerKwPerKwh ? variant.capacityKwh * battery.powerKwPerKwh : usable * 0.5;
    var stodPerYear = battery.supportsStodtjanster ? bidKw * R.stodtjansterPerKwYear : 0;
    var streams = {
      spotArbitrage: effective * R.spotArbitragePerKwhYear * region.spotVariationFactor * Math.pow(useF, R.spotConsumptionElasticity),
      okadEgenanvandning: inputs.hasSolar ? effective * R.egenanvandningPerKwhYear * Math.pow(useF, R.egenConsumptionElasticity) * Math.pow(solF, R.egenSolarElasticity) : 0,
      effekttoppskapning: inputs.hasEffekttariff ? effective * R.effekttoppPerKwhYear : 0,
      stodtjanster: inputs.stodtjanster ? stodPerYear : 0
    };
    var stodPotential = stodPerYear;
    function scenario(annual) {
      var cumulative = [];
      for (var y = 0; y <= 15; y++) cumulative.push(annual * y - netToPay);
      return {
        annual: annual,
        low: annual * (1 - R.uncertaintyBand),
        high: annual * (1 + R.uncertaintyBand),
        paybackYears: annual > 0 ? netToPay / annual : null,
        cumulative: cumulative,
        net15: cumulative[15]
      };
    }
    var baseAnnual = streams.spotArbitrage + streams.okadEgenanvandning + streams.effekttoppskapning;
    return {
      unavailable: false,
      battery: battery,
      variant: variant,
      totalCost: totalCost,
      gronTeknik: gronTeknik,
      netToPay: netToPay,
      usableKwh: usable,
      effectiveKwh: effective,
      stodBidKw: battery.supportsStodtjanster ? bidKw : 0,
      streams: streams,
      stodtjansterPotential: stodPotential,   
      supportsStodtjanster: battery.supportsStodtjanster,
      base: scenario(baseAnnual),                       
      withUpside: scenario(baseAnnual + streams.stodtjanster) 
    };
  }
  var NBSP = ' ';
  function kr(v) {
    if (v == null || !isFinite(v)) return '—';
    var n = Math.round(v), neg = n < 0;
    var s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
    return (neg ? '−' : '') + s;
  }
  function years(v) {
    if (v == null || !isFinite(v)) return '—';
    return (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
  }
  function kwh(v) {
    return (Math.round(v * 100) / 100).toString().replace('.', ',');
  }
  root.AmpyBatteryEngine = {
    calculate: calculate,
    findBattery: findBattery,
    format: { kr: kr, years: years, kwh: kwh },
    DEFAULT_INPUTS: {
      batteryId: 'eway',        
      capacityKwh: 27.66,
      region: 'SE3',
      hasSolar: true,
      applicants: 2,
      consumptionKwh: 20000,
      solarProductionKwh: 12000,
      hasEffekttariff: false,
      stodtjanster: true        
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).AmpyBatteryEngine;
;
(function () {
  'use strict';
  var E = window.AmpyBatteryEngine, D = window.AMPY_BATTERY_DATA;
  var root = document.getElementById('ampyBc');
  if (!E || !D || !root) return;
  var F = E.format, NBSP = ' ';
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var def = E.findBattery(D, root.dataset.battery) || D.BATTERIES[0];
  var wantKwh = parseFloat(String(root.dataset.kwh || '').replace(',', '.'));
  var defVar = def.variants.find(function (v) { return v.capacityKwh === wantKwh; }) || def.variants[Math.min(1, def.variants.length - 1)];
  var S = { batteryId: def.id, capacityKwh: defVar.capacityKwh, region: D.defaultRegion || 'SE3', hasSolar: true, stod: true,   
    applicants: 2, consumption: D.ADVANCED_DEFAULTS.annualConsumptionKwh, solar: D.ADVANCED_DEFAULTS.solarProductionKwh, effekt: !!D.ADVANCED_DEFAULTS.hasEffekttariffDefault,
    advOpen: false };
  var REGION_NAMES = { SE1: 'Norra Sverige', SE2: 'Norra Mellansverige', SE3: 'Södra Mellansverige', SE4: 'Södra Sverige' };
  function battery() { return E.findBattery(D, S.batteryId); }
  function inputs() {
    return { batteryId: S.batteryId, capacityKwh: S.capacityKwh, region: S.region, hasSolar: S.hasSolar, applicants: S.applicants,
      consumptionKwh: S.consumption, solarProductionKwh: S.solar, hasEffekttariff: S.effekt, stodtjanster: S.stod };
  }
  var IMG_BASE = root.dataset.imgBase || '';
  function thumb(b) { return b.image ? '<img src="' + esc(IMG_BASE + b.image) + '" alt="" loading="lazy" decoding="async">' : ''; }
  var shown = {}, T = {}, RA = {};
  function setK(key, value, fmt) {
    var els = root.querySelectorAll('[data-k="' + key + '"]');
    var from = shown[key]; shown[key] = value;
    var write = function (v) { for (var i = 0; i < els.length; i++) els[i].textContent = fmt(v); };
    clearTimeout(T[key]); cancelAnimationFrame(RA[key]);
    if (reduce || from == null || !isFinite(from) || value == null || !isFinite(value) || from === value) { write(value); return; }
    var t0 = null, dur = 280;
    var step = function (t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur); write(from + (value - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) RA[key] = requestAnimationFrame(step); };
    RA[key] = requestAnimationFrame(step);
    T[key] = setTimeout(function () { cancelAnimationFrame(RA[key]); write(value); }, dur + 80);
  }
  var closers = [];
  function closeAll() { closers.forEach(function (c) { c(false); }); }
  document.addEventListener('click', function (e) { if (!root.contains(e.target) || !e.target.closest('.bc-select')) closeAll(); });
  function makeSelect(btn, list, options, getValue, onPick) {
    function render() {
      var cur = String(getValue());
      list.innerHTML = '';
      options().forEach(function (o, i) {
        var li = document.createElement('li');
        li.className = 'bc-opt' + (o.img == null ? ' bc-opt--plain' : '');
        li.setAttribute('role', 'option'); li.id = list.id + '-' + i; li.dataset.v = String(o.value);
        li.setAttribute('aria-selected', String(String(o.value) === cur));
        li.innerHTML = (o.img != null ? '<span class="bc-thumb">' + o.img + '</span>' : '') +
          '<span class="bc-opt-txt"><span class="bc-opt-name">' + esc(o.label) + '</span>' +
          (o.badge ? '<span class="bc-tier">' + esc(o.badge) + '</span>' : '') +
          (o.sub ? '<span class="bc-opt-sub">' + esc(o.sub) + '</span>' : '') + '</span>';
        li.addEventListener('click', function () { pick(o.value); });
        list.appendChild(li);
      });
    }
    function items() { return Array.prototype.slice.call(list.querySelectorAll('.bc-opt')); }
    function setActive(i) {
      var it = items(); it.forEach(function (x) { x.classList.remove('is-active'); });
      if (!it[i]) return; it[i].classList.add('is-active'); list.setAttribute('aria-activedescendant', it[i].id); it[i].scrollIntoView({ block: 'nearest' });
    }
    function open() {
      closeAll(); render(); list.hidden = false; btn.setAttribute('aria-expanded', 'true');
      var i = items().findIndex(function (x) { return x.getAttribute('aria-selected') === 'true'; });
      setActive(Math.max(0, i)); list.focus({ preventScroll: true });
    }
    function close(focusBtn) { if (list.hidden) return; list.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focusBtn) btn.focus(); }
    function pick(v) { onPick(v); close(true); }
    btn.addEventListener('click', function () { list.hidden ? open() : close(false); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
    list.addEventListener('keydown', function (e) {
      var it = items(), i = it.findIndex(function (x) { return x.classList.contains('is-active'); });
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(it.length - 1, i + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(0, i - 1)); }
      else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
      else if (e.key === 'End') { e.preventDefault(); setActive(it.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (it[i]) pick(it[i].dataset.v); }
      else if (e.key === 'Escape' || e.key === 'Tab') { close(e.key === 'Escape'); }
    });
    closers.push(close);
  }
  makeSelect($('bcBatBtn'), $('bcBatList'), function () {
    return D.BATTERIES.filter(function (b) { return b.available; }).map(function (b) {
      return { value: b.id, label: b.name, badge: b.tier, sub: b.pitch, img: thumb(b) };
    });
  }, function () { return S.batteryId; }, function (v) {
    var b = E.findBattery(D, v); if (!b) return;
    if (v === S.batteryId) return;
    S.batteryId = v;
    var dv = b.variants.find(function (x) { return x.capacityKwh === b.defaultKwh; }) || b.variants[Math.floor(b.variants.length / 2)];
    S.capacityKwh = dv.capacityKwh;
    if (!b.supportsStodtjanster) S.stod = false;
    syncCap(); render();
  });
  makeSelect($('bcRegBtn'), $('bcRegList'), function () {
    return ['SE1', 'SE2', 'SE3', 'SE4'].map(function (k) { return { value: k, label: k, sub: REGION_NAMES[k] }; });
  }, function () { return S.region; }, function (v) { S.region = v; render(); });
  function paint(r) { var span = r.max - r.min; r.style.setProperty('--f', span > 0 ? (r.value - r.min) / span : 0); }
  function bindTouch(r) {
    var id = null, x0 = 0, y0 = 0, dragging = false, THUMB = 26;
    function setFromX(x) {
      if (r.disabled) return;
      var rect = r.getBoundingClientRect(), min = +r.min, max = +r.max, step = +r.step || 1;
      var f = (x - rect.left - THUMB / 2) / Math.max(1, rect.width - THUMB);
      f = Math.max(0, Math.min(1, f));
      var v = Math.min(max, min + Math.round(f * (max - min) / step) * step);
      if (String(v) !== r.value) { r.value = String(v); r.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    function end() { id = null; dragging = false; r.classList.remove('is-drag'); }
    r.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || r.disabled) return;
      id = e.pointerId; x0 = e.clientX; y0 = e.clientY; dragging = false;
    });
    r.addEventListener('pointermove', function (e) {
      if (e.pointerId !== id) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (!dragging) {
        if (Math.abs(dx) < 4 || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true; r.classList.add('is-drag');
        try { r.setPointerCapture(id); } catch (err) {}
      }
      e.preventDefault(); setFromX(e.clientX);
    });
    r.addEventListener('pointerup', function (e) {
      if (e.pointerId !== id) return;
      if (!dragging && Math.abs(e.clientX - x0) < 8 && Math.abs(e.clientY - y0) < 8) setFromX(e.clientX);
      end();
    });
    r.addEventListener('pointercancel', end);
  }
  var cap = $('bcCap'), cons = $('bcSol'), use = $('bcCons');
  bindTouch(cap); bindTouch(cons); bindTouch(use);
  use.addEventListener('input', function () { S.consumption = parseInt(use.value, 10); paint(use); render(); });
  function syncCap() {
    var b = battery(), vs = b.variants;
    cap.max = String(vs.length - 1);
    cap.value = String(Math.max(0, vs.findIndex(function (v) { return v.capacityKwh === S.capacityKwh; })));
    $('bcCapMin').textContent = F.kwh(vs[0].capacityKwh) + ' kWh';
    $('bcCapMax').textContent = F.kwh(vs[vs.length - 1].capacityKwh) + ' kWh';
    paint(cap);
  }
  cap.addEventListener('input', function () { S.capacityKwh = battery().variants[parseInt(cap.value, 10)].capacityKwh; paint(cap); render(); });
  cons.addEventListener('input', function () { S.solar = parseInt(cons.value, 10); paint(cons); render(); });
  root.querySelectorAll('[data-seg]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      S[g.dataset.seg] = g.dataset.seg === 'applicants' ? parseInt(b.dataset.v, 10) : b.dataset.v === 'true';
      render();
    });
  });
  function syncSegs() {
    root.querySelectorAll('[data-seg]').forEach(function (g) {
      var cur = String(S[g.dataset.seg]);
      g.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === cur)); });
    });
    var ok = battery().supportsStodtjanster;
    root.querySelectorAll('[data-seg="stod"] button').forEach(function (b) { b.disabled = !ok; });
    root.querySelectorAll('[data-seg="applicants"] button').forEach(function (b) { b.disabled = !S.hasSolar; });   
    $('bcStodHint').textContent = ok ? (S.stod ? 'Ingår nu i talen. Ersättningen betalas ut av aggregatorn och varierar.' : 'Extra intäkt via en aggregator. Välj Ja för att räkna in den.') : 'Den här modellen kan inte delta i stödtjänster.';
  }
  $('bcAdvBtn').addEventListener('click', function () {
    S.advOpen = !S.advOpen; $('bcAdv').hidden = !S.advOpen; this.setAttribute('aria-expanded', String(S.advOpen));
  });
  var liveT = null;
  function within15(y) { return (y == null || y > 15) ? null : y; }
  function togglePlus(id, on, text) { var el = $(id); el.hidden = !on; if (on) el.textContent = text; }
  function render() {
    var R = E.calculate(inputs(), D);
    if (R.unavailable) return;
    var b = R.battery, v = R.variant, base = R.base, up = R.withUpside, s = R.streams;
    var stodOn = S.stod && R.supportsStodtjanster;
    syncSegs();
    $('bcBatVal').textContent = b.name;
    $('bcBatTier').textContent = b.tier || '';
    $('bcBatImg').innerHTML = thumb(b);
    $('bcBatBtn').setAttribute('aria-label', 'Batteri: ' + b.name + '. Byt batteri');
    $('bcCapVal').textContent = F.kwh(v.capacityKwh);
    cap.setAttribute('aria-valuetext', F.kwh(v.capacityKwh) + ' kilowattimmar');
    $('bcRegVal').textContent = S.region;
    $('bcConsVal').textContent = F.kr(S.consumption);
    use.setAttribute('aria-valuetext', F.kr(S.consumption) + ' kilowattimmar per år');
    $('bcSolVal').textContent = F.kr(S.solar);
    cons.setAttribute('aria-valuetext', F.kr(S.solar) + ' kilowattimmar per år');
    cons.disabled = !S.hasSolar;
    $('bcSolHint').textContent = !S.hasSolar ? 'Gäller bara om du har solpaneler.'
      : 'Finns i växelriktarens app. Förvalt är 12 000 kWh, ungefär en anläggning på 12 kWp.';
    var H = stodOn ? up : base;   
    setK('annual', H.annual, F.kr);
    $('sAnnual').textContent = 'Spann ' + F.kr(H.low) + '–' + F.kr(H.high) + ' kr per år';
    togglePlus('pAnnual', stodOn, 'Varav stödtjänster ' + F.kr(s.stodtjanster) + ' kr');
    setK('net', R.netToPay, F.kr);
    $('sPay').textContent = R.gronTeknik > 0
      ? 'Pris ' + F.kr(R.totalCost) + ' kr minus grön teknik ' + F.kr(R.gronTeknik) + ' kr'
      : 'Pris ' + F.kr(R.totalCost) + ' kr, grön teknik gäller inte';
    var pb = within15(H.paybackYears), vb = $('vBack'), basePb = within15(base.paybackYears);
    if (pb == null) {
      vb.textContent = 'Över 15 år'; shown.payback = null;
      $('sBack').textContent = 'Batteriet hinner inte betala sig inom kalkylens 15 år';
    } else {
      if (!vb.querySelector('[data-k]')) vb.innerHTML = '<span data-k="payback"></span> år';
      setK('payback', pb, F.years);
      $('sBack').textContent = stodOn ? 'Med stödtjänster' : 'Räknat utan stödtjänster';
    }
    $('tBack').classList.toggle('is-muted', pb == null);
    togglePlus('pBack', stodOn, 'Utan stödtjänster ' + (basePb == null ? 'över 15 år' : F.years(basePb) + ' år'));
    setK('net15', Math.abs(H.net15), F.kr);   
    $('sNet').textContent = H.net15 >= 0
      ? (R.gronTeknik > 0 ? 'Ren vinst när batteriet är betalt, grön teknik inräknad' : 'Ren vinst när batteriet är betalt')
      : 'Kvar att tjäna in efter 15 år';
    togglePlus('pNet', stodOn, 'Utan stödtjänster ' + F.kr(base.net15) + ' kr');
    $('bcNoSolar').hidden = S.hasSolar;
    clearTimeout(liveT);
    liveT = setTimeout(function () { $('bcLive').textContent = 'Årlig besparing ' + F.kr(H.annual) + ' kronor, återbetald efter ' + (pb == null ? 'mer än 15 år' : F.years(pb) + ' år') + '.'; }, 700);
    var items = [
      { n: 'Spotpris', v: s.spotArbitrage, r: 'Laddar billigt, använder dyrt' },
      { n: 'Egen solel', v: s.okadEgenanvandning, r: S.hasSolar ? 'Sparad solel till kvällen' : 'Kräver solpaneler' },
      { n: 'Effektavgift', v: s.effekttoppskapning, r: S.effekt ? 'Kapar effekttoppar' : 'Ingen effekttariff' },
      { n: 'Stödtjänster', v: stodOn ? s.stodtjanster : R.stodtjansterPotential, extra: true,
        r: !R.supportsStodtjanster ? 'Stöds inte av modellen' : (stodOn ? 'Ingår i talen ovan' : 'Möjlig extra, inte inräknad') }
    ];
    $('bcMix').innerHTML = items.map(function (it) {
      var zero = it.v <= 0, cls = 'bc-mix-item' + (zero ? ' is-zero' : '') + (it.extra && !zero ? ' is-extra' : '');
      return '<div class="' + cls + '"><div class="bc-mix-n">' + it.n + '</div><div class="bc-mix-v num">' + (it.extra && !zero ? '+ ' : '') + F.kr(it.v) + NBSP + 'kr</div><div class="bc-mix-r">' + it.r + '</div></div>';
    }).join('');
  }
  (function () {
    var Rt = D.RATES, A = D.ADVANCED_DEFAULTS;
    var dec = function (x) { return String(x).replace('.', ','); };
    var areas = ['SE1', 'SE2', 'SE3', 'SE4'].map(function (k) { return k + ' ' + dec(D.REGIONS[k].spotVariationFactor); }).join(', ');
    var list = [
      ['Spotpris', 'effektiv kapacitet × ' + Rt.spotArbitragePerKwhYear + ' kr/kWh/år × elområdets faktor (' + areas + ') × förbrukningsfaktor', 'Batteriet laddas när elen är billig och används när den är dyr. Ju mer el huset använder, desto mer av den dyra elen kan batteriet ersätta. Förbrukningsfaktorn är 1 vid ' + F.kr(A.annualConsumptionKwh) + ' kWh. Skillnaden är störst i SE4 och minst i SE1.'],
      ['Egen solel', 'effektiv kapacitet × ' + Rt.egenanvandningPerKwhYear + ' kr/kWh/år × förbrukningsfaktor × solfaktor', 'Kräver solpaneler. Solel som annars hade sålts billigt sparas och används på kvällen. Faktorerna är 1 vid ' + F.kr(A.annualConsumptionKwh) + ' kWh förbrukning och ' + F.kr(A.solarProductionKwh) + ' kWh solproduktion, och växer eller minskar mjukt när du ändrar dem.'],
      ['Effektavgift', 'effektiv kapacitet × ' + Rt.effekttoppPerKwhYear + ' kr/kWh/år, bara med effekttariff', 'Flera elnätsbolag har tagit bort effekttariffen under 2026. Välj Ja bara om din nätfaktura har den. I verkligheten begränsas värdet av hur mycket du kan sänka din effekttopp.'],
      ['Stödtjänster', 'batteriets effekt (kW) × ' + Rt.stodtjansterPerKwYear + ' kr/kW/år, efter aggregatorns avgift', 'Svenska kraftnät betalar, via en aggregator, för hur mycket effekt batteriet kan hålla redo. Effekten växer med antalet batterimoduler, så ett större batteri tjänar mer. Siffran bygger på Svenska kraftnäts priser det senaste året och varierar mellan åren. Väljer du Ja ingår den i talen, och talen utan står bredvid.'],
      ['Kapacitet', 'användbar = märkkapacitet × urladdningsdjup, effektiv = användbar × verkningsgrad', 'Ett batteri levererar mindre än märkkapaciteten. Vi räknar på den energi som faktiskt går att använda.'],
      ['Grön teknik', Math.round(Rt.gronTeknikRate * 100) + ' % av priset, högst ' + F.kr(Rt.gronTeknikCapPerApplicant) + ' kr per person och år', 'Samma beräkning som i offerten. Kräver att batteriet kopplas till en egen solanläggning. Taket delas med andra avdrag för grön teknik samma år.'],
      ['Återbetald efter', 'att betala ÷ årlig besparing', 'Hinner batteriet inte betala sig inom kalkylens 15 år står det Över 15 år.'],
      ['Osäkerhet', '± ' + Math.round(Rt.uncertaintyBand * 100) + ' % på årlig besparing', 'Elpriser varierar, så vi visar ett spann för den årliga besparingen. Återbetalning och 15 år visas som mittvärde.'],
      ['15 år', 'årlig besparing × 15 − att betala', 'Samma besparing varje år: ingen förändring av elpriset, ingen minskad kapacitet, ingen ränta och ingen service.'],
      ['Om kalkylen', 'Ampys antaganden och dina uppgifter', 'Kalkylen är en uppskattning och inte ett erbjudande, en garanti eller ekonomisk rådgivning.']
    ];
    $('bcMethod').innerHTML = list.map(function (x) { return '<div class="bc-mitem"><h3>' + x[0] + '</h3><code>' + x[1] + '</code><p>' + x[2] + '</p></div>'; }).join('');
  })();
  paint(cons); paint(use); syncCap(); render();
  function setBattery(id, kwh) {
    var b = E.findBattery(D, id); if (!b || !b.available) return null;
    var k = parseFloat(kwh), v = b.variants.reduce(function (best, x) {
      return (best == null || Math.abs(x.capacityKwh - k) < Math.abs(best.capacityKwh - k)) ? x : best; }, null);
    S.batteryId = b.id; S.capacityKwh = (isFinite(k) && v) ? v.capacityKwh : S.capacityKwh;
    if (!b.supportsStodtjanster) S.stod = false;
    syncCap(); render();
    return S.capacityKwh;
  }
  window.AmpyBatteriKalkyl = { setBattery: setBattery, version: 'offert-1' };
})();
;
