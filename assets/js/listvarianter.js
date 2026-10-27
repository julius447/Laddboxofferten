/*! Växlar punktlistans tre varianter. Bara granskningsramen laddar den. */
(function () {
  'use strict';
  var grupp = document.querySelector('.switch-lista');
  var offer = document.getElementById('offer');
  if (!grupp || !offer) return;
  var cg = document.querySelector('.switch-cit');
  if (cg) cg.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-c]');
    if (!b) return;
    offer.classList.toggle('c-auto', b.getAttribute('data-c') === 'auto');
    if (window.ampyOmdomen) window.ampyOmdomen.starta();
    cg.querySelectorAll('button').forEach(function (o) {
      o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
    });
  });

  var tg = document.querySelector('.switch-trust');
  if (tg) tg.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-t]');
    if (!b) return;
    var v = b.getAttribute('data-t');
    offer.classList.remove('t-b', 't-c', 't-nu');
    if (v !== 'a') offer.classList.add('t-' + v);
    window.dispatchEvent(new Event('resize'));
    tg.querySelectorAll('button').forEach(function (o) {
      o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
    });
  });

  grupp.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-l]');
    if (!b) return;
    var v = b.getAttribute('data-l');
    offer.classList.remove('lista-2', 'lista-3');
    if (v !== '1') offer.classList.add('lista-' + v);
    grupp.querySelectorAll('button').forEach(function (o) {
      o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
    });
  });
})();
