// Set GITHUB_URL to the GitHub profile address once it is known. Every hidden GitHub link and section appears when it is set.
var GITHUB_URL = 'https://github.com/cbmagazine';
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (GITHUB_URL) {
    [].slice.call(document.querySelectorAll('[data-github]')).forEach(function(el){ el.href = GITHUB_URL; el.hidden = false; });
    [].slice.call(document.querySelectorAll('[data-github-section]')).forEach(function(el){ el.hidden = false; });
  }
  var menu = document.querySelector('.menu-btn');
  if (menu) menu.addEventListener('click', function(){ var open = menu.closest('.rail').classList.toggle('nav-open'); menu.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  var top = document.querySelector('.to-top');
  if (top) top.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
