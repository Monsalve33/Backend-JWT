// src/validators/pedido.validator.js
import { body, param } from 'express-validator';

export const idValidator = [
    param('id')
        .isMongoId()
        .withMessage('ID no valido'),
];

export const createPostValidator = [
    body('cliente_id')
        .isInt({ min: 1 })
        .withMessage('El cliente_id debe ser un numero entero mayor a 0'),

    body('items')
        .isArray({ min: 1 })
        .withMessage('Debe enviar al menos un item'),

    body('items.*.producto_id')
        .isInt({ min: 1 })
        .withMessage('Cada producto_id debe ser un numero entero mayor a 0'),

    body('items.*.cantidad')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un entero mayor a 0'),

    body('items.*.precio_unitario')
        .isFloat({ min: 0 })
        .withMessage('El precio_unitario debe ser un numero positivo'),

    body('estado')
        .trim()
        .notEmpty()
        .withMessage('El estado es obligatorio')
        .isIn(['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'])
        .withMessage('Estado no valido'),
];

export const updatePostValidator = [
    ...idValidator,

    body('cliente_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('cliente_id no valido'),

    body('items')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Debe enviar al menos un item'),

    body('items.*.producto_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cada producto_id debe ser un numero entero mayor a 0'),

    body('items.*.cantidad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un entero mayor a 0'),

    body('items.*.precio_unitario')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio_unitario debe ser un numero positivo'),

    body('estado')
        .optional()
        .trim()
        .isIn(['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'])
        .withMessage('Estado no valido'),
];
