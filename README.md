# 🍕 Jesus Italian Food — Proyecto MVC "Gestión de pedidos de un restaurante"

Proyecto completo del **Módulo 6.2**: aplicación MVC con backend (Node.js + Express +
MongoDB Atlas) y **frontend en React (Vite)** que se comunica con la API mediante
**axios**, para la gestión de categorías, menús y pedidos de un restaurante.

---

## 📁 Estructura del proyecto

```
Restaurante_Italiano/
│
├── backend_restaurant/          # BACKEND (API REST) — puerto 3000
│   ├── config/
│   │   └── db.js                # Conexión a MongoDB Atlas (con fallback DNS)
│   ├── controllers/             # 🎮 CONTROLADORES (lógica de negocio)
│   │   ├── categoriasController.js
│   │   ├── menusController.js
│   │   └── pedidosController.js
│   ├── models/                  # 📦 MODELOS (esquemas de Mongoose)
│   │   ├── Categoria.js
│   │   ├── Menu.js
│   │   └── Pedido.js
│   ├── routes/                  # 🛣️ RUTAS (definición de endpoints)
│   │   ├── categoriasRoutes.js
│   │   ├── menuRoutes.js
│   │   └── pedidosRoutes.js
│   ├── server.js                # Servidor Express (CORS + rutas)
│   ├── package.json             # Dependencias propias del backend
│   └── .env                     # Variables de entorno (URI de Atlas, puerto)
│
├── frontend_restaurant/         # FRONTEND REACT (Vite) — puerto 3001
│   ├── index.html               # Punto de entrada HTML (monta #root)
│   ├── vite.config.js           # Vite: puerto 3001 + proxy /api → backend
│   ├── package.json             # Dependencias propias (react, axios, vite)
│   └── src/
│       ├── main.jsx             # Entry point de React (createRoot)
│       ├── App.jsx              # Componente raíz (estado global de la app)
│       ├── assets/
│       │   └── logo.svg         # Logo de Jesus Italian Food
│       ├── components/          # 🧩 COMPONENTES DE INTERFAZ
│       │   ├── Header.jsx       # Logo + indicador de conexión
│       │   ├── Banner.jsx       # Avisos de éxito/error
│       │   ├── Carta.jsx        # Carta del día (checkboxes)
│       │   ├── FormularioPedido.jsx  # Nuevo pedido (total en vivo)
│       │   ├── Cocina.jsx       # Pedidos y cambio de estado
│       │   └── Footer.jsx
│       ├── hooks/
│       │   └── usePedidos.js    # Hook: enviar/avanzar/borrar pedidos
│       ├── services/
│       │   └── api.js           # 📡 axios: TODA la comunicación con el backend
│       ├── styles/
│       │   └── index.css        # Estilos globales (paleta italiana)
│       └── utils/
│           └── formato.js       # Precios, estados, resumen de items
│
└── README.md
```

> ✅ **Cada carpeta tiene sus dependencias instaladas de forma individual**
> (cada una con su propio `package.json` y `node_modules`), y se comunican
> entre sí mediante **HTTP + axios**.

---

## 🚀 Cómo ejecutar el proyecto

Necesitas **Node.js 18+** instalado. Abre **dos terminales**:

### Terminal 1 — Backend (API + MongoDB Atlas)

```bash
cd backend_restaurant
npm install      # instala express, mongoose, dotenv, cors, nodemon
npm run dev      # arranca con nodemon en http://localhost:3000
```

Deberías ver:

```
 Servidor Express escuchando en el puerto 3000
 Conexión a MongoDB establecida correctamente.
```

### Terminal 2 — Frontend (React + Vite)

```bash
cd frontend_restaurant
npm install      # instala react, react-dom, axios, vite
npm run dev      # arranca Vite en http://localhost:3001
```

Abre en el navegador: **http://localhost:3001/**

> 💡 Si en la cabecera ves el punto verde con
> **"Backend + MongoDB Atlas conectados"**, todo funciona.
>
> ⚙️ **¿Cómo sabe React dónde está el backend?** Vite reenvía (proxy) toda
> petición a `/api` hacia `http://localhost:3000` (ver `vite.config.js`).
> Si tu backend corre en otro host/puerto, cambia el `target` del proxy
> o define `VITE_API_URL` en `frontend_restaurant/.env` (ej.
> `VITE_API_URL=http://192.168.1.50:3000/api`).

### Build de producción (opcional)

