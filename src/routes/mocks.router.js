import { Router } from 'express';
import { generateUsers, generatePets } from '../services/mocking.service.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

const router = Router();

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Genera 100 mascotas mock
 *     tags: [Mocks]
 *     description: Retorna 100 mascotas generadas aleatoriamente para pruebas
 *     responses:
 *       200:
 *         description: Mascotas generadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error del servidor
 */
router.get('/mockingpets', (req, res) => {
    try {
        const pets = generatePets(100);

        res.status(200).json({
            status: 'success',
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
 * GET /api/mocks/mockingusers
 * Genera 50 usuarios mock con password "coder123" encriptada
 */
router.get('/mockingusers', async (req, res) => {
    try {
        const users = await generateUsers(50);

        res.status(200).json({
            status: 'success',
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
 * POST /api/mocks/generateData
 * Genera e inserta usuarios y mascotas en la base de datos
 * Body: { users: number, pets: number }
 */
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        // Validar que sean números
        if (isNaN(users) || isNaN(pets)) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros "users" y "pets" deben ser números'
            });
        }

        // Convertir a números enteros
        const numUsers = parseInt(users);
        const numPets = parseInt(pets);

        // Validar que sean positivos
        if (numUsers < 0 || numPets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros "users" y "pets" deben ser números positivos'
            });
        }

        // Validar que al menos uno sea mayor a 0
        if (numUsers === 0 && numPets === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Debes generar al menos 1 usuario o 1 mascota'
            });
        }

        // Validar límite máximo (opcional, para evitar sobrecargas)
        const MAX_RECORDS = 1000;
        if (numUsers > MAX_RECORDS || numPets > MAX_RECORDS) {
            return res.status(400).json({
                status: 'error',
                message: `No puedes generar más de ${MAX_RECORDS} registros de cada tipo`
            });
        }

        const results = {
            users: { count: 0, inserted: [] },
            pets: { count: 0, inserted: [] }
        };

        // Generar e insertar usuarios
        if (numUsers > 0) {
            const generatedUsers = await generateUsers(numUsers);
            const insertedUsers = await User.insertMany(generatedUsers);
            results.users.count = insertedUsers.length;
            results.users.inserted = insertedUsers.map(u => u._id);
        }

        // Generar e insertar mascotas
        if (numPets > 0) {
            const generatedPets = generatePets(numPets);
            const insertedPets = await Pet.insertMany(generatedPets);
            results.pets.count = insertedPets.length;
            results.pets.inserted = insertedPets.map(p => p._id);
        }

        res.status(201).json({
            status: 'success',
            message: `Se insertaron ${results.users.count} usuarios y ${results.pets.count} mascotas`,
            payload: results
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;