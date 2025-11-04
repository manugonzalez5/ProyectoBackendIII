import { Router } from 'express';
import mongoose from 'mongoose';
import Pet from '../models/Pet.js';

const router = Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags: [Pets]
 *     description: Retorna una lista completa de todas las mascotas registradas
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
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
 *                   example: 10
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find().populate('owner');

        res.status(200).json({
            status: 'success',
            count: pets.length,
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/pets/:id
 * Obtiene una mascota por ID
 */
router.get('/:id', async (req, res) => {
    try {
        // Validar que el ID sea un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de mascota inválido'
            });
        }

        const pet = await Pet.findById(req.params.id).populate('owner');

        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: pet
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;