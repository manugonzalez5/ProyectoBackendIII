import express from 'express';
import mocksRouter from './src/routes/mocks.router.js';
import usersRouter from './src/routes/users.router.js';
import petsRouter from './src/routes/pets.router.js';
import adoptionsRouter from './src/routes/adoption.router.js';
import { specs, swaggerUi } from './src/config/swagger.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Docs - Proyecto Backend III'
}));

// Rutas de API
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: '✅ API funcionando correctamente',
        documentation: 'http://localhost:8080/api-docs',
        endpoints: {
            mocks: {
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
            },
            adoptions: {
                getAll: 'GET /api/adoptions',
                getById: 'GET /api/adoptions/:aid',
                create: 'POST /api/adoptions/:uid/:pid',
                update: 'PUT /api/adoptions/:aid',
                delete: 'DELETE /api/adoptions/:aid'
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