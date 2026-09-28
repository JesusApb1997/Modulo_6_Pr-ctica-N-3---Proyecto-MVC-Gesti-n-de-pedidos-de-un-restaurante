import { usePedidos } from "../hooks/usePedidos.js";
import {
  ETIQUETAS_ESTADO,
  FLUJO_ESTADOS,
  formatearPrecio,
  idCorto,
  resumirItems,
} from "../utils/formato.js";

/**
 * Pedidos en cocina: lista los pedidos registrados en MongoDB Atlas
 * (GET /api/pedidos) y permite avanzar estado, cancelar o borrar.
 */
export default function Cocina({ pedidos, onAccion, onError }) {
  const { cargando, avanzar, borrar } = usePedidos({ onSuccess: onAccion, onError });

  if (pedidos.length === 0) {
    return (
      <div className="pedidos">
        <p className="pedidos__cargando">
          Todavía no hay pedidos. ¡Crea el primero desde la carta!
        </p>
      </div>
    );
  }

  const manejarAvance = async (pedido, estado) => {
    await avanzar(pedido._id, estado);
    onAccion(
      `Pedido ${idCorto(pedido._id)} → ${ETIQUETAS_ESTADO[estado]}`,
    );
  };

  return (
    <div className="pedidos">
      {pedidos.map((pedido) => {
        const siguiente = FLUJO_ESTADOS[pedido.estado];
        const finalizado =
          pedido.estado === "ENTREGADO" || pedido.estado === "CANCELADO";

        return (
          <article key={pedido._id} className={`pedido estado-${pedido.estado}`}>
            <div className="pedido__cabecera">
              <span className="pedido__id">{idCorto(pedido._id)}</span>
              <span className={`pedido__estado estado-${pedido.estado}`}>
                {ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}
              </span>
            </div>

            <ul className="pedido__items">
              {resumirItems(pedido.menus).map((item) => (
                <li key={item.nombre}>
                  {item.cantidad} × {item.nombre} — {formatearPrecio(item.subtotal)}
                </li>
              ))}
            </ul>

            <div>
              Total: <span className="pedido__total">{formatearPrecio(pedido.total)}</span>
            </div>

            {pedido.observaciones && (
              <div className="pedido__observaciones">📝 {pedido.observaciones}</div>
            )}

            <div className="pedido__acciones">
              {siguiente && (
                <button
                  type="button"
                  className="boton boton--estado"
                  disabled={cargando}
                  onClick={() => manejarAvance(pedido, siguiente)}
                >
                  → {ETIQUETAS_ESTADO[siguiente]}
                </button>
              )}
              {!finalizado && (
                <button
                  type="button"
                  className="boton boton--estado boton--peligro"
                  disabled={cargando}
                  onClick={() => manejarAvance(pedido, "CANCELADO")}
                >
                  ✕ Cancelar
                </button>
              )}
              <button
                type="button"
                className="boton boton--estado boton--peligro"
                disabled={cargando}
                onClick={async () => {
                  await borrar(pedido._id);
                  onAccion(`Pedido ${idCorto(pedido._id)} eliminado.`);
                }}
              >
                🗑 Borrar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
