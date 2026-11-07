/* =====================================================================
   main.js
   Toda la lógica de la página: menú, scroll, animaciones, filtros,
   dibujar tarjetas desde data.js y validar el formulario.

   Usa lo que definieron data.js (SKILLS, PROJECTS, TIMELINE)
   e i18n.js (t, tr, currentLang, setLang, applyLang).
   ===================================================================== */

/* Todo el código va dentro de (() => { ... })();
   Es una función que se ejecuta a sí misma al instante ("IIFE").
   Sirve para que nuestras variables no se mezclen con las de otros archivos. */
(() => {

  /* Atajos para escribir menos:
     $("#id")  -> el primer elemento que coincida con el selector CSS
     $$(".x")  -> TODOS los que coincidan, como un arreglo 
     "ctx" es dónde buscar (por defecto, toda la página). */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- 1. Navbar: fondo al hacer scroll ----------
     Cuando bajas más de 20px agregamos la clase "scrolled" (el CSS le da fondo oscuro).
     toggle(clase, condición): agrega la clase si la condición es true, la quita si es false. */
  const navbar = $("#navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true }); // passive = más fluido
  onScroll(); // la ejecutamos una vez por si la página ya carga con scroll

  /* ---------- 2. Menú hamburguesa ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  const closeMenu = () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open"); // toggle devuelve true si quedó con la clase
    burger.setAttribute("aria-expanded", String(open)); // el CSS usa esto para dibujar la X
  });
  // Al tocar un enlace del menú, lo cerramos
  $$(".nav__link").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- 3. Botón de idioma ---------- */
  $("#langBtn").addEventListener("click", () => setLang(currentLang === "es" ? "en" : "es"));

  /* ---------- 4. Aparecer al hacer scroll (IntersectionObserver) ----------
     IntersectionObserver vigila elementos y nos avisa cuando entran en pantalla.
     threshold: 0.15 = cuando se ve al menos el 15% del elemento.
     Al entrar: le ponemos .visible (el CSS lo anima) y dejamos de vigilarlo (unobserve). */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  // Pone a vigilar todo lo que aún no es visible. La llamaremos de nuevo cada vez
  // que dibujemos tarjetas nuevas (porque son elementos nuevos).
  const observeReveals = () =>
    $$(".reveal:not(.visible), .skill:not(.visible)").forEach((el) => revealObserver.observe(el));

  // Marcamos qué elementos de la página tendrán la animación de aparecer
  $$(".section__title, .about, .counters, .contact > *, .timeline, .filters")
    .forEach((el) => el.classList.add("reveal"));

  /* ---------- 5. Menú activo según la sección visible ----------
     Otro IntersectionObserver: vigila cada <section>.
     rootMargin recorta el "área de vigilancia" a una franja en el centro de la pantalla,
     así la sección activa es la que está en el medio. */
  const links = $$(".nav__link");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        // El enlace cuyo href coincide con el id de la sección recibe la clase "active"
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* ---------- 6. Contadores animados ----------
     Cuando la sección de contadores aparece, cada número sube de 0 hasta su data-count. */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("[data-count]", e.target).forEach((el) => {
        const target = +el.dataset.count;   // el "+" convierte el texto "6" en el número 6
        const start = performance.now();    // momento en que arranca la animación
        const dur = 1200;                   // duración: 1.2 segundos
        // requestAnimationFrame llama a "step" antes de cada fotograma (~60 veces por segundo)
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);          // progreso de 0 a 1
          // 1 - (1-p)^3 es una curva "ease-out": empieza rápido y frena al final
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);              // si no terminó, otro fotograma
        };
        requestAnimationFrame(step);
      });
      counterObserver.unobserve(e.target); // solo se anima una vez
    });
  }, { threshold: 0.4 });
  counterObserver.observe($("#counters"));

  /* ---------- 7. Efecto máquina de escribir ----------
     Escribe el texto del rol letra por letra.
     "token" evita que dos escrituras se mezclen: si cambias de idioma a mitad,
     la escritura anterior se da cuenta de que ya no es la vigente y se detiene. */
  const roleEl = $(".hero__role");
  let typingToken = 0;
  const typeRole = () => {
    const full = t("hero.role");   // el texto completo en el idioma actual
    const token = ++typingToken;   // nuevo número de turno
    roleEl.textContent = "";
    let i = 0;
    const tick = () => {
      if (token !== typingToken) return;            // ¿ya hay otra escritura más nueva? paro.
      roleEl.textContent = full.slice(0, ++i);      // muestra las primeras i letras
      if (i < full.length) setTimeout(tick, 38);    // siguiente letra en 38 milisegundos
    };
    tick();
  };

  /* ---------- 8. Filtros (sirven para habilidades y proyectos) ---------- */
  const CATS = ["all", "frontend", "backend", "tools"];
  // Guarda qué filtro está activo en cada sección
  const state = { skills: "all", projects: "all" };

  /* buildFilters dibuja los botones de filtro dentro de un contenedor.
     - containerId: dónde ponerlos   - key: "skills" o "projects"
     - cats: lista de categorías     - render: función que redibuja las tarjetas */
  const buildFilters = (containerId, key, cats, render) => {
    const box = $(containerId);
    box.innerHTML = "";                       // vaciamos para no duplicar botones
    cats.forEach((cat) => {
      const b = document.createElement("button");   // creamos un <button>
      b.className = "chip" + (state[key] === cat ? " active" : ""); // activo si es el filtro actual
      b.textContent = t("filter." + cat);            // texto traducido: "filter.frontend"...
      b.addEventListener("click", () => {
        state[key] = cat;                            // guardamos el nuevo filtro
        buildFilters(containerId, key, cats, render);// redibujamos los botones (cambia el activo)
        render();                                    // redibujamos las tarjetas filtradas
      });
      box.appendChild(b);                            // lo metemos en la página
    });
  };

  /* ---------- 9. Dibujar habilidades ----------
     Lee SKILLS (data.js), filtra por categoría y crea un bloque HTML por cada una.
     innerHTML con `plantillas` (comillas invertidas) permite meter variables con ${...}. */
  const renderSkills = () => {
    const grid = $("#skillsGrid");
    grid.innerHTML = "";
    SKILLS
      .filter((s) => state.skills === "all" || s.cat === state.skills) // solo las de la categoría
      .forEach((s) => {
        const el = document.createElement("div");
        el.className = "skill";
        el.innerHTML = `
          <div class="skill__head"><span>${s.name}</span><span class="skill__level">${s.level}%</span></div>
          <div class="skill__bar"><div class="skill__fill" style="--level:${s.level}%"></div></div>`;
        grid.appendChild(el);
      });
    observeReveals(); // vigilar las nuevas para que se llenen al aparecer
  };

  /* ---------- 10. Dibujar proyectos ----------
     Igual que las habilidades, pero con tarjetas.
     tr(p.title) toma el texto en el idioma actual.
     p.tags.map(...).join("") convierte cada etiqueta en un <span> y los une en un texto. */
  const renderProjects = () => {
    const grid = $("#projectsGrid");
    grid.innerHTML = "";
    PROJECTS
      .filter((p) => state.projects === "all" || p.cat === state.projects)
      .forEach((p) => {
        const el = document.createElement("article");
        el.className = "card reveal";
        el.innerHTML = `
          <div class="card__img"><img src="${p.image}" alt="${tr(p.title)}"></div>
          <div class="card__body">
            <h3 class="card__title">${tr(p.title)}</h3>
            <p class="card__desc">${tr(p.desc)}</p>
            <div class="card__tags">${p.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
            <div class="card__links">
              <a href="${p.demo}" target="_blank" rel="noopener">${t("project.demo")}</a>
              <a href="${p.code}" target="_blank" rel="noopener">${t("project.code")}</a>
            </div>
          </div>`;
        grid.appendChild(el);
      });
    observeReveals();
  };

  /* ---------- 11. Dibujar la línea de tiempo ----------
     .map convierte cada objeto de TIMELINE en un <li> y .join("") los une. */
  const renderTimeline = () => {
    $("#timeline").innerHTML = TIMELINE.map((i) => `
      <li class="timeline__item${i.current ? " current" : ""}">
        <span class="timeline__date">${tr(i.date)}</span>
        <h3 class="timeline__title">${tr(i.title)}</h3>
        <p class="timeline__place">${tr(i.place)}</p>
        <p class="timeline__desc">${tr(i.desc)}</p>
      </li>`).join("");
  };

  /* renderAll(): redibuja TODO lo dinámico. Se usa al cargar y al cambiar de idioma. */
  const renderAll = () => {
    buildFilters("#skillFilters", "skills", CATS, renderSkills);
    // En proyectos no mostramos el filtro "tools" (no hay proyectos de herramientas)
    buildFilters("#projectFilters", "projects", CATS.filter((c) => c !== "tools"), renderProjects);
    renderSkills();
    renderProjects();
    renderTimeline();
    typeRole();
  };

  /* ---------- 12. Formulario con validación ---------- */
  const form = $("#contactForm");

  // Creamos un <p> para mostrar el mensaje de éxito debajo del botón
  const status = document.createElement("p");
  status.className = "form__status";
  status.setAttribute("role", "status"); // los lectores de pantalla lo anuncian
  form.appendChild(status);

  /* Una función de validación por campo. Devuelven "" si está bien,
     o la CLAVE del mensaje de error si algo falla (se traduce después con t()). */
  const validators = {
    name: (v) => (v.trim() ? "" : "form.required"),   // trim() quita espacios de los extremos
    email: (v) =>
      !v.trim() ? "form.required"
      // Expresión regular: algo + @ + algo + . + algo (sin espacios)
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "form.email",
    message: (v) =>
      !v.trim() ? "form.required"
      : v.trim().length < 10 ? "form.min" : ""
  };

  /* checkField revisa UN campo, muestra u oculta su error y devuelve true/false */
  const checkField = (field) => {
    const key = validators[field.name](field.value); // field.name viene del atributo name="" del HTML
    field.classList.toggle("invalid", !!key); // !!key convierte el texto en true/false
    field.dataset.errorKey = key;   // guardamos la clave para retraducir si cambia el idioma
    field.parentElement.querySelector(".error").textContent = key ? t(key) : "";
    return !key;
  };

  $$("input, textarea", form).forEach((f) => {
    f.addEventListener("blur", () => checkField(f));  // blur = cuando salimos del campo
    // Mientras escribimos, si ya tenía error, lo revisa de nuevo para quitarlo en cuanto lo corriges
    f.addEventListener("input", () => { if (f.classList.contains("invalid")) checkField(f); });
  });

    const ACCESS_KEY = "2d22701b-41b2-46d0-a740-6b4240f83945";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = $$("input, textarea", form).map(checkField).every(Boolean);
    if (!ok) {
      status.textContent = "";
      delete status.dataset.key;
      return;                                   // si hay errores, no enviamos nada
    }

    const btn = $("button[type=submit]", form);
    btn.disabled = true;                        // evita dobles clics
    status.dataset.key = "form.sending";
    status.textContent = t("form.sending");

    const data = new FormData(form);
    data.append("access_key", ACCESS_KEY);
    data.append("subject", "Nuevo mensaje desde mi portafolio");
    data.append("from_name", "Portafolio");

    let key;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });
      const json = await res.json();            // Web3Forms responde con { success: true/false }
      if (res.ok && json.success) { key = "form.ok"; form.reset(); }
      else key = "form.error";
    } catch {
      key = "form.error";                       // por ejemplo, sin internet
    }

    status.dataset.key = key;
    status.textContent = t(key);
    btn.disabled = false;
  });

  /* ---------- 13. Año del footer ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- 14. Cuando cambia el idioma -------
     i18n.js lanza el evento "langchange". Aquí lo escuchamos y redibujamos todo,
     incluidos los mensajes de error y de éxito del formulario. */
  document.addEventListener("langchange", () => {
    renderAll();
    $$("input, textarea", form).forEach((f) => {
      if (f.dataset.errorKey) f.parentElement.querySelector(".error").textContent = t(f.dataset.errorKey);
    });
    if (status.dataset.key) status.textContent = t(status.dataset.key);
  });

  /* ---------- 15. Arranque ---------- */
  observeReveals();
  applyLang(); // escribe los textos en el idioma guardado y dispara "langchange" -> renderAll()
})();