```bash
cd frontend_restaurant
npm run build    # genera la carpeta dist/ optimizada
npm run preview  # sirve el build en un puerto local
```

---

## 🗄️ Base de datos (MongoDB Atlas)

El backend se conecta a **MongoDB Atlas** con la cadena guardada en
`backend_restaurant/.env`:

```
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/Restaurante?retryWrites=true&w=majority
PORT=3000
BASE_API_PATH=/api/
```

- Las colecciones `categorias`, `menus` y `pedidos` se crean **automáticamente**
  en la base de datos `Restaurante` al insertar el primer documento.
- En **Network Access** de Atlas debe estar tu IP (o `0.0.0.0/0`).
- `config/db.js` incluye un *fallback* con DNS públicos (1.1.1.1 / 8.8.8.8) por
  si tu router rechaza las consultas SRV de Atlas (error `querySrv ECONNREFUSED`).

---

## 🧩 Arquitectura MVC del backend

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| **Modelo** | `models/` | Esquemas de Mongoose (Categoria, Menu, Pedido) |
| **Vista** | Responde **JSON** (es una API REST; la vista es el frontend React) |
| **Controlador** | `controllers/` | Lógica de negocio (validaciones, totales, estados) |
| **Ruta** | `routes/` | Define los endpoints y delega en los controladores |

---

## 🔗 Endpoints de la API

Base URL: `http://localhost:3000/api`

### Salud del sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/salud` | Estado del backend y de la conexión a la BD |

### Categorías

| Método | Endpoint | Body (JSON) |
|--------|----------|-------------|
| GET | `/api/categorias` | — |
| POST | `/api/categorias` | `{ "nombre": "Pizzas" }` |
| PUT | `/api/categorias/:id` | `{ "nombre": "Pizzas Artesanales" }` |
| DELETE | `/api/categorias/:id` | — (borrado lógico; rechazado si tiene menús) |

### Menús

| Método | Endpoint | Body (JSON) |
|--------|----------|-------------|
| GET | `/api/menus` | — |
| GET | `/api/menus/:id` | — |
| POST | `/api/menus` | `{ "nombre": "Pizza Margarita", "precio": 12.5, "categoria": "<idCategoria>" }` |
| PUT | `/api/menus/:id` | `{ "nombre": "...", "precio": 14, "categoria": "<idCategoria>" }` |
| PUT | `/api/menus/no-disponible/:id` | — (desactiva el menú) |
| PUT | `/api/menus/disponible/:id` | — (reactiva el menú) |
| DELETE | `/api/menus/:id` | — (borrado lógico) |

### Pedidos

| Método | Endpoint | Body (JSON) |
|--------|----------|-------------|
| GET | `/api/pedidos` | — |
| GET | `/api/pedidos/:id` | — |
| POST | `/api/pedidos` | `{ "menus": ["<idMenu1>", "<idMenu2>"], "observaciones": "Sin cebolla" }` |
| PUT | `/api/pedidos/estado/:id` | `{ "estado": "EN_PREPARACION" }` |
| DELETE | `/api/pedidos/:id` | — (borrado lógico) |

### Reglas de negocio (según la práctica)

- ✅ Los **pedidos** se registran por defecto como **`PENDIENTE`**.
- ✅ Los **menús** se crean por defecto como **`disponibles`**.
- ✅ **Estados válidos del pedido:** `PENDIENTE`, `EN_PREPARACION`, `LISTO`,
  `ENTREGADO`, `CANCELADO`.
- ✅ El **total** del pedido se calcula en el servidor (precio × cantidad).
- ✅ No se puede pedir un plato **no disponible**.
- ✅ No se puede borrar una categoría que tenga **menús asociados**.
- ✅ **Borrado lógico** (campo `fecha_eliminado`) en los 3 modelos.

---

## 🧪 Cómo hacer las peticiones en Postman

### 1. Configura el entorno

En Postman crea una petición y usa como URL base:

```
http://localhost:3000/api
```

En peticiones con body, ve a la pestaña **Body → raw → JSON** y escribe el JSON
indicado en las tablas de arriba. IMPORTANTE: el header
`Content-Type: application/json` lo añade Postman automáticamente al elegir
*raw + JSON*.

### 2. Orden sugerido de prueba

1. **Crear una categoría**
   - `POST http://localhost:3000/api/categorias`
   - Body: `{ "nombre": "Pizzas" }`
   - Copia el `_id` de la respuesta (ej. `"6abaeac69d45067929b8c0e9"`).

2. **Crear un menú** (usa el `_id` de la categoría)
   - `POST http://localhost:3000/api/menus`
   - Body:
     ```json
     {
       "nombre": "Pizza Margarita",
       "precio": 12.5,
       "categoria": "PEGA_AQUI_EL_ID_DE_LA_CATEGORIA"
     }
     ```
   - Copia el `_id` del menú.

3. **Crear un pedido** (usa el `_id` del menú; repite el ID para pedir 2 unidades)
   - `POST http://localhost:3000/api/pedidos`
   - Body:
     ```json
     {
       "menus": ["PEGA_AQUI_EL_ID_DEL_MENU", "PEGA_AQUI_EL_ID_DEL_MENU"],
       "observaciones": "Sin cebolla, para llevar"
     }
     ```
   - El backend responde con el **total calculado** y `estado: "PENDIENTE"`.

4. **Cambiar el estado del pedido**
   - `PUT http://localhost:3000/api/pedidos/estado/PEGA_AQUI_EL_ID_DEL_PEDIDO`
   - Body: `{ "estado": "EN_PREPARACION" }`

5. **Consultar todo**
   - `GET http://localhost:3000/api/pedidos` → verás los pedidos con los menús
     "poblados" (nombre y precio de cada plato).
   - `GET http://localhost:3000/api/salud` → comprueba la conexión a Atlas.

### 3. Ejemplos de respuesta

**POST /api/pedidos → 201**
```json
{
  "mensaje": "Pedido creado con éxito.",
  "pedidoCreado": {
    "_id": "6abaeae39d45067929b8c103",
    "menus": [
      { "_id": "6a99db8990c50ff121e345ed", "nombre": "Pizza Margarita", "precio": 12.5 },
      { "_id": "6abaead29d45067929b8c0fe", "nombre": "Tiramisu", "precio": 6 }
    ],
    "total": 24.5,
    "estado": "PENDIENTE",
    "observaciones": "Sin cebolla, para llevar"
  }
}
```

**Estado inválido → 400**
```json
{ "message": "Estado inválido. Use uno de: PENDIENTE, EN_PREPARACION, LISTO, ENTREGADO, CANCELADO" }
```

---

## ⚛️ ¿Cómo se conecta React con el backend?

Toda la comunicación vive en `frontend_restaurant/src/services/api.js`, con una
**instancia de axios** única:

```js
// Instancia central (baseURL "/api" → el proxy de Vite la lleva al puerto 3000)
const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 8000,
});

// Cargar la carta (GET)
const { data } = await instancia.get("/menus");

// Enviar un pedido (POST) — nace PENDIENTE en MongoDB Atlas
await instancia.post("/pedidos", { menus: [...], observaciones: "..." });

// Cambiar estado (PUT)
await instancia.put(`/pedidos/estado/${id}`, { estado: "LISTO" });

// Borrar pedido (DELETE, borrado lógico)
await instancia.delete(`/pedidos/${id}`);
```

Los componentes React usan esos servicios (directamente o con el hook
`usePedidos`) y el estado se gestiona con `useState`/`useEffect` en `App.jsx`.
El backend tiene **CORS habilitado**; además, el proxy de Vite evita cualquier
problema de orígenes en desarrollo.

---

## ✅ Cumplimiento de la práctica (PDF Módulo 6.2)

| Requisito del PDF | Estado |
|---|---|
| Proyecto MVC completo a partir del backend del módulo 5 | ✅ Modelos + Controladores + Rutas separados |
| Gestión de categorías (pizzas, hamburguesas, pastas…) | ✅ CRUD completo |
| Gestión del menú: añadir, actualizar, desactivar y reactivar | ✅ CRUD + `disponible/no-disponible` |
| Gestión de pedidos: obtener todos (cocina), crear y actualizar estado | ✅ CRUD + `/estado/:id` |
| Habilitar el borrado para cada modelo | ✅ Borrado lógico en los 3 modelos |
| Estados del pedido: pendiente, en preparación, listo, entregado, cancelado | ✅ Enum validado |
| Pedidos por defecto "Pendiente" | ✅ Default `PENDIENTE` |
| Menús por defecto "disponibles" | ✅ Default `disponible: true` |
| Cada menú posee un precio | ✅ Campo obligatorio `precio` |
| Debe funcionar tras `npm install` y `npm run dev` | ✅ Verificado en ambas carpetas |
