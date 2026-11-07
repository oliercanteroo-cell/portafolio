/* =====================================================================
   i18n.js
   "i18n" significa internacionalización (la i, 18 letras, la n).
   Aquí están las traducciones ES/EN y las funciones para cambiar de idioma.

   Idea clave: cada texto tiene una CLAVE (ej: "nav.home").
   En el HTML ponemos data-i18n="nav.home" y este archivo busca esa clave
   en el idioma actual y escribe la traducción.
   ===================================================================== */

/* Diccionario: un objeto con un objeto por idioma. */
const I18N = {
  es: {
    "nav.home": "Inicio", "nav.about": "Sobre mí", "nav.skills": "Habilidades",
    "nav.projects": "Proyectos", "nav.education": "Formación", "nav.contact": "Contacto",

    "hero.hello": "hola, soy",
    "hero.role": "Aprendiz de Análisis y Desarrollo de Software",
    "hero.desc": "Construyo aplicaciones web con HTML, CSS y JavaScript, y estoy creciendo en backend con PHP, Python y Java.",
    "hero.cta1": "Ver proyectos", "hero.cta2": "Descargar CV",

    "about.title": "Sobre mí",
    "about.p1": "Soy aprendiz del SENA en el tecnólogo en Análisis y Desarrollo de Software, en Medellín. Me gusta convertir ideas en productos que se vean bien y funcionen mejor.",
    "about.p2": "Vengo de un bachillerato técnico en Integración de Contenidos Digitales, así que le presto mucha atención al diseño y a los detalles.",
    "about.f1": "Medellín, Colombia", "about.f2": "Tecnólogo ADSO, SENA", "about.f3": "Busco empresa patrocinadora",
    "about.c1": "Proyectos", "about.c2": "Tecnologías", "about.c3": "Idiomas",

    "skills.title": "Habilidades",
    "projects.title": "Proyectos",
    "edu.title": "Formación",

    // Las claves "filter.xxx" se arman en main.js como "filter." + categoría
    "filter.all": "Todos", "filter.frontend": "Frontend", "filter.backend": "Backend", "filter.tools": "Herramientas",
    "project.demo": "Ver demo", "project.code": "Código",

    "contact.title": "Contacto",
    "contact.text": "¿Tienes un proyecto o una oportunidad? Escríbeme, me encantaría conversar.",
    "contact.name": "Nombre", "contact.email": "Correo", "contact.msg": "Mensaje",
    "contact.send": "Enviar mensaje",

    // Mensajes del formulario
    "form.required": "Este campo es obligatorio.",
    "form.email": "Escribe un correo válido.",
    "form.min": "El mensaje debe tener al menos 10 caracteres.",
    "form.sending": "Enviando...",
    "form.ok": "¡Mensaje enviado! Te responderé pronto.",
    "form.error": "No se pudo enviar. Inténtalo de nuevo o escríbeme por correo.",

    "footer.rights": "Todos los derechos reservados."
  },
  en: {
    "nav.home": "Home", "nav.about": "About", "nav.skills": "Skills",
    "nav.projects": "Projects", "nav.education": "Education", "nav.contact": "Contact",

    "hero.hello": "hi, I'm",
    "hero.role": "Software Analysis and Development Apprentice",
    "hero.desc": "I build web apps with HTML, CSS and JavaScript, and I'm growing in backend with PHP, Python and Java.",
    "hero.cta1": "View projects", "hero.cta2": "Download CV",

    "about.title": "About me",
    "about.p1": "I'm a SENA apprentice in the Software Analysis and Development technologist program, based in Medellín. I like turning ideas into products that look good and work even better.",
    "about.p2": "I come from a technical high school focused on Digital Content Integration, so I pay close attention to design and details.",
    "about.f1": "Medellín, Colombia", "about.f2": "ADSO Technologist, SENA", "about.f3": "Looking for a sponsoring company",
    "about.c1": "Projects", "about.c2": "Technologies", "about.c3": "Languages",

    "skills.title": "Skills",
    "projects.title": "Projects",
    "edu.title": "Education",

    "filter.all": "All", "filter.frontend": "Frontend", "filter.backend": "Backend", "filter.tools": "Tools",
    "project.demo": "Live demo", "project.code": "Code",

    "contact.title": "Contact",
    "contact.text": "Have a project or an opportunity? Write to me, I'd love to talk.",
    "contact.name": "Name", "contact.email": "Email", "contact.msg": "Message",
    "contact.send": "Send message",

    "form.required": "This field is required.",
    "form.email": "Enter a valid email.",
    "form.min": "The message must be at least 10 characters long.",
    "form.sending": "Sending...",
    "form.ok": "Message sent! I'll get back to you soon.",
    "form.error": "Could not send. Please try again or email me directly.",

    "footer.rights": "All rights reserved."
  }
};

/* Idioma actual. Por defecto español.
   localStorage guarda datos en el navegador aunque cierres la pestaña,
   así la página recuerda tu idioma la próxima vez.
   try/catch: si el navegador bloquea localStorage, no se rompe todo. */
let currentLang = "es";
try { currentLang = localStorage.getItem("lang") || "es"; } catch (e) {}

/* t("clave") -> devuelve la traducción en el idioma actual.
   Si la clave no existe, devuelve la clave misma (así notas el error).
   "a && b || c" funciona así: intenta lo de la izquierda, si falla usa lo de la derecha. */
const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || key;

/* tr(objeto) -> para datos con forma { es: "...", en: "..." } (los de data.js).
   Si recibe un texto simple lo devuelve tal cual. */
const tr = (obj) => (typeof obj === "string" ? obj : obj[currentLang]);

/* applyLang(): recorre la página y escribe todas las traducciones. */
function applyLang() {
  document.documentElement.lang = currentLang; // actualiza <html lang="...">

  // querySelectorAll busca TODOS los elementos con el atributo data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n); // dataset.i18n lee el valor de data-i18n="..."
  });

  // El botón muestra el idioma al que cambiarías (si estás en ES, muestra EN)
  const label = document.querySelector("[data-lang-label]");
  if (label) label.textContent = currentLang === "es" ? "EN" : "ES";

  // Lanzamos un "evento propio" para avisar a main.js que el idioma cambió
  // y que debe volver a dibujar las tarjetas, filtros, etc.
  document.dispatchEvent(new CustomEvent("langchange"));
}

/* setLang("en"): cambia el idioma, lo guarda y lo aplica. */
function setLang(lang) {
  currentLang = lang;
  try { localStorage.setItem("lang", lang); } catch (e) {}
  applyLang();
}
