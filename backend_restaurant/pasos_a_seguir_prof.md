# API Restaurante — Gestor de pedidos

Proyecto backend del módulo 5.4: API RESTful con Node.js, Express, Mongoose y ES6 Modules.

##  Estructura del proyecto

```
config/db.js               # Conexión a MongoDB
models/Categoria.js        # Modelo Categoría
models/Menu.js             # Modelo Menú
models/Pedido.js           # Modelo Pedido
routes/categoriasRoutes.js # Rutas + lógica de Categorías
routes/menuRoutes.js       # Rutas + lógica de Menú
routes/pedidosRoutes.js    # Rutas + lógica de Pedidos
server.js                  # Servidor Express
.env                       # Variables de entorno
```

## 🔌 Paso 1: Obtener la cadena de conexión de MongoDB Atlas

1. Entra a https://cloud.mongodb.com e inicia sesión.
2. Ve a **Database** (menú izquierdo) → clic en **Connect** en tu clúster **Cluster0**.
3. Elige **Drivers**.
4. Copia la cadena que se muestra, por ejemplo:
   ```
   mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Reemplaza:**
   - `<usuario>` y `<password>` por el usuario/contraseña de tu base de datos (crea uno en **Database Access** si no tienes).
   - Añade el nombre de tu base de datos después del host, antes del `?`: `/Restaurante`
   
   Resultado final:
   ```
   mongodb+srv://miUsuario:miPassword@cluster0.xxxxx.mongodb.net/Restaurante?retryWrites=true&w=majority
   ```
6. En **Network Access** asegúrate de tener tu IP agregada (o `0.0.0.0/0` para permitir desde cualquier lugar).

> 💡 Las colecciones `categorias`, `menus` y `pedidos` se crean automáticamente en la base de datos **Restaurante** la primera vez que insertas un documento desde la API. No necesitas crearlas a mano en Atlas.

## ⚙️ Paso 2: Configurar el archivo .env

Abre el archivo `.env` y pega tu cadena de conexión real en la variable `MONGODB_URI`:

```
MONGODB_URI=mongodb+srv://miUsuario:miPassword@cluster0.xxxxx.mongodb.net/Restaurante?retryWrites=true&w=majority
PORT=3000
BASE_API_PATH=/api/
```

## 🚀 Paso 3: Ejecutar el proyecto

```bash
npm install      # instala dependencias (solo la primera vez)
npm run dev      # arranca con nodemon (reinicia solo al guardar)
# o
npm start        # arranca sin nodemon
```

Deberías ver:

```
 Conexión a MongoDB establecida correctamente.
 Servidor Express escuchando en el puerto 3000
```

## 🔎 Paso 4: Probar los endpoints en Postman

Base URL: `http://localhost:3000/api`

### Categorías
| Método | Endpoint | Body (JSON) |
|---|---|---|
| GET | `/api/categorias` | — |
| POST | `/api/categorias` | `{ "nombre": "Pizzas" }` |
| PUT | `/api/categorias/:id` | `{ "nombre": "Pizzas Artesanales" }` |
| DELETE | `/api/categorias/:id` | — |

### Menú
| Método | Endpoint | Body (JSON) |
|---|---|---|
| GET | `/api/menus` | — |
| GET | `/api/menus/:id` | — |
| POST | `/api/menus` | `{ "nombre": "Pizza Margarita", "precio": 12.5, "categoria": "<idCategoria>" }` |
| PUT | `/api/menus/:id` | `{ "nombre": "...", "precio": 14, "categoria": "<idCategoria>" }` |
| PUT | `/api/menus/no-disponible/:id` | — (desactiva el menú) |
| PUT | `/api/menus/disponible/:id` | — (reactiva el menú) |
| DELETE | `/api/menus/:id` | — (borrado lógico) |

### Pedidos
| Método | Endpoint | Body (JSON) |
|---|---|---|
| GET | `/api/pedidos` | — |
| GET | `/api/pedidos/:id` | — |
| POST | `/api/pedidos` | `{ "menus": ["<idMenu1>", "<idMenu2>"], "observaciones": "Sin cebolla" }` |
| PUT | `/api/pedidos/estado/:id` | `{ "estado": "EN_PREPARACION" }` |
| DELETE | `/api/pedidos/:id` | — (borrado lógico) |

**Estados válidos del pedido:** `PENDIENTE` (por defecto), `EN_PREPARACION`, `LISTO`, `ENTREGADO`, `CANCELADO`.

### Orden sugerido de prueba
1. `POST /api/categorias` → crea "Pizzas" y copia el `_id`.
2. `POST /api/menus` → crea un plato usando el `_id` de la categoría.
3. `POST /api/pedidos` → crea un pedido con el `_id` del menú (el total se calcula solo).
4. `PUT /api/pedidos/estado/:id` → cambia el estado del pedido.
5. `GET /api/pedidos` → observa cómo viene poblado el nombre y precio de cada menú.