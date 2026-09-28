import logo from "../assets/logo.svg";

const TEXTO_ESTADO = {
  conectando: "Conectando con el backend…",
  ok: "Backend + MongoDB Atlas conectados",
  error: "Backend no disponible",
};

/**
 * Cabecera: logo, nombre del restaurante y estado de la conexión.
 */
export default function Header({ estadoConexion, onRecargar }) {
  return (
    <header className="cabecera">
      <div className="cabecera__marca">
        <img src={logo} alt="Logo Jesus Italian Food" className="cabecera__logo" />
        <div>
          <h1 className="cabecera__titulo">Jesus Italian Food</h1>
          <p className="cabecera__subtitulo">Gestión de pedidos del restaurante</p>
        </div>
      </div>
      <div className="cabecera__estado">
        <span
          className={`estado__punto estado__punto--${
            estadoConexion === "ok" ? "ok" : estadoConexion === "error" ? "error" : "desconocido"
          }`}
        />
        <span className="estado__texto">{TEXTO_ESTADO[estadoConexion]}</span>
        <button type="button" className="boton boton--secundario" onClick={onRecargar}>
          ↻ Recargar
        </button>
      </div>
    </header>
  );
}
