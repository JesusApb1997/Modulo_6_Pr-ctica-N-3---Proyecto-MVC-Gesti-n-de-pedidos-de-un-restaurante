import Pedido from "../models/Pedido.js";
import Menu from "../models/Menu.js"; // Necesario para buscar precios

// Definición de estados válidos para validación
export const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "EN_PREPARACION",
  "LISTO",
  "ENTREGADO",
  "CANCELADO",
];

// =====================
// CONTROLADOR: PEDIDOS
// =====================

// 1. OBTENER todos los pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    // Usamos populate para devolver los detalles del menú
    const pedidos = await Pedido.find({ fecha_eliminado: null }).populate(
      "menus",
      "nombre precio"
    );
    return res.status(200).json({ mensaje: "Consulta exitosa", pedidos });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los pedidos", error: error.message });
  }
};

// 2. OBTENER un pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate(
      "menus",
      "nombre precio"
    );
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }
    return res.status(200).json({ mensaje: "Pedido encontrado.", pedido });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el pedido", error: error.message });
  }
};

// 3. CREAR un nuevo pedido (se registra como PENDIENTE por defecto)
export const crearPedido = async (req, res) => {
  try {
    const { menus, observaciones } = req.body;

    if (!menus || menus.length === 0) {
      return res
        .status(400)
        .json({ message: "El pedido debe contener menus (IDs de menú)." });
    }

    // 1. VALIDACIÓN Y CÁLCULO DEL TOTAL
    // Buscar todos los ítems de menú de una sola vez
    const uniqueMenuIds = [...new Set(menus.map((id) => id.toString()))];

    const menuItems = await Menu.find({
      _id: { $in: uniqueMenuIds },
    });

    // Verificación: si la cantidad de IDs solicitados no coincide con los ítems encontrados,
    // significa que uno o más IDs son inválidos.
    if (menuItems.length !== uniqueMenuIds.length) {
      return res.status(400).json({
        message:
          "Uno o más IDs de menú proporcionados no son válidos o no existen.",
      });
    }

    // Validación de negocio: no se puede pedir un plato no disponible
    const noDisponibles = menuItems.filter((m) => !m.disponible);
    if (noDisponibles.length > 0) {
      return res.status(400).json({
        message: `No se puede pedir: ${noDisponibles
          .map((m) => m.nombre)
          .join(", ")}. El plato no está disponible.`,
      });
    }

    // 2. Calcular el total
    // Mapeamos los IDs repetidos a un objeto para contar las cantidades de cada plato
    const menuCounts = menus.reduce((acc, id) => {
      const key = id.toString();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    let pedidoTotal = 0;

    // Iterar sobre los ítems encontrados y sumar el precio por la cantidad pedida
    for (const menu of menuItems) {
      const cantidad = menuCounts[menu._id.toString()];
      if (cantidad) {
        pedidoTotal += menu.precio * cantidad;
      }
    }

    const nuevoPedido = {
      menus,
      total: pedidoTotal, // Total calculado
      estado: "PENDIENTE", // Los pedidos por defecto se registran como PENDIENTE
      observaciones,
    };

    // 3. Crear el objeto final del pedido (menus será el array de IDs de menú)
    const pedidoCreado = await Pedido.create(nuevoPedido);

    // Devolver el pedido con los detalles del menú poblados
    const pedidoPoblado = await Pedido.findById(pedidoCreado._id).populate(
      "menus",
      "nombre precio"
    );

    return res
      .status(201)
      .json({ mensaje: "Pedido creado con éxito.", pedidoCreado: pedidoPoblado });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear el pedido", error: error.message });
  }
};

// 4. ACTUALIZAR el estado del pedido (PUT)
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;

    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        message: `Estado inválido. Use uno de: ${ESTADOS_VALIDOS.join(", ")}`,
      });
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    return res
      .status(200)
      .json({ mensaje: "Pedido actualizado con éxito.", pedidoActualizado });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el estado del pedido",
      error: error.message,
    });
  }
};

// 5. ELIMINAR un pedido por ID (borrado lógico)
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    if (pedido.fecha_eliminado) {
      return res
        .status(409)
        .json({ message: "Pedido ya se encuentra eliminado." });
    }

    pedido.fecha_eliminado = new Date();

    await pedido.save();

    return res.status(200).json({
      message: "Pedido ha sido eliminado.",
      id: req.params.id,
      fecha_eliminacion: pedido.fecha_eliminado,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar el pedido", error: error.message });
  }
};
