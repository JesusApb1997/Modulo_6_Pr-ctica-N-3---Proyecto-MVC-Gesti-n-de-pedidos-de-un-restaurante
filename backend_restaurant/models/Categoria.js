import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio."],
      trim: true,
    },
    fecha_eliminado: Date,
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt
  }
);

const Categoria = mongoose.model("categorias", CategoriaSchema);

export default Categoria;