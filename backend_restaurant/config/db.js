import mongoose from "mongoose";
import dns from "dns";
// Cargar variables de entorno del archivo .env
// Es buena práctica asegurarse de que .env se cargue al inicio de la app
import "dotenv/config";

/**
 * Fallback de DNS para MongoDB Atlas.
 *
 * Algunos routers/redes domésticas rechazan las consultas DNS de tipo SRV
 * (error típico: `querySrv ECONNREFUSED _mongodb._tcp.cluster0...`) que el
 * driver de Atlas necesita para resolver `mongodb+srv://`.
 * Si el DNS del sistema falla, reintentamos la conexión usando servidores
 * DNS públicos (Cloudflare 1.1.1.1 y Google 8.8.8.8).
 */
async function conectarConFallbackDNS(uri) {
  try {
    await mongoose.connect(uri);
    return true;
  } catch (error) {
    const esProblemaDNS =
      error?.cause?.code?.startsWith("querySrv") ||
      error?.code?.startsWith("querySrv") ||
      /querySrv/i.test(error?.message || "");

    if (!esProblemaDNS) throw error; // No es DNS: propagar el error real

    console.warn(
      " ⚠ El DNS del sistema rechazó la consulta SRV de Atlas (querySrv). Reintentando con DNS públicos (1.1.1.1, 8.8.8.8)…"
    );
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await mongoose.connect(uri);
    return true;
  }
}

// La URI de conexión de MongoDB se obtiene de las variables de entorno
const DB_URI = process.env.MONGODB_URI;

if (!DB_URI) {
  console.error(
    " ERROR: La variable de entorno MONGODB_URI no está definida en .env"
  );
  process.exit(1); // Sale de la aplicación si no hay URI
}

/**
 * Función para establecer la conexión a MongoDB
 */
const db = async () => {
  try {
    await conectarConFallbackDNS(DB_URI);
    console.log(" Conexión a MongoDB establecida correctamente.");
    // Manejo de eventos de la conexión
    mongoose.connection.on("error", (err) => {
      console.error(
        " Error en la conexión de MongoDB después del intento inicial:",
        err
      );
    });
    mongoose.connection.on("disconnected", () => {
      console.warn(" Mongoose se ha desconectado de MongoDB.");
    });
  } catch (error) {
    console.error(" Error fatal al intentar conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

export default db;
