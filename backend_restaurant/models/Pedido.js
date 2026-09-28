import mongoose from "mongoose";

// Definición de los estados posibles para un pedido (Enum)
const EstadosPedido = [
  "PENDIENTE",
  "EN_PREPARACION",
  "LISTO",
  "ENTREGADO",
  "CANCELADO",
];

const PedidoSchema = new mongoose.Schema(
  {
    menus: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "menus", // Referencia al modelo de Menu
        },
      ], // Un array de los ítems definidos arriba
      required: [true, "El pedido debe contener al menos un ítem."],
    },
    total: {
      type: Number,
      required: true,
      default: 0, // Se calculará en la capa de rutas
      min: 0,
    },
    estado: {
      type: String,
      enum: EstadosPedido,
      default: "PENDIENTE",
      required: true,
    },
    observaciones: {
      type: String,
      trim: true,
    },
    fecha_eliminado: Date,
  },
  {
    timestamps: true,
  }
);

const Pedido = mongoose.model("pedidos", PedidoSchema);

export default Pedido;