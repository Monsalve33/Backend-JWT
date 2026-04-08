// src/routes/Pedido.routes.js
import { Router } from 'express';

import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
} from '../controllers/publicacion.controller.js';

import {
    createPostValidator,
    updatePostValidator,
    idValidator
} from '../validators/publicacion.validator.js';

import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getPosts);
router.post('/', createPostValidator, createPost);
router.get('/:id', idValidator, getPostById);
router.put('/:id', idValidator, updatePostValidator, updatePost);
router.delete('/:id', idValidator, deletePost);

export default router;
