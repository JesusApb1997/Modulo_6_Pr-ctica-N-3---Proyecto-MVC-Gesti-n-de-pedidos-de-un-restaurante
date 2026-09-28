import { Router } from "express";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriasController.js";

const categoriaRouter = Router();

// Rutas de categorías (la lógica vive en controllers/categoriasController.js)
categoriaRouter.get("/", obtenerCategorias);
categoriaRouter.post("/", crearCategoria);
categoriaRouter.put("/:id", actualizarCategoria);
categoriaRouter.delete("/:id", eliminarCategoria);

export default categoriaRouter;
