 /* =====================================================================
   data.js
   Aquí viven LOS DATOS. Separarlos del resto del código tiene una ventaja:
   para agregar un proyecto o una habilidad solo editas este archivo,
   no tienes que tocar el HTML ni la lógica.

   Estos son datos de ejemplo: cámbialos por los tuyos.
   ===================================================================== */

/* Un ARREGLO (array) es una lista: [ elemento1, elemento2, ... ]
   Cada elemento es un OBJETO: { clave: valor, clave: valor }
   cat   = categoría (la usan los filtros: frontend / backend / tools)
   level = porcentaje de la barra */
const SKILLS = [
  { name: "HTML",       cat: "frontend", level: 40 },
  { name: "CSS",        cat: "frontend", level: 45 },
  { name: "JavaScript", cat: "frontend", level: 48 },
  { name: "Python",        cat: "backend",  level: 50 },
  { name: "PHP",     cat: "backend",  level: 15 },
  { name: "Java",       cat: "backend",  level: 20 },
  { name: "MySQL",      cat: "backend",  level: 30 },
  { name: "Git",        cat: "tools",    level: 35 },
  { name: "GitHub",    cat: "tools",    level: 30 },
  { name: "Visual Studio Code",    cat: "tools",    level: 60 },
  { name: "Figma",     cat: "tools",    level: 40},
  { name: "Apache NetBeans",     cat: "tools",    level: 40},
  { name: "Visual Studio Cominity",     cat: "tools",    level: 20},
];

/* Proyectos.
   title y desc son objetos con { es: "...", en: "..." } para tener los dos idiomas.
   tags   = etiquetas de tecnologías (otro arreglo)
   demo / code = enlaces. Pon aquí el enlace real; "#" significa "aún no hay enlace". */
const PROJECTS = [
  {
    cat: "frontend",
    image: "assets/img/calculadora.png",   
    title: { es: "Calculadora", en: "Calculator" },
    desc: {
      es: "Calculadora con diseño responsive, operaciones encadenadas.",
      en: "Responsive calculator with chained operations."
    },
    tags: ["HTML", "CSS", "JavaScript"],
    demo: "https://oliercanteroo-cell.github.io/calculadora/", code: "https://github.com/oliercanteroo-cell/calculadora"
  },
  {
    cat: "backend",
    image: "assets/img/captura-oscuro.png",
    title: { es: "Gestor de gastos", en: "Expense tracker" },
    desc: {
      es: "Aplicación web hecha con Flask para llevar el control de tus gastos personales: registra cada gasto en pesos colombianos (COP), clasifícalo por categoría y usa la interfaz en modo claro u oscuro.",
  en: "Web app built with Flask to track your personal expenses: log each expense in Colombian pesos (COP), sort it by category and use the interface in light or dark mode."
    },
    tags: ["Python", "Flask" ,"CSS", "HTML", "JavaScript"],
    demo: "https://github.com/oliercanteroo-cell/gestor-gastos", code: "https://github.com/oliercanteroo-cell/gestor-gastos"
  },

];

/* Línea de tiempo de formación.
   current: true marca el hito en el que estás ahora (círculo relleno). */
const TIMELINE = [
  {
    date: { es: "2025", en: "2025" },
    title: { es: "Bachiller Técnico en Integración de Contenidos Digitales", en: "Technical High School Diploma in Digital Content Integration" },
    place: "I. E. Manuela Beltrán",
    desc: { es: "Base en diseño, multimedia y herramientas digitales.", en: "Foundation in design, multimedia and digital tools." }
  },
  {
    date: { es: "2025 – 04/2027", en: "2025 – 04/2027" },
    title: { es: "Tecnólogo en Análisis y Desarrollo de Software", en: "Technologist in Software Analysis and Development" },
    place: "SENA · Centro Tecnológico del Mobiliario",
    desc: { es: "Etapa lectiva: programación, bases de datos y desarrollo web.", en: "Classroom stage: programming, databases and web development." },
    current: true
  },
  {
    date: { es: "04/2027 – 10/2027", en: "04/2027 – 10/2027" },
    title: { es: "Etapa productiva", en: "Work-based stage" },
    place: { es: "Empresa patrocinadora (por definir)", en: "Sponsoring company (to be defined)" },
    desc: { es: "Práctica profesional aplicando todo lo aprendido en un entorno real.", en: "Professional practice applying everything learned in a real environment." }
  }
];
