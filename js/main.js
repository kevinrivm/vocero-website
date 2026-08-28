/* ============================================================
   VOCERO — vocerocrm.com · interacciones
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: sombra al hacer scroll + menú móvil ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById("navBurger");
  var navMobile = document.getElementById("navMobile");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = navMobile.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        burger.classList.remove("is-open");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero: palabra rotativa (spans fijos, sin churn de DOM) ---------- */
  var rotator = document.getElementById("rotator");
  if (rotator && !reduceMotion) {
    var words = ["que vende.", "multicanal.", "que agenda.", "open source.", "que es tuyo."];
    rotator.innerHTML = "";
    var spans = words.map(function (w, i) {
      var s = document.createElement("span");
      s.className = "rot-word" + (i === 0 ? " is-in" : "");
      s.textContent = w;
      rotator.appendChild(s);
      return s;
    });
    var idx = 0;
    setInterval(function () {
      spans[idx].classList.remove("is-in");
      spans[idx].classList.add("is-out");
      var prev = spans[idx];
      setTimeout(function () { prev.classList.remove("is-out"); }, 700);
      idx = (idx + 1) % words.length;
      spans[idx].classList.remove("is-out");
      spans[idx].classList.add("is-in");
    }, 2600);
  }

  /* ---------- Demo: conversación en loop ---------- */
  var chat = document.getElementById("chatStage");
  var convPreview = document.getElementById("convPreview");
  var agentNote = document.getElementById("agentNote");
  var threadMode = document.getElementById("threadMode");
  var stages = document.querySelectorAll(".app-contact .stg");

  function setStage(n) {
    stages.forEach(function (s) {
      s.classList.toggle("is-on", parseInt(s.dataset.stg, 10) === n);
    });
  }

  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  var script = [
    { t: 900,  run: function () { setStage(0); chat.appendChild(el('<div class="msg in"><p>hola, ¿tienen impermeabilizante?</p><time>13:04</time></div>')); if (convPreview) convPreview.textContent = "hola, ¿tienen impermeabilizante?"; } },
    { t: 900,  run: function () { chat.appendChild(el('<div class="typing" id="tp1"><i></i><i></i><i></i></div>')); } },
    { t: 1400, run: function () { var tp = document.getElementById("tp1"); if (tp) tp.remove(); chat.appendChild(el('<div class="msg out"><p>¡Hola! Sí 🙌 Tenemos de 5L y 19L, con 8 años de garantía. ¿Para qué superficie lo necesitas?</p><time>13:04 · IA <i class="ticks"></i></time></div>')); setStage(1); if (agentNote) agentNote.textContent = "Preguntó por impermeabilizante. Respondo con catálogo indexado."; } },
    { t: 2100, run: function () { chat.appendChild(el('<div class="msg in"><p>para azotea, ¿precio del de 5L?</p><time>13:05</time></div>')); if (convPreview) convPreview.textContent = "para azotea, ¿precio del de 5L?"; } },
    { t: 900,  run: function () { chat.appendChild(el('<div class="typing" id="tp2"><i></i><i></i><i></i></div>')); } },
    { t: 1400, run: function () { var tp = document.getElementById("tp2"); if (tp) tp.remove(); chat.appendChild(el('<div class="msg out"><p>El de 5L está en $749 con envío gratis 🚚 ¿Te lo aparto? Puedo agendar la entrega hoy mismo.</p><time>13:05 · IA <i class="ticks"></i></time></div>')); setStage(2); if (agentNote) agentNote.textContent = "Intención de compra detectada → muevo a Interesado. Ofrezco cierre."; } },
    { t: 2200, run: function () { chat.appendChild(el('<div class="msg in"><p>mejor pásame con una persona porfa</p><time>13:06</time></div>')); if (convPreview) convPreview.textContent = "mejor pásame con una persona porfa"; } },
    { t: 1100, run: function () {
        if (threadMode) threadMode.innerHTML = '<span class="mode-ia is-human">Responde: <b>Humano</b></span><button class="handoff is-human" type="button">Devolver a la IA</button>';
        if (agentNote) agentNote.textContent = "Cliente pidió humano → traspaso inmediato. Resumen listo para el vendedor.";
        chat.appendChild(el('<div class="msg out human"><p>¡Hola María! Soy Kevin 👋 Ya vi que quieres el de 5L para azotea. Te lo dejo apartado, ¿te llega hoy por la tarde?</p><time>13:07 · HUMANO <i class="ticks"></i></time></div>'));
      } },
    { t: 2600, run: function () { chat.appendChild(el('<div class="msg in"><p>síii, gracias 🙏</p><time>13:07</time></div>')); setStage(3); if (convPreview) convPreview.textContent = "síii, gracias 🙏"; if (agentNote) agentNote.textContent = "Venta cerrada → etapa Cliente. La IA retoma el seguimiento post-venta."; } },
    { t: 3400, run: function () {
        chat.innerHTML = "";
        if (threadMode) threadMode.innerHTML = '<span class="mode-ia">Responde: <b>IA</b></span><button class="handoff" type="button">Pasar a humano</button>';
        setStage(0);
      } }
  ];

  if (chat) {
    var step = 0;
    var running = false;
    function tick() {
      var s = script[step];
      setTimeout(function () {
        s.run();
        // máximo 6 burbujas visibles
        while (chat.children.length > 6) chat.removeChild(chat.firstChild);
        step = (step + 1) % script.length;
        tick();
      }, reduceMotion ? Math.min(s.t, 400) : s.t);
    }
    var demoIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !running) { running = true; tick(); }
    }, { threshold: 0.25 });
    demoIO.observe(chat);
  }

  /* ---------- Banderas: toggles interactivos ---------- */
  var flagAgenda = document.getElementById("flagAgenda");
  var flagMulti = document.getElementById("flagMulti");
  var envLine = document.getElementById("envLine");

  function renderFlags() {
    var a = flagAgenda.checked;
    var m = flagMulti.checked;
    envLine.innerHTML =
      'AGENDA=' + (a ? "<b>on</b>" : '<span class="off">off</span>') +
      "&nbsp;&nbsp;MULTICANAL=" + (m ? "<b>on</b>" : '<span class="off">off</span>');
    document.querySelectorAll(".ms-item.flag-agenda").forEach(function (n) { n.classList.toggle("is-on", a); });
    document.querySelectorAll(".ms-chip.flag-multi").forEach(function (n) { n.classList.toggle("is-on", m); });
  }
  if (flagAgenda && flagMulti && envLine) {
    flagAgenda.addEventListener("change", renderFlags);
    flagMulti.addEventListener("change", renderFlags);
  }

  /* ---------- GitHub: estrellas y forks en vivo ---------- */
  function animateCount(elNode, target) {
    if (reduceMotion) { elNode.textContent = String(target); return; }
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      elNode.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var statStars = document.getElementById("statStars");
  var statForks = document.getElementById("statForks");
  var ghStarsNav = document.getElementById("ghStarsNav");

  fetch("https://api.github.com/repos/kevinrivm/vocero-crm")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      var stars = data.stargazers_count || 0;
      var forks = data.forks_count || 0;
      if (ghStarsNav) ghStarsNav.textContent = "★ " + stars;
      var statsIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        statsIO.disconnect();
        if (statStars) animateCount(statStars, stars);
        if (statForks) animateCount(statForks, forks);
      }, { threshold: 0.4 });
      if (statStars) statsIO.observe(statStars);
    })
    .catch(function () { /* sin red: se quedan los guiones */ });

  /* Contadores con data-target fijo */
  document.querySelectorAll(".count[data-target]").forEach(function (c) {
    var cIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      cIO.disconnect();
      animateCount(c, parseInt(c.dataset.target, 10));
    }, { threshold: 0.4 });
    cIO.observe(c);
  });

  /* ---------- Copiar al portapapeles ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var txt = btn.getAttribute("data-copy");
      var done = function () {
        var prev = btn.textContent;
        btn.textContent = "¡COPIADO!";
        setTimeout(function () { btn.textContent = prev; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done).catch(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });
})();
