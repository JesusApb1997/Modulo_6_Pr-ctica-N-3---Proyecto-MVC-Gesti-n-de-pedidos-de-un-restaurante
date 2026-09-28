import axios from "axios";

/**
 * Servicio central de comunicación con el backend (Express + MongoDB Atlas).
 *
 * axios está configurado con una INSTANCIA única:
 * - baseURL "/api": Vite la proxy-ea al backend en http://localhost:3000
 *   (ver vite.config.js). Si tu backend corre en otro sitio, cambia el
 *   proxy en vite.config.js o define VITE_API_URL en un archivo .env.
 * - timeout de 8 s para no colgar la interfaz si el backend no responde.
 */
const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

/** Extrae el mensaje de error que envía el backend (o uno genérico). */
function mensajeError(error) {
  if (!error.response) {
    return "No se pudo conectar con el backend. ¿Está corriendo `npm run dev` en backend_restaurant?";
  }
  return (
    error.response.data?.message ||
    error.response.data?.mensaje ||
    "Ocurrió un error inesperado."
  );
}

/* ===================== SALUD ===================== */

/** GET /api/salud — estado del backend y de la conexión a MongoDB Atlas */
export async function saludAPI() {
  const { data } = await instancia.get("/salud");
  return data;
}

/* ===================== MENÚS ===================== */

/** GET /api/menus — carta completa desde MongoDB Atlas */
export async function obtenerMenus() {
  const { data } = await instancia.get("/menus");
  return data;
}

/* ===================== PEDIDOS ===================== */

/** GET /api/pedidos — pedidos activos (cocina) */
export async function obtenerPedidos() {
  const { data } = await instancia.get("/pedidos");
  return data;
}

/** POST /api/pedidos — registra el pedido (nace PENDIENTE en Atlas) */
export async function crearPedido(menus, observaciones) {
  const { data } = await instancia.post("/pedidos", { menus, observaciones });
  return data;
}

/** PUT /api/pedidos/estado/:id — cambia el estado de un pedido */
export async function cambiarEstadoPedido(id, estado) {
  const { data } = await instancia.put(`/pedidos/estado/${id}`, { estado });
  return data;
}

/** DELETE /api/pedidos/:id — borrado lógico del pedido */
export async function eliminarPedido(id) {
  const { data } = await instancia.delete(`/pedidos/${id}`);
  return data;
}

export { mensajeError };
