import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Adopción de Mascotas',
            version: '1.0.0',
            description: 'Documentación de la API para el sistema de adopción de mascotas - Backend III',
            contact: {
                name: 'API Support',
                email: 'support@adoptme.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de desarrollo'
            }
        ],
        tags: [
            {
                name: 'Users',
                description: 'Operaciones relacionadas con usuarios'
            },
            {
                name: 'Pets',
                description: 'Operaciones relacionadas con mascotas'
            },
            {
                name: 'Adoptions',
                description: 'Operaciones relacionadas con adopciones'
            },
            {
                name: 'Mocks',
                description: 'Generación de datos de prueba'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID autogenerado por MongoDB',
                            example: '507f1f77bcf86cd799439011'
                        },
                        first_name: {
                            type: 'string',
                            description: 'Nombre del usuario',
                            example: 'Juan'
                        },
                        last_name: {
                            type: 'string',
                            description: 'Apellido del usuario',
                            example: 'Pérez'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Correo electrónico del usuario',
                            example: 'juan.perez@email.com'
                        },
                        password: {
                            type: 'string',
                            description: 'Contraseña encriptada',
                            example: '$2b$10$abcdefghijklmnopqrstuvwxyz'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'Rol del usuario',
                            example: 'user'
                        },
                        pets: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array de IDs de mascotas adoptadas',
                            example: []
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última actualización'
                        }
                    }
                },
                Pet: {
                    type: 'object',
                    required: ['name', 'specie', 'birthDate'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID autogenerado por MongoDB',
                            example: '507f1f77bcf86cd799439012'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la mascota',
                            example: 'Firulais'
                        },
                        specie: {
                            type: 'string',
                            enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster'],
                            description: 'Especie de la mascota',
                            example: 'dog'
                        },
                        birthDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de nacimiento',
                            example: '2020-01-15'
                        },
                        adopted: {
                            type: 'boolean',
                            description: 'Estado de adopción',
                            example: false
                        },
                        owner: {
                            type: 'string',
                            description: 'ID del usuario dueño (si está adoptada)',
                            example: null
                        },
                        image: {
                            type: 'string',
                            description: 'URL de la imagen',
                            example: 'https://example.com/image.jpg'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Adoption: {
                    type: 'object',
                    required: ['user', 'pet'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID autogenerado por MongoDB',
                            example: '507f1f77bcf86cd799439013'
                        },
                        user: {
                            type: 'string',
                            description: 'ID del usuario que adopta',
                            example: '507f1f77bcf86cd799439011'
                        },
                        pet: {
                            type: 'string',
                            description: 'ID de la mascota adoptada',
                            example: '507f1f77bcf86cd799439012'
                        },
                        adoptionDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de adopción'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'rejected'],
                            description: 'Estado de la adopción',
                            example: 'pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Mensaje de error'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };