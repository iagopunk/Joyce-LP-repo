/* Header com efeito de vidro ao rolar — sólido no topo, translúcido/blur
   após iniciar a rolagem. Sem rAF: em abas em segundo plano o navegador
   pode suspender requestAnimationFrame e deixar o header preso no estado
   errado, então o toggle roda direto no evento (custo desprezível). */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  if (!header) return;

  var THRESHOLD = 8;

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
})();

/* Reveal-on-scroll — progressive enhancement only.
   Accordions use native <details>/<summary>, so no JS is required for them. */
(function () {
  "use strict";

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!reveals.length) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Se o usuário prefere menos movimento, ou o browser não suporta o observer,
  // mostramos tudo imediatamente (sem animação).
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  reveals.forEach(function (el) { observer.observe(el); });
})();
