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

/* Menu de seções — painel hambúrguer no mobile + destaque da seção ativa.
   Sem JS o <nav> continua sendo uma lista de âncoras funcional (só o painel
   recolhível deixa de existir), então isso é progressive enhancement. */
(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  var scrim = document.getElementById("navScrim");
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll(".site-nav__link"));

  /* ---- Abrir/fechar o painel mobile ------------------------------------ */
  function setOpen(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (scrim) {
      if (open) {
        scrim.hidden = false;
        // Força um reflow para a transição de opacidade valer no primeiro frame.
        void scrim.offsetWidth;
        scrim.classList.add("is-open");
      } else {
        scrim.classList.remove("is-open");
        scrim.hidden = true;
      }
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
  }
  if (scrim) scrim.addEventListener("click", function () { setOpen(false); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      if (toggle) toggle.focus();
    }
  });

  // Ao voltar para largura de desktop o painel não pode ficar "preso" aberto.
  var desktop = window.matchMedia("(min-width: 901px)");
  function onBreakpoint(e) { if (e.matches) setOpen(false); }
  if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
  else if (desktop.addListener) desktop.addListener(onBreakpoint);

  /* ---- Alvos do menu ---------------------------------------------------- */
  var byId = {};
  var targets = [];
  links.forEach(function (link) {
    var id = (link.getAttribute("href") || "").slice(1);
    var section = id && document.getElementById(id);
    if (!section) return;
    byId[id] = link;
    targets.push(section);
  });

  function headerOffset() {
    var header = document.getElementById("siteHeader");
    return (header ? header.getBoundingClientRect().height : 76) + 12;
  }

  /* ---- Rolagem até a seção --------------------------------------------- */
  /* Fazemos a rolagem na mão em vez de deixar só com o href: durante um scroll
     suave longo a página ainda cresce (imagens lazy, reveals), e o destino
     calculado no início do movimento fica defasado em algumas centenas de px.
     Depois que o scroll para, recalculamos e corrigimos a diferença. */
  var reduceMotionNav = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToSection(section, behavior) {
    var top = window.scrollY + section.getBoundingClientRect().top - headerOffset();
    var max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.max(0, Math.min(top, max)), behavior: behavior });
  }

  function goToSection(section) {
    var behavior = reduceMotionNav ? "auto" : "smooth";
    scrollToSection(section, behavior);
    if (behavior === "auto") return;

    // Espera o scroll assentar e corrige o desvio, no máximo 3 vezes.
    // O período de carência importa: sem ele, os primeiros frames (em que a
    // animação ainda não saiu do lugar) seriam lidos como "já parou" e a
    // correção reiniciaria a rolagem em loop, travando na posição inicial.
    var GRACE = 450;
    var lastY = null;
    var still = 0;
    var tries = 0;
    var startedAt = Date.now();

    var timer = setInterval(function () {
      var y = Math.round(window.scrollY);
      still = (y === lastY) ? still + 1 : 0;
      lastY = y;
      if (Date.now() - startedAt < GRACE || still < 3) return;

      var drift = section.getBoundingClientRect().top - headerOffset();
      if (Math.abs(drift) > 4 && tries < 3) {
        tries++;
        still = 0;
        startedAt = Date.now();
        scrollToSection(section, "smooth");
        return;
      }
      clearInterval(timer);
    }, 90);
    setTimeout(function () { clearInterval(timer); }, 6000);
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      setOpen(false);
      var section = document.getElementById((link.getAttribute("href") || "").slice(1));
      if (!section) return;
      e.preventDefault();
      goToSection(section);
      // Mantém a URL compartilhável sem provocar um segundo salto.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", link.getAttribute("href"));
      }
    });
  });

  /* ---- Seção ativa ------------------------------------------------------ */
  /* Baseado na posição, não em interseção: a página tem seções fora do menu
     (ex.: "Start With One Session"), e uma faixa de observação deixaria o menu
     sem nenhum item aceso ao passar por elas. */
  if (!targets.length) return;

  var ticking = false;

  function refreshActive() {
    ticking = false;
    var line = headerOffset() + 24;
    var current = null;

    targets.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) current = section;
    });

    // No fim da página a última seção é sempre a ativa, mesmo se for curta.
    var atBottom = window.scrollY + window.innerHeight >=
                   document.documentElement.scrollHeight - 2;
    if (atBottom) current = targets[targets.length - 1];

    links.forEach(function (link) {
      link.classList.toggle("is-active", !!current && byId[current.id] === link);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(refreshActive);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  refreshActive();
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

/* Carrossel de depoimentos — 1 slide visível por vez.
   Navegação: setas (clique), pontos (clique) ou arrasto/swipe (mouse e toque,
   via Pointer Events). Sem loop: nas pontas as setas ficam desabilitadas.
   Progressive enhancement: sem JS os slides continuam empilhados e legíveis
   (ver .testimonial-carousel__slide no CSS); a classe "js-carousel-ready"
   é quem liga o layout de 1-por-vez e exibe setas/pontos. */
(function () {
  "use strict";

  var roots = Array.prototype.slice.call(document.querySelectorAll("[data-carousel]"));
  if (!roots.length) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  roots.forEach(function (root) {
    var viewport = root.querySelector("[data-carousel-viewport]");
    var track = root.querySelector("[data-carousel-track]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-carousel-dot]"));
    var slides = track ? Array.prototype.slice.call(track.children) : [];

    if (!viewport || !track || slides.length < 2) return;

    root.classList.add("js-carousel-ready");

    var index = 0;
    var dragging = false;
    var pointerId = null;
    var startX = 0;
    var deltaX = 0;
    var viewportWidth = viewport.clientWidth;

    // A altura do viewport acompanha só o slide ativo (não a maior citação
    // do grupo) — sem isso, o flex row estica todo mundo para a altura do
    // maior card e depoimentos curtos ficam com um vazio enorme embaixo.
    function updateHeight() {
      var active = slides[index];
      if (active) viewport.style.height = active.getBoundingClientRect().height + "px";
    }

    function render(withTransition) {
      track.classList.toggle("is-dragging", !withTransition);
      var offset = -index * viewportWidth + (dragging ? deltaX : 0);
      track.style.transform = "translate3d(" + offset + "px, 0, 0)";
      updateHeight();

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render(true);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    });

    window.addEventListener("resize", function () {
      viewportWidth = viewport.clientWidth;
      render(true);
    });

    // As citações usam a fonte web (Fraunces/Karla); se ela ainda não tinha
    // carregado no render inicial, a altura medida com a fonte de fallback
    // fica errada. Uma medição extra depois do load corrige isso.
    window.addEventListener("load", updateHeight);

    // Arrasto / swipe — Pointer Events cobrem mouse e toque com a mesma lógica.
    function onPointerDown(e) {
      if (dragging) return;
      dragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      deltaX = 0;
      viewportWidth = viewport.clientWidth;
      if (viewport.setPointerCapture) {
        try { viewport.setPointerCapture(pointerId); } catch (err) { /* noop */ }
      }
      render(false);
    }

    function onPointerMove(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      deltaX = e.clientX - startX;
      // Impede arrasto além da primeira/última lâmina (resistência leve).
      if ((index === 0 && deltaX > 0) || (index === slides.length - 1 && deltaX < 0)) {
        deltaX *= 0.35;
      }
      render(false);
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      var threshold = Math.min(80, viewportWidth * 0.18);
      if (deltaX <= -threshold) {
        index = Math.min(slides.length - 1, index + 1);
      } else if (deltaX >= threshold) {
        index = Math.max(0, index - 1);
      }
      deltaX = 0;
      render(true);
    }

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", function () { if (dragging) endDrag(); });

    // Evita que o navegador tente arrastar/selecionar o texto da citação.
    viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });

    if (reduceMotion) {
      track.style.transition = "none";
    }

    render(false);
  });
})();

