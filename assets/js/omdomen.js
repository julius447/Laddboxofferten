/*!
 * Omdömena i citatkortet. Ersätter Splide, som var 34 kB och levererade ett
 * omdöme av fem bakom en svepning ingen gör sist på sidan.
 *
 * Två lägen, växlas i granskningsramen:
 *   användarstyrt  inget rör sig av sig självt. Kortets höjd följer texten.
 *   byter själv    korsnedtoning var sjunde sekund MED paus-kontroll, enligt
 *                  WCAG 2.2.2: innehåll som uppdateras automatiskt i mer än
 *                  fem sekunder måste gå att pausa. prefers-reduced-motion
 *                  stänger av bytet helt.
 */
(function () {
  'use strict';
  var rot = document.querySelector('.o-cit');
  var nav = document.querySelector('.o-cit__nav');
  if (!rot || !nav) return;
  var items = [].slice.call(rot.querySelectorAll('.o-cit__item'));
  var prickar = [].slice.call(nav.querySelectorAll('.o-cit__prick'));
  if (items.length < 2) { nav.style.display = 'none'; return; }

  var i = 0, timer = null, pausad = false;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var offer = document.getElementById('offer') || document.querySelector('.offer');

  function visa(n) {
    i = (n + items.length) % items.length;
    items.forEach(function (e, k) { e.classList.toggle('pa', k === i); });
    prickar.forEach(function (e, k) {
      e.classList.toggle('pa', k === i);
      e.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
  }

  function auto() { return offer && offer.classList.contains('c-auto'); }

  function starta() {
    stoppa();
    if (!auto() || pausad || mqReduce.matches) return;
    timer = setInterval(function () { visa(i + 1); }, 7000);
  }
  function stoppa() { if (timer) { clearInterval(timer); timer = null; } }

  nav.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    visa(+b.getAttribute('data-i'));
    starta();                     // räkna om från den kund valde
  });

  var paus = document.querySelector('.o-cit__paus');
  if (paus) paus.addEventListener('click', function () {
    pausad = !pausad;
    paus.setAttribute('aria-pressed', pausad ? 'true' : 'false');
    paus.textContent = pausad ? 'Starta' : 'Pausa';
    if (pausad) stoppa(); else starta();
  });

  /* Hover och fokus pausar, samma krav som ett karusellblock har. */
  rot.addEventListener('pointerenter', stoppa);
  rot.addEventListener('pointerleave', starta);
  rot.addEventListener('focusin', stoppa);
  rot.addEventListener('focusout', starta);
  mqReduce.addEventListener('change', starta);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stoppa(); else starta();
  });

  window.ampyOmdomen = { starta: starta, stoppa: stoppa };
  visa(0); starta();
})();
