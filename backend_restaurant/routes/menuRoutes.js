import { Router } from "express";
import {
  obtenerMenus,
  obtenerMenuPorId,
  crearMenu,
  actualizarMenu,
  desactivarMenu,
  activarMenu,
  eliminarMenu,
} from "../controllers/menusController.js";

const menuRouter = Router();

// Rutas de menús (la lógica vive en controllers/menusController.js)
menuRouter.get("/", obtenerMenus);
menuRouter.get("/:id", obtenerMenuPorId);
menuRouter.post("/", crearMenu);
menuRouter.put("/:id", actualizarMenu);
menuRouter.put("/no-disponible/:id", desactivarMenu);
menuRouter.put("/disponible/:id", activarMenu);
menuRouter.delete("/:id", eliminarMenu);

export default menuRouter;
