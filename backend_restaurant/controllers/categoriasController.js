import Categoria from "../models/Categoria.js";
import Menu from "../models/Menu.js"; // Necesario para verificar asociaciones

// =====================
// CONTROLADOR: CATEGORÍAS
// =====================

// OBTENER todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ fecha_eliminado: null });
    return res.status(200).json({ mensaje: "Consulta exitosa", categorias });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las categorías",
      error: error.message,
    });
  }
};

// CREAR una categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ message: "El campo nombre es obligatorio." });
    }

    const categoriaCreada = await Categoria.create({ nombre });
    return res
      .status(201)
      .json({ message: "Categoría creada con éxito.", categoriaCreada });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear la categoría", error: error.message });
  }
};

// ACTUALIZAR una categoría por ID
export const actualizarCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res
        .status(400)
        .json({ message: "El campo nombre es obligatorio." });
    }

    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    categoria.nombre = nombre;
    const categoriaActualizada = await categoria.save();

    return res.status(200).json({
      mensaje: "Categoría actualizada con éxito.",
      categoriaActualizada,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la categoría",
      error: error.message,
    });
  }
};

// ELIMINAR una categoría por ID (borrado lógico)
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    if (categoria.fecha_eliminado) {
      return res
        .status(409)
        .json({ message: "La categoría ya se encuentra eliminada." });
    }

    const menuAsociado = await Menu.exists({ categoria: categoria._id });

    if (menuAsociado) {
      return res.status(400).json({
        message:
          "No se puede eliminar la categoría porque está asociada a un menú.",
      });
    }

    categoria.fecha_eliminado = new Date();
    await categoria.save();

    return res.status(200).json({ message: "Categoría eliminada con éxito." });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la categoría",
      error: error.message,
    });
  }
};
