// src/models/Publicacion.js
import { Schema, model } from 'mongoose';

const itemSchema = new Schema(
    {
        producto_id: {
            type: Number,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precio_unitario: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const pedidoSchema = new Schema(
    {
        fecha: {
            type: Date,
            default: Date.now
        },
        cliente_id: {
            type: Number,
            required: true
        },
        items: {
            type: [itemSchema],
            required: true,
            validate: {
                validator: (value) => Array.isArray(value) && value.length > 0,
                message: 'Debe incluir al menos un item'
            }
        },
        total: {
            type: Number,
            required: true,
            min: 0
        },
        estado: {
            type: String,
            required: true,
            trim: true,
            enum: ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado']
        }
    },
    {
        timestamps: true
    }
);

export default model('Pedido', pedidoSchema, 'pedidos');
