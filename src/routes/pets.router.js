import { Router } from 'express';
import mongoose from 'mongoose';
import Pet from '../models/Pet.js';

const router = Router();

/**
 * GET /api/pets
 * Obtiene todas las mascotas de la base de datos
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