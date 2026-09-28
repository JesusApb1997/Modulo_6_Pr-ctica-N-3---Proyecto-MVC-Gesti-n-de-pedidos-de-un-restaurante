import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del plato es obligatorio."],
      trim: true,
      unique: true,
    },
    precio: {
      type: Number,
      required: [true, "El precio del plato es obligatorio."],
      min: [0, "El precio no puede ser negativo."],
    },
    // Referencia al modelo de Categoría
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorias", // Indica a Mongoose el modelo al que se refiere
      required: [true, "La categoría del plato es obligatoria."],
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    fecha_eliminado: Date,
  },
  {
    timestamps: true,
  }
);

const Menu = mongoose.model("menus", MenuSchema);

export default Menu;