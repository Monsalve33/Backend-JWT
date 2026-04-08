// src/controllers/pedido.controller.js
import { validationResult } from 'express-validator';
import Pedido from '../models/Publicacion.js';

const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return true;
    }
    return false;
};

const normalizeTotal = (items = []) =>
    items.reduce(
        (acc, item) => acc + Number(item.cantidad || 0) * Number(item.precio_unitario || 0),
        0
    );

export const createPost = async (req, res, next) => {
    try {
        if (handleValidation(req, res)) return;

        const payload = {
            fecha: req.body.fecha ?? new Date(),
            cliente_id: Number(req.body.cliente_id),
            items: req.body.items.map((item) => ({
                producto_id: Number(item.producto_id),
                cantidad: Number(item.cantidad),
                precio_unitario: Number(item.precio_unitario)
            })),
            total: normalizeTotal(req.body.items),
            estado: req.body.estado
        };

        const created = await Pedido.create(payload);
        res.status(201).json(created);

    } catch (err) {
        next(err);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (q) {
            filter.$or = [{ estado: new RegExp(q, 'i') }];

            if (/^\d+$/.test(q)) {
                filter.$or.push({ cliente_id: Number(q) });
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
            Pedido.find(filter)
                .sort({ fecha: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Pedido.countDocuments(filter)
        ]);

        res.json({
            items,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)) || 1
        });

    } catch (err) {
        next(err);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        if (handleValidation(req, res)) return;

        const item = await Pedido.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(item);

    } catch (err) {
        next(err);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        if (handleValidation(req, res)) return;

        const updatePayload = { ...req.body };

        if (req.body.cliente_id !== undefined) {
            updatePayload.cliente_id = Number(req.body.cliente_id);
        }

        if (req.body.items) {
            updatePayload.items = req.body.items.map((item) => ({
                producto_id: Number(item.producto_id),
                cantidad: Number(item.cantidad),
                precio_unitario: Number(item.precio_unitario)
            }));
            updatePayload.total = normalizeTotal(req.body.items);
        }

        const updated = await Pedido.findByIdAndUpdate(
            req.params.id,
            updatePayload,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(updated);

    } catch (err) {
        next(err);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        if (handleValidation(req, res)) return;

        const deleted = await Pedido.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Eliminado correctamente' });

    } catch (err) {
        next(err);
    }
};
