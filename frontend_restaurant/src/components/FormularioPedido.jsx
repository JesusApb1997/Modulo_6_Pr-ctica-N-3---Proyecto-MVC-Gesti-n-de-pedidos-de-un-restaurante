import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos.js";
import { formatearPrecio } from "../utils/formato.js";

/**
 * Formulario de nuevo pedido.
 * - Observaciones opcionales.
 * - Total calculado en vivo con los platos seleccionados.
 * - POST /api/pedidos mediante el hook usePedidos (axios).
 */
export default function FormularioPedido({ platos, seleccion, onExito, onError, onLimpiar }) {
  const [observaciones, setObservaciones] = useState("");
  const { cargando, enviar } = usePedidos({ onSuccess: onExito, onError });

  const total = seleccion.reduce((acum, id) => {
    const plato = platos.find((p) => p._id === id);
    return acum + (plato ? Number(plato.precio) : 0);
  }, 0);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (seleccion.length === 0) {
      onError("Selecciona al menos un plato de la carta.");
      return;
    }

    await enviar(seleccion, observaciones.trim() || undefined);
    setObservaciones("");
    onLimpiar?.();
  };

  return (
    <>
      <hr className="separador" />
      <form className="formulario" onSubmit={manejarEnvio} autoComplete="off">
        <h3 className="formulario__titulo">Nuevo pedido</h3>

        <label className="formulario__etiqueta" htmlFor="observaciones">
          Observaciones (opcional)
        </label>
        <input
          id="observaciones"
          className="formulario__campo"
          type="text"
          maxLength={120}
          placeholder="Ej: sin cebolla, para llevar…"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />

        <div className="formulario__fila">
          <span className="formulario__total">
            Total seleccionado: <strong>{formatearPrecio(total)}</strong>
          </span>
          <button
            type="submit"
            className="boton boton--primario"
            disabled={cargando}
          >
            {cargando ? "Enviando…" : "Enviar pedido"}
          </button>
        </div>
      </form>
    </>
  );
}
