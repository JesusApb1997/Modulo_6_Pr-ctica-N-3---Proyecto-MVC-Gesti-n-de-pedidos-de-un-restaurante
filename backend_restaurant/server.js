import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import categoriaRouter from "./routes/categoriasRoutes.js";
import menuRouter from "./routes/menuRoutes.js";
import pedidoRouter from "./routes/pedidosRoutes.js";

const app = express();

// El .env es la fuente autoritativa de configuración (sobrescribe variables
// del sistema como PORT). Debe ejecutarse antes de leer process.env.
dotenv.config({ override: true });

const PORT = process.env.PORT || 3000;
const BASE_API_PATH = process.env.BASE_API_PATH || "/api/";

// Middlewares
app.use(cors()); // Permite que el frontend (otro puerto) consuma la API
app.use(express.json());

db();

app.get("/", (req, res) => {
  res.send("API de Restaurante v1.0 funcionando.");
});

// Endpoint de salud: útil para verificar que el backend y la BD responden
const mongooseReady = () => mongoose.connection.readyState === 1;

app.get(`${BASE_API_PATH}salud`, (req, res) => {
  const estadoBD = mongooseReady() ? "conectada" : "desconectada";
  res.json({
    mensaje: "API de Restaurante v1.0 funcionando.",
    base_datos: estadoBD,
    timestamp: new Date().toISOString(),
  });
});

// Montaje de las rutas bajo la ruta base definida en .env (BASE_API_PATH=/api/)
app.use(`${BASE_API_PATH}categorias`, categoriaRouter);
app.use(`${BASE_API_PATH}menus`, menuRouter);
app.use(`${BASE_API_PATH}pedidos`, pedidoRouter);

app.listen(PORT, () => {
  console.log(` Servidor Express escuchando en el puerto ${PORT}`);
});
