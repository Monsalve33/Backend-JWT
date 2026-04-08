import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import publicacionRoutes from './routes/Publicacion.routes.js';

const app = express();

const allowedOrigins = [
    ...(process.env.CORS_ORIGIN || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    'http://localhost:5173',
    'http://localhost:5174',
    'https://gestion-monetaria.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const isAllowed =
            allowedOrigins.includes(origin) ||
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

        if (isAllowed) {
            return callback(null, true);
        }

        return callback(new Error('Origen no permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pedidos', publicacionRoutes);

app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'pedidos-api' });
});

app.use((err, req, res, next) => {
    console.error('❌ ERROR NO CONTROLADO:', err);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;
