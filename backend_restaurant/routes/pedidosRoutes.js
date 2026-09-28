import { Router } from "express";
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido,
} from "../controllers/pedidosController.js";

const pedidoRouter = Router();

// Rutas de pedidos (la lógica vive en controllers/pedidosController.js)
pedidoRouter.get("/", obtenerPedidos);
pedidoRouter.get("/:id", obtenerPedidoPorId);
pedidoRouter.post("/", crearPedido);
pedidoRouter.put("/estado/:id", actualizarEstadoPedido);
pedidoRouter.delete("/:id", eliminarPedido);

export default pedidoRouter;
