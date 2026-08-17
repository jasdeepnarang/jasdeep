(function(){
"use strict";
window.__motionOK = true; /* tells the <head> safety-net timeout this script ran */
var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Hero / above-the-fold entrance ---- */
requestAnimationFrame(function(){
  requestAnimationFrame(function(){ document.body.classList.add('ready'); });
});

/* ---- Scroll reveal ---- */
var revealEls = document.querySelectorAll('.reveal');
if(reduced || !('IntersectionObserver' in window)){
  revealEls.forEach(function(el){ el.classList.add('in'); });
} else {
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -60px 0px'});
  revealEls.forEach(function(el){ io.observe(el); });
}

/* ---- Count-up numbers: <span data-target="8" data-prefix="₹" data-suffix="Cr+">0</span> ---- */
function easeOutExpo(t){ return t===1 ? 1 : 1-Math.pow(2,-10*t); }
function fmtNum(val,decimals,grouped){
  if(decimals>0) return val.toFixed(decimals);
  var r = Math.round(val);
  return grouped ? r.toLocaleString('en-US') : String(r);
}
function animateCount(el){
  var raw = el.getAttribute('data-target');
  var target = parseFloat(raw);
  if(isNaN(target)) return;
  var decimals = (raw.split('.')[1]||'').length;
  var prefix = el.getAttribute('data-prefix')||'';
  var suffix = el.getAttribute('data-suffix')||'';
  var grouped = el.hasAttribute('data-group');
  var dur = 1300, start = null;
  function step(ts){
    if(!start) start = ts;
    var p = Math.min((ts-start)/dur,1);
    var val = target*easeOutExpo(p);
    el.textContent = prefix+fmtNum(val,decimals,grouped)+suffix;
    if(p<1) requestAnimationFrame(step);
    else el.textContent = prefix+fmtNum(target,decimals,grouped)+suffix;
  }
  requestAnimationFrame(step);
}
var counters = document.querySelectorAll('[data-target]');
if(reduced || !('IntersectionObserver' in window)){
  counters.forEach(function(el){
    var raw = el.getAttribute('data-target'), t = parseFloat(raw);
    if(isNaN(t)) return;
    var d = (raw.split('.')[1]||'').length;
    el.textContent = (el.getAttribute('data-prefix')||'')+fmtNum(t,d,el.hasAttribute('data-group'))+(el.getAttribute('data-suffix')||'');
  });
} else {
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ animateCount(entry.target); cio.unobserve(entry.target); }
    });
  }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
  counters.forEach(function(el){ cio.observe(el); });
}

/* ---- Animated allocation bar fills: <div class="bar-fill" data-width="66%"> ---- */
var bars = document.querySelectorAll('.bar-fill[data-width]');
if(reduced || !('IntersectionObserver' in window)){
  bars.forEach(function(el){ el.style.width = el.getAttribute('data-width'); });
} else {
  var bio = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.style.width = entry.target.getAttribute('data-width'); bio.unobserve(entry.target); }
    });
  }, {threshold:.3});
  bars.forEach(function(el){ bio.observe(el); });
}

/* ---- Sticky nav gains a shadow once the page scrolls ---- */
var nav = document.querySelector('.nav');
if(nav){
  var onScroll = function(){
    if(window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}
})();
