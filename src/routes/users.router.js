import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = Router();

/**
 * GET /api/users
 * Obtiene todos los usuarios de la base de datos
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('pets');

        res.status(200).json({
            status: 'success',
            count: users.length,
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/users/:id
 * Obtiene un usuario por ID
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('pets');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;