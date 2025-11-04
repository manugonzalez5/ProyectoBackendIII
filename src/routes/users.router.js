import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     description: Retorna una lista completa de todos los usuarios registrados en la base de datos
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
        // Validar que el ID sea un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de usuario inválido'
            });
        }

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