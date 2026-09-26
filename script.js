:root {
  --bg: #182420;
  --card: #c1cfe0;
  --card-text: #223047;
  --accent: #34d399;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
}

/* .page envuelve todo el contenido real; las decoraciones se ubican
   dentro de ella para que crezcan junto con la página cuando una
   tarjeta se expande. */
.page {
  position: relative;
  padding: 48px 32px;
  overflow: hidden;
}

/* Capa de imágenes decorativas: no bloquea clics y va detrás del contenido. */
.floaties {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.floaties img {
  position: absolute;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  opacity: 0.85;
}

.hub-header,
.grid {
  position: relative;
  z-index: 1;
}

.hub-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
}

.accent-bar {
  width: 6px;
  height: 34px;
  border-radius: 3px;
  background: var(--accent);
}

.hub-header h1 {
  margin: 0;
  font-size: 1.9rem;
  font-weight: 700;
  color: #f4f6f5;
}

/* grid-auto-rows en vez de filas fijas: así, cuando una tarjeta se
   expande, esa fila crece y empuja lo que esté debajo, sin salirse
   del layout de la página. */
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: minmax(170px, auto);
  align-items: start;
  gap: 18px;
  max-width: 1100px;
}

.card {
  position: relative;
  grid-row: span 1;
  background: var(--card);
  border-radius: 20px;
  padding: 16px;
}

.card--data {
  grid-row: span 2;
}

.card__body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 138px; /* deja el mismo espacio vacío que en el diseño original */
}

.card--data .card__body {
  min-height: 326px;
}

.card__label {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--card-text);
  line-height: 1.2;
}

.card__plus {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #f4f6f5;
  color: var(--card-text);
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, background 0.2s ease;
}

.card__plus[aria-expanded="true"] {
  transform: rotate(45deg);
  background: var(--accent);
}

.card__plus:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

/* Técnica grid-template-rows 0fr -> 1fr: anima una altura "auto"
   de forma fluida, sin necesitar JS para calcular alturas. */
.card__content-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.card:has(> .card__plus[aria-expanded="true"]) .card__content-wrap {
  grid-template-rows: 1fr;
}

.card__content {
  overflow: hidden;
  color: var(--card-text);
  font-size: 0.95rem;
  line-height: 1.5;
}

.card__content p {
  margin: 10px 0 0;
}

@media (prefers-reduced-motion: reduce) {
  .card__content-wrap,
  .card__plus {
    transition: none !important;
  }
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .card--data {
    grid-row: span 1;
  }
  .card--data .card__body {
    min-height: 138px;
  }
}

/* Celulares: una sola columna, menos aire alrededor y tipografía
   ligeramente más chica para que todo entre bien en pantalla. */
@media (max-width: 480px) {
  .page {
    padding: 28px 16px;
  }

  .hub-header {
    margin-bottom: 28px;
    gap: 10px;
  }

  .hub-header h1 {
    font-size: 1.4rem;
  }

  .grid {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(120px, auto);
    gap: 14px;
  }

  .card__body,
  .card--data .card__body {
    min-height: 100px;
  }

  .card__label {
    font-size: 1.05rem;
  }

  .card__plus {
    width: 30px;
    height: 30px;
  }
}