/* Formulário de contato — envio por fetch para o Web3Forms, sem sair da página.
   Progressive enhancement: se o navegador não tiver fetch, deixamos o submit
   nativo acontecer (o Web3Forms responde com a página de agradecimento dele),
   e a validação dos campos continua sendo a nativa do HTML nos dois caminhos. */
(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  var button = form.querySelector("[data-submit]");
  var buttonLabel = form.querySelector("[data-submit-label]");
  var status = form.querySelector("[data-form-status]");
  var idleLabel = buttonLabel ? buttonLabel.textContent : "Send message";
  var sending = false;

  var GENERIC_ERROR =
    "We couldn’t send your message. Please check your connection and try again.";

  function showStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = "contact-form__status is-" + kind;
    status.hidden = false;
  }

  function setSending(on) {
    sending = on;
    if (button) button.disabled = on;
    if (buttonLabel) buttonLabel.textContent = on ? "Sending…" : idleLabel;
  }

  // Só liga o estilo de campo inválido depois da primeira tentativa de envio.
  form.addEventListener("invalid", function () {
    form.classList.add("is-validated");
  }, true);

  form.addEventListener("submit", function (e) {
    form.classList.add("is-validated");

    if (!window.fetch || !window.FormData) return; // fallback: POST nativo
    e.preventDefault();
    if (sending) return;

    setSending(true);
    if (status) status.hidden = true;

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (response) {
        // Erros do Web3Forms vêm como JSON mesmo com status != 200, mas uma
        // resposta inesperada (HTML de proxy, por ex.) não deve quebrar o .then.
        return response.json().then(
          function (data) { return { ok: response.ok, data: data }; },
          function () { return { ok: false, data: null }; }
        );
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          form.reset();
          form.classList.remove("is-validated");
          showStatus(
            "Your message has been sent! We’ll be in touch shortly.",
            "success"
          );
          return;
        }
        showStatus(
          (result.data && result.data.message) || GENERIC_ERROR,
          "error"
        );
      })
      .catch(function () {
        showStatus(GENERIC_ERROR, "error");
      })
      .then(function () {
        setSending(false);
      });
  });
})();
