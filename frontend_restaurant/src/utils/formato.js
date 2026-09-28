/** Utilidades de formato compartidas por los componentes. */

/** 12.5 → "12.50 €" */
export function formatearPrecio(valor) {
  return `${Number(valor || 0).toFixed(2)} €`;
}

/** Abreviatura corta del ID de MongoDB: #B8C11C */
export function idCorto(id) {
  return `#${String(id).slice(-6).toUpperCase()}`;
}

/** Etiquetas legibles de los estados del pedido. */
export const ETIQUETAS_ESTADO = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

/** Flujo normal de avance de un pedido en cocina. */
export const FLUJO_ESTADOS = {
  PENDIENTE: "EN_PREPARACION",
  EN_PREPARACION: "LISTO",
  LISTO: "ENTREGADO",
};

/** Nombre de la categoría de un menú (venga poblado o no). */
export function nombreCategoria(plato) {
  if (!plato.categoria) return "Sin categoría";
  return typeof plato.categoria === "object" ? plato.categoria.nombre : "Categoría";
}

/**
 * Resumen de platos de un pedido: agrupa repetidos.
 * [{nombre, precio}, {nombre, precio}] → [{nombre, precio, cantidad, subtotal}]
 */
export function resumirItems(menus = []) {
  const resumen = new Map();
  for (const m of menus) {
    const esPoblado = typeof m === "object";
    const nombre = esPoblado ? m.nombre : "Plato";
    const precio = esPoblado ? m.precio : 0;
    const actual = resumen.get(nombre) || { nombre, precio, cantidad: 0 };
    actual.cantidad += 1;
    resumen.set(nombre, actual);
  }
  return [...resumen.values()].map((item) => ({
    ...item,
    subtotal: item.precio * item.cantidad,
  }));
}
