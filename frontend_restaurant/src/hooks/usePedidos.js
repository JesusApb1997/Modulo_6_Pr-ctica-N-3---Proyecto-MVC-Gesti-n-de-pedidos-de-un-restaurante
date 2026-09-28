import { useState } from "react";
import {
  crearPedido,
  cambiarEstadoPedido,
  eliminarPedido,
  mensajeError,
} from "../services/api.js";

/**
 * Hook personalizado: acciones de pedidos contra la API.
 *
 * Devuelve el estado de carga y tres operaciones que el resto de
 * componentes reutiliza (FormularioPedido y Cocina). Si una operación
 * falla, delega el mensaje en el manejador de errores recibido.
 */
export function usePedidos({ onSuccess, onError }) {
  const [cargando, setCargando] = useState(false);

  const ejecutar = async (accion, mensaje) => {
    setCargando(true);
    try {
      await accion();
      onSuccess?.(mensaje);
    } catch (error) {
      onError?.(mensajeError(error));
    } finally {
      setCargando(false);
    }
  };

  /** POST /api/pedidos */
  const enviar = (menus, observaciones) =>
    ejecutar(
      () => crearPedido(menus, observaciones),
      "✅ Pedido registrado como PENDIENTE en MongoDB Atlas."
    );

  /** PUT /api/pedidos/estado/:id */
  const avanzar = (id, estado) =>
    ejecutar(() => cambiarEstadoPedido(id, estado), null);

  /** DELETE /api/pedidos/:id */
  const borrar = (id) => ejecutar(() => eliminarPedido(id), null);

  return { cargando, enviar, avanzar, borrar };
}
