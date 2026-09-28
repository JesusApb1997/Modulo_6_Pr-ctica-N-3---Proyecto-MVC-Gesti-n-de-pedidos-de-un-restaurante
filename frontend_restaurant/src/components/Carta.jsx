import { formatearPrecio, nombreCategoria } from "../utils/formato.js";

/**
 * Carta del día: lista los menús disponibles (GET /api/menus) con
 * casillas para seleccionarlos. El total se recalcula en vivo.
 */
export default function Carta({ platos, seleccion, onAlternar, onLimpiarSeleccion }) {
  if (platos.length === 0) {
    return (
      <div className="platos">
        <p className="platos__vacio">
          No hay platos disponibles. Crea menús desde Postman (ver README,
          sección "Cómo hacer las peticiones en Postman").
        </p>
      </div>
    );
  }

  return (
    <div className="platos">
      {platos.map((plato) => (
        <label
          key={plato._id}
          className={`plato ${seleccion.includes(plato._id) ? "plato--seleccionado" : ""}`}
        >
          <input
            type="checkbox"
            checked={seleccion.includes(plato._id)}
            onChange={() => onAlternar(plato._id)}
          />
          <div className="plato__info">
            <div className="plato__nombre">{plato.nombre}</div>
            <div className="plato__categoria">{nombreCategoria(plato)}</div>
          </div>
          <div className="plato__precio">{formatearPrecio(plato.precio)}</div>
        </label>
      ))}
      {seleccion.length > 0 && (
        <button
          type="button"
          className="boton boton--secundario boton--limpiar"
          onClick={onLimpiarSeleccion}
        >
          Limpiar selección ({seleccion.length})
        </button>
      )}
    </div>
  );
}
