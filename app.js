import express from 'express';
import mocksRouter from './src/routes/mocks.router.js';
import usersRouter from './src/routes/users.router.js';
import petsRouter from './src/routes/pets.router.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: '✅ Servidor funcionando correctamente',
        endpoints: {
            mocking: {
                mockingpets: 'GET /api/mocks/mockingpets',
                mockingusers: 'GET /api/mocks/mockingusers',
                generateData: 'POST /api/mocks/generateData'
            },
            users: {
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id'
            },
            pets: {
                getAll: 'GET /api/pets',
                getById: 'GET /api/pets/:id'
            }
        }
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
});

export default app;