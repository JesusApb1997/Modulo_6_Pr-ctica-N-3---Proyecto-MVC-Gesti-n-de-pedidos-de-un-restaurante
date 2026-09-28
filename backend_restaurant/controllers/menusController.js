import Menu from "../models/Menu.js";
import Categoria from "../models/Categoria.js";

// =====================
// CONTROLADOR: MENÚS
// =====================

// OBTENER el menú completo
export const obtenerMenus = async (req, res) => {
  try {
    const menu = await Menu.find({
      fecha_eliminado: null,
    }).populate("categoria", "nombre");
    return res.status(200).json({ mensaje: "Consulta exitosa", menu });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener el menú", error: error.message });
  }
};

// OBTENER un ítem del menú por ID
export const obtenerMenuPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Menu.findById(id).populate("categoria", "nombre");

    if (!item) {
      return res.status(404).json({ mensaje: "Menú no encontrado." });
    }

    return res.status(200).json({ mensaje: "Menú encontrado.", item });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el ítem del menú",
      error: error.message,
    });
  }
};

// CREAR un nuevo ítem del menú (se crea como disponible por defecto)
export const crearMenu = async (req, res) => {
  try {
    const { nombre, precio, categoria } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: "El nombre es obligatorio." });
    }

    if (precio === undefined || precio === null) {
      return res.status(400).json({ mensaje: "El precio es obligatorio." });
    }

    if (!categoria) {
      return res
        .status(400)
        .json({ mensaje: "La categoría es obligatoria." });
    }

    if (precio < 0) {
      return res
        .status(400)
        .json({ mensaje: "El precio no puede ser negativo." });
    }

    const categoriaExiste = await Categoria.findById(categoria);
    if (!categoriaExiste || categoriaExiste.fecha_eliminado) {
      return res.status(400).json({
        mensaje: "Error de negocio: La Categoría proporcionada no existe.",
      });
    }

    const nuevoItem = await Menu.create({ nombre, categoria, precio });
    return res
      .status(201)
      .json({ mensaje: "Menú creado con éxito.", nuevoItem });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear el ítem del menú",
      error: error.message,
    });
  }
};

// MODIFICAR un ítem del menú
export const actualizarMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria } = req.body;

    if (precio !== undefined && precio < 0) {
      return res
        .status(400)
        .json({ mensaje: "El precio no puede ser negativo." });
    }

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ mensaje: "Ítem de menú no encontrado." });
    }

    if (categoria && menu.categoria?.toString() !== categoria) {
      const categoriaExiste = await Categoria.findById(categoria);
      if (!categoriaExiste || categoriaExiste.fecha_eliminado) {
        return res.status(400).json({
          mensaje: "Error de negocio: La Categoría proporcionada no existe.",
        });
      }
    }

    if (nombre !== undefined) menu.nombre = nombre;
    if (precio !== undefined) menu.precio = precio;
    if (categoria !== undefined) menu.categoria = categoria;

    const menuActualizado = await menu.save();
    return res.status(200).json(menuActualizado);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar el ítem del menú",
      error: error.message,
    });
  }
};

// Desactivar un ítem del menú (disponible = false)
export const desactivarMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ mensaje: "Ítem de menú no encontrado." });
    }

    menu.disponible = false;
    const menuActualizado = await menu.save();
    return res
      .status(200)
      .json({ mensaje: "Menú actualizado con éxito.", menuActualizado });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar la disponibilidad del ítem del menú",
      error: error.message,
    });
  }
};

// Reactivar un ítem del menú (disponible = true)
export const activarMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ mensaje: "Ítem de menú no encontrado." });
    }

    menu.disponible = true;
    const menuActualizado = await menu.save();
    return res
      .status(200)
      .json({ mensaje: "Menú actualizado con éxito.", menuActualizado });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar la disponibilidad del ítem del menú",
      error: error.message,
    });
  }
};

// ELIMINAR un ítem del menú (borrado lógico)
export const eliminarMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ mensaje: "Menú no encontrado." });
    }

    if (menu.fecha_eliminado) {
      return res
        .status(400)
        .json({ mensaje: "El menú ya fue eliminado previamente." });
    }

    menu.fecha_eliminado = new Date();
    await menu.save();

    return res
      .status(200)
      .json({ mensaje: "El menú eliminado con éxito." });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar el ítem del menú",
      error: error.message,
    });
  }
};
