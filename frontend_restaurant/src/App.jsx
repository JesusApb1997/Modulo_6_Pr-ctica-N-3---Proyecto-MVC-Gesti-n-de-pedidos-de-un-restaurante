import { useCallback, useEffect, useState } from "react";
import { saludAPI, obtenerMenus, obtenerPedidos } from "./services/api.js";
import Header from "./components/Header.jsx";
import Banner from "./components/Banner.jsx";
import Carta from "./components/Carta.jsx";
import FormularioPedido from "./components/FormularioPedido.jsx";
import Cocina from "./components/Cocina.jsx";
import Footer from "./components/Footer.jsx";

/**
 * Componente raíz de la aplicación.
 *
 * Centraliza el estado compartido entre secciones:
 * - conexión con el backend y MongoDB Atlas
 * - carta (menús disponibles)
 * - selección actual del cliente
 * - pedidos en cocina
 */
export default function App() {
  const [estadoConexion, setEstadoConexion] = useState("conectando"); // conectando | ok | error
  const [platos, setPlatos] = useState([]);
  const [seleccion, setSeleccion] = useState([]); // IDs de menú marcados
  const [pedidos, setPedidos] = useState([]);
  const [banner, setBanner] = useState(null); // { tipo, texto }

  const mostrarBanner = useCallback((tipo, texto, duracion = 4000) => {
    setBanner({ tipo, texto });
    if (duracion > 0) {
      setTimeout(() => setBanner(null), duracion);
    }
  }, []);

  /** GET /api/menus — refresca la carta desde MongoDB Atlas */
  const refrescarCarta = useCallback(async () => {
    const data = await obtenerMenus();
    setPlatos((data.menu || []).filter((p) => p.disponible));
  }, []);

  /** GET /api/pedidos — refresca los pedidos en cocina */
  const refrescarPedidos = useCallback(async () => {
    const data = await obtenerPedidos();
    setPedidos(data.pedidos || []);
  }, []);

  /** Comprueba el backend y carga los datos iniciales */
  const cargarDatosIniciales = useCallback(async () => {
    setEstadoConexion("conectando");
    try {
      const salud = await saludAPI();
      setEstadoConexion(salud.base_datos === "conectada" ? "ok" : "error");
      await Promise.all([refrescarCarta(), refrescarPedidos()]);
    } catch {
      setEstadoConexion("error");
      setPlatos([]);
      setPedidos([]);
    }
  }, [refrescarCarta, refrescarPedidos]);

  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  return (
    <div className="aplicacion">
      <Header estadoConexion={estadoConexion} onRecargar={cargarDatosIniciales} />
      <Banner banner={banner} />
      <main className="contenido">
        <section className="panel">
          <h2 className="panel__titulo">🍕 Carta del día</h2>
          <p className="panel__descripcion">
            Platos disponibles ahora mismo (los menús desactivados no se
            muestran). Marca los platos que quieras y confirma tu pedido.
          </p>
          <Carta
            platos={platos}
            seleccion={seleccion}
            onAlternar={(id) =>
              setSeleccion((actual) =>
                actual.includes(id)
                  ? actual.filter((x) => x !== id)
                  : [...actual, id]
              )
            }
            onLimpiarSeleccion={() => setSeleccion([])}
          />
          <FormularioPedido
            platos={platos}
            seleccion={seleccion}
            onExito={async (mensaje) => {
              mostrarBanner("exito", mensaje);
              setSeleccion([]);
              await Promise.all([refrescarCarta(), refrescarPedidos()]);
            }}
            onError={(texto) => mostrarBanner("error", texto)}
          />
        </section>

        <section className="panel">
          <h2 className="panel__titulo">👨‍🍳 Pedidos en cocina</h2>
          <p className="panel__descripcion">
            Pedidos registrados en la base de datos. Cambia el estado con los
            botones.
          </p>
          <Cocina
            pedidos={pedidos}
            onAccion={async (mensaje) => {
              mostrarBanner("exito", mensaje, 2500);
              await refrescarPedidos();
            }}
            onError={(texto) => mostrarBanner("error", texto)}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
