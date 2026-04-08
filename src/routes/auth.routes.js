import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        ok: true,
        module: 'auth',
        endpoints: {
            register: {
                method: 'POST',
                path: '/api/auth/register'
            },
            login: {
                method: 'POST',
                path: '/api/auth/login'
            }
        }
    });
});

router.post('/register', register);
router.post('/login', login);

export default router;
