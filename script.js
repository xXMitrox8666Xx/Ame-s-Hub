// Lista de imágenes decorativas. Agrega o quita rutas aquí para
// cambiar qué aparece en la página.
const IMAGENES_DECORATIVAS = [
  "assets/conejo-oso.jpg",
  "assets/duermo-te-sueno.jpg",
  "assets/gatos-espalda.jpg",
  "assets/domo-plush.jpg",
  "assets/bunny-bow.jpg",
  "assets/gatos-lentes.jpg",
];

const ANCHO_MIN = 80;
const ANCHO_MAX = 130;
const MARGEN_BORDE = 18; // aire respecto a los bordes de la página (deja hueco para la rotación)
const MARGEN_ENTRE_IMAGENES = 16; // separación mínima entre decoraciones
const MARGEN_GRID = 14; // separación mínima respecto a la cuadrícula
const INTENTOS_MAXIMOS = 300;

function numeroAleatorio(min, max) {
  return Math.random() * (max - min) + min;
}

// Devuelve las dimensiones reales de la imagen (para no adivinar su alto).
function cargarImagen(ruta) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ruta, ancho: img.naturalWidth, alto: img.naturalHeight });
    img.src = ruta;
  });
}

function seSuperponen(a, b, margen) {
  return !(
    a.right + margen < b.left ||
    a.left - margen > b.right ||
    a.bottom + margen < b.top ||
    a.top - margen > b.bottom
  );
}

// Coloca cada imagen en una posición al azar dentro de .page, sin que
// se salgan del área ni se toquen entre sí ni con la cuadrícula.
async function colocarDecoraciones() {
  const capa = document.getElementById("floaties");
  const pagina = document.querySelector(".page");
  const grid = document.querySelector(".grid");
  if (!capa || !pagina || !grid) return;

  const anchoPagina = pagina.clientWidth;
  const altoPagina = pagina.scrollHeight;

  const rectPagina = pagina.getBoundingClientRect();
  const rectGrid = grid.getBoundingClientRect();
  const zonaGrid = {
    left: rectGrid.left - rectPagina.left,
    top: rectGrid.top - rectPagina.top,
    right: rectGrid.right - rectPagina.left,
    bottom: rectGrid.bottom - rectPagina.top,
  };

  const imagenes = await Promise.all(IMAGENES_DECORATIVAS.map(cargarImagen));
  const colocadas = [];

  imagenes.forEach(({ ruta, ancho: anchoNatural, alto: altoNatural }) => {
    const ancho = numeroAleatorio(ANCHO_MIN, ANCHO_MAX);
    const alto = ancho * (altoNatural / anchoNatural);

    const limiteAncho = Math.max(anchoPagina - ancho - MARGEN_BORDE, MARGEN_BORDE);
    const limiteAlto = Math.max(altoPagina - alto - MARGEN_BORDE, MARGEN_BORDE);

    let mejorRect = null;
    for (let intento = 0; intento < INTENTOS_MAXIMOS; intento++) {
      const left = numeroAleatorio(MARGEN_BORDE, limiteAncho);
      const top = numeroAleatorio(MARGEN_BORDE, limiteAlto);
      const rect = { left, top, right: left + ancho, bottom: top + alto };

      const chocaConGrid = seSuperponen(rect, zonaGrid, MARGEN_GRID);
      const chocaConOtra = colocadas.some((otra) => seSuperponen(rect, otra, MARGEN_ENTRE_IMAGENES));

      if (!chocaConGrid && !chocaConOtra) {
        mejorRect = rect;
        break;
      }
    }

    // Si no encontró un hueco libre tras varios intentos, se omite en
    // vez de forzarla encima de otra cosa.
    if (!mejorRect) return;

    colocadas.push(mejorRect);

    const img = document.createElement("img");
    img.src = ruta;
    img.alt = "";
    img.loading = "lazy";
    img.style.width = `${ancho}px`;
    img.style.top = `${mejorRect.top}px`;
    img.style.left = `${mejorRect.left}px`;
    img.style.transform = `rotate(${numeroAleatorio(-8, 8)}deg)`;

    capa.appendChild(img);
  });
}

window.addEventListener("load", colocarDecoraciones);

// Al pulsar el "+" de una tarjeta, esta se expande dentro del mismo
// grid (empujando lo que esté debajo) y muestra el contenido que
// hayas escrito en su .card__content dentro del HTML.
document.querySelectorAll(".card__plus").forEach((boton) => {
  boton.addEventListener("click", () => {
    const abierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", String(!abierto));
    boton.textContent = abierto ? "+" : "×";
  });
});