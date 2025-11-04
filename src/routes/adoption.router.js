import { Router } from 'express';
import mongoose from 'mongoose';
import Adoption from '../models/Adoption.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

const router = Router();

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtiene todas las adopciones
 *     tags: [Adoptions]
 *     description: Retorna una lista completa de todas las adopciones registradas
 *     responses:
 *       200:
 *         description: Lista de adopciones obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Adoption'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const adoptions = await Adoption.find()
            .populate('user', 'first_name last_name email')
            .populate('pet', 'name specie');

        res.status(200).json({
            status: 'success',
            count: adoptions.length,
            payload: adoptions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/adoptions/:aid
 * Obtiene una adopción por ID
 */
router.get('/:aid', async (req, res) => {
    try {
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.aid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de adopción inválido'
            });
        }

        const adoption = await Adoption.findById(req.params.aid)
            .populate('user', 'first_name last_name email')
            .populate('pet', 'name specie');

        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adopción no encontrada'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: adoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/adoptions/:uid/:pid
 * Crea una nueva adopción
 */
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;

        // Validar ObjectIds
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de usuario inválido'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de mascota inválido'
            });
        }

        // Verificar que el usuario existe
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que la mascota existe
        const pet = await Pet.findById(pid);
        if (!pet) {
            return res.status(404).json({
                status: 'error',
                message: 'Mascota no encontrada'
            });
        }

        // Verificar que la mascota no esté adoptada
        if (pet.adopted) {
            return res.status(400).json({
                status: 'error',
                message: 'Esta mascota ya está adoptada'
            });
        }

        // Crear la adopción
        const adoption = new Adoption({
            user: uid,
            pet: pid
        });

        await adoption.save();

        // Actualizar la mascota
        pet.adopted = true;
        pet.owner = uid;
        await pet.save();

        // Actualizar el usuario
        user.pets.push(pid);
        await user.save();

        const populatedAdoption = await Adoption.findById(adoption._id)
            .populate('user', 'first_name last_name email')
            .populate('pet', 'name specie');

        res.status(201).json({
            status: 'success',
            message: 'Adopción creada exitosamente',
            payload: populatedAdoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * PUT /api/adoptions/:aid
 * Actualiza el estado de una adopción
 */
router.put('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;
        const { status } = req.body;

        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(aid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de adopción inválido'
            });
        }

        // Validar status
        if (status && !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Estado inválido. Debe ser: pending, approved o rejected'
            });
        }

        const adoption = await Adoption.findByIdAndUpdate(
            aid,
            { status },
            { new: true }
        )
            .populate('user', 'first_name last_name email')
            .populate('pet', 'name specie');

        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adopción no encontrada'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Adopción actualizada exitosamente',
            payload: adoption
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * DELETE /api/adoptions/:aid
 * Elimina una adopción
 */
router.delete('/:aid', async (req, res) => {
    try {
        const { aid } = req.params;

        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(aid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de adopción inválido'
            });
        }

        const adoption = await Adoption.findById(aid);

        if (!adoption) {
            return res.status(404).json({
                status: 'error',
                message: 'Adopción no encontrada'
            });
        }

        // Actualizar la mascota
        const pet = await Pet.findById(adoption.pet);
        if (pet) {
            pet.adopted = false;
            pet.owner = null;
            await pet.save();
        }

        // Actualizar el usuario
        const user = await User.findById(adoption.user);
        if (user) {
            user.pets = user.pets.filter(p => p.toString() !== adoption.pet.toString());
            await user.save();
        }

        // Eliminar la adopción
        await Adoption.findByIdAndDelete(aid);

        res.status(200).json({
            status: 'success',
            message: 'Adopción eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;