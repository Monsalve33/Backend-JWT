// src/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const buildAuthResponse = (user) => {
    const token = jwt.sign(
        {
            uid: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * POST /api/auth/register
 * Crea un usuario y devuelve JWT
 */
export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contrasena son obligatorios' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: 'Ese correo ya esta registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user'
        });

        res.status(201).json(buildAuthResponse(user));

    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/login
 * Autentica usuario y devuelve JWT
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        res.json(buildAuthResponse(user));

    } catch (err) {
        next(err);
    }
};
