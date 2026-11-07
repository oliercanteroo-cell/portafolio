# Guía paso a paso: construir tu portafolio

Esta guía te lleva en el mismo orden en que se construyó la página.
Cada archivo del proyecto ya trae comentarios que explican cada parte.

---

## Paso 0: Preparar la carpeta

1. Crea la carpeta `portafolio`.
2. Dentro crea estas subcarpetas y archivos vacíos:

```
portafolio/
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── data.js
│   ├── i18n.js
│   └── main.js
└── assets/
    └── img/
```

3. Ábrela en VS Code e instala la extensión **Live Server** (clic derecho en `index.html` → "Open with Live Server" para ver los cambios al instante).

**¿Por qué separar en varios archivos?** Para que cada uno tenga una sola responsabilidad. Si algo se ve mal, sabes en cuál buscar.

---

## Paso 1: El esqueleto HTML (`index.html`)

**Qué hacer:** escribe la estructura completa con todas las secciones, sin estilos todavía.

**Qué aprendes:**
- `<head>`: lo que no se ve (título, fuentes, enlaces a los CSS).
- Etiquetas semánticas: `header`, `nav`, `main`, `section`, `footer`.
- Los `id` (`#inicio`, `#proyectos`) son los destinos de los enlaces del menú.
- `data-i18n="..."` marca los textos que se traducen luego.
- Los contenedores vacíos (`skillsGrid`, `projectsGrid`, `timeline`) se llenarán con JavaScript.

**Cómo comprobarlo:** abre la página. Se verá feo (texto blanco sobre blanco o negro simple), pero todos los textos deben estar.

---

## Paso 2: Variables y reglas base (`css/base.css`)

**Qué hacer:** define las variables de color y el reset.

**Qué aprendes:**
- `:root { --accent: #ffd400; }` crea variables que usas con `var(--accent)`.
- El reset (`* { margin: 0 }`) elimina diferencias entre navegadores.
- `clamp()` hace tamaños que crecen con la pantalla.
- `.container` centra el contenido.

**Cómo comprobarlo:** la página ya debe tener fondo negro y texto claro.

**Prueba tú:** cambia `--accent` por otro color y mira cómo cambia todo.

---

## Paso 3: La estructura (`css/layout.css`)

**Qué hacer:** navbar, hero, secciones, grids, línea de tiempo y responsive.

**Qué aprendes:**
- `position: fixed` (navbar siempre visible).
- **Flexbox** (`display: flex`) para alinear en una fila.
- **Grid** (`display: grid`) para columnas; `repeat(auto-fill, minmax(...))` crea columnas responsive solas.
- `::before` y `::after`: elementos decorativos creados desde CSS.
- `@media (max-width: 760px)`: reglas solo para celular.

**Cómo comprobarlo:** achica la ventana del navegador y mira cómo las columnas se apilan.

---

## Paso 4: Las piezas (`css/components.css`)

**Qué hacer:** botones, chips, barras de habilidad, tarjetas, formulario.

**Qué aprendes:**
- Variantes con clases (`.btn--primary`, `.btn--ghost`).
- `transition` y `:hover` para efectos suaves.
- `.reveal` empieza invisible y `.reveal.visible` aparece (JavaScript pone la clase `visible`).

**Cómo comprobarlo:** pasa el mouse por los botones.

---

## Paso 5: Los datos (`js/data.js`)

**Qué hacer:** crea los arreglos `SKILLS`, `PROJECTS` y `TIMELINE`.

**Qué aprendes:**
- Arreglo `[ ]` = lista. Objeto `{ clave: valor }` = ficha con datos.
- Separar datos de lógica: para agregar un proyecto solo editas este archivo.
- Los textos en dos idiomas se guardan como `{ es: "...", en: "..." }`.

---

## Paso 6: Los idiomas (`js/i18n.js`)

**Qué hacer:** el diccionario ES/EN y las funciones `t()`, `tr()`, `applyLang()`, `setLang()`.

**Qué aprendes:**
- `querySelectorAll("[data-i18n]")` encuentra todos los textos traducibles.
- `localStorage` recuerda el idioma elegido.
- `CustomEvent`: crear un evento propio (`langchange`) para avisar a otros archivos.

---

## Paso 7: La lógica (`js/main.js`)

Construye **por partes**, probando cada una antes de seguir:

| Parte | Qué hace | Cómo probarla |
|-------|----------|---------------|
| 1. Navbar | Agrega clase `scrolled` al bajar | Baja un poco: el navbar se oscurece |
| 2. Hamburguesa | Abre y cierra el menú móvil | Achica la ventana y toca el botón |
| 3. Idioma | Botón ES/EN | Cambia el idioma |
| 4. Reveal | Elementos aparecen al hacer scroll | Baja la página |
| 5. Scroll spy | Resalta la sección actual en el menú | Baja y mira el menú |
| 6. Contadores | Números suben de 0 | Llega a "Sobre mí" |
| 7. Typewriter | Escribe el rol letra por letra | Recarga la página |
| 8-11. Render | Dibuja habilidades, proyectos y línea de tiempo desde `data.js` | Mira las secciones |
| 12. Formulario | Valida y muestra errores | Envía el formulario vacío |

**Conceptos clave que vas a usar:**
- `addEventListener("click", ...)`: reaccionar a acciones del usuario.
- `classList.add / remove / toggle`: agregar clases para que el CSS cambie la apariencia.
- `IntersectionObserver`: saber cuándo un elemento entra en pantalla.
- `.filter()`, `.map()`, `.forEach()`: recorrer y transformar arreglos.
- Plantillas con `` `texto ${variable}` ``: armar HTML con datos.

---

## Paso 8: Personalizar

1. Foto: guárdala en `assets/img/foto.jpg` y reemplaza el `div class="photo__placeholder"` por `<img src="assets/img/foto.jpg" alt="Foto de Olier">`.
2. CV: guárdalo en `assets/cv.pdf`.
3. Enlaces reales de GitHub, LinkedIn y correo en la sección Contacto del HTML.
4. Datos reales en `js/data.js`.

---

## Consejos para aprender de verdad

- **Escríbelo a mano, no copies y pegues.** Se aprende mucho más.
- **Prueba después de cada parte**, no al final.
- **Rompe cosas a propósito:** cambia un número, borra una línea y mira qué pasa.
- Abre las **herramientas de desarrollador** (F12): la pestaña *Console* muestra errores de JavaScript y *Elements* te deja ver y editar el HTML/CSS en vivo.

## Siguientes pasos del proyecto

- Pulido: accesibilidad y pruebas en celular.
- Conectar el formulario a Formspree o EmailJS para recibir mensajes reales.
- Publicar en GitHub Pages y poner el enlace en tu hoja de vida.
