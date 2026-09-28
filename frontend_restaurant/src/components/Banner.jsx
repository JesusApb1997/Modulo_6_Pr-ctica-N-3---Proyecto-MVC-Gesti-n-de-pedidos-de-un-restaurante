/**
 * Banner de avisos (éxito / error / información).
 * Se muestra temporalmente tras cada operación contra la API.
 */
export default function Banner({ banner }) {
  if (!banner) return null;
  return <div className={`banner banner--${banner.tipo}`}>{banner.texto}</div>;
}
