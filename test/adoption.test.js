// Cargar setup primero
import './setup.js';

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../app.js';
import { connectDB } from '../src/config/config.js';
import User from '../src/models/User.js';
import Pet from '../src/models/Pet.js';
import Adoption from '../src/models/Adoption.js';

const request = supertest(app);

describe('Tests del Router de Adoptions', function () {
    let testUser;
    let testPet;
    let testAdoption;

    // Conectar a BD antes de todos los tests
    before(async function () {
        await connectDB();
    });

    // Limpiar y crear datos de prueba antes de cada test
    beforeEach(async function () {
        // Limpiar colecciones
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Adoption.deleteMany({});

        // Crear usuario de prueba
        testUser = await User.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@test.com',
            password: 'hashedpassword123',
            role: 'user',
            pets: []
        });

        // Crear mascota de prueba
        testPet = await Pet.create({
            name: 'Firulais',
            specie: 'dog',
            birthDate: new Date('2020-01-01'),
            adopted: false
        });
    });

    // ==========================================
    // GET /api/adoptions - Obtener todas las adopciones
    // ==========================================
    describe('GET /api/adoptions', function () {
        it('Debe retornar un array vacío cuando no hay adopciones', async function () {
            const response = await request.get('/api/adoptions');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.count).to.equal(0);
            expect(response.body.payload).to.be.an('array').that.is.empty;
        });

        it('Debe retornar todas las adopciones existentes', async function () {
            // Crear una adopción
            await Adoption.create({
                user: testUser._id,
                pet: testPet._id,
                status: 'pending'
            });

            const response = await request.get('/api/adoptions');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.count).to.equal(1);
            expect(response.body.payload).to.be.an('array').with.lengthOf(1);
        });
    });

    // ==========================================
    // GET /api/adoptions/:aid - Obtener adopción por ID
    // ==========================================
    describe('GET /api/adoptions/:aid', function () {
        it('Debe retornar una adopción específica por ID válido', async function () {
            testAdoption = await Adoption.create({
                user: testUser._id,
                pet: testPet._id,
                status: 'pending'
            });

            const response = await request.get(`/api/adoptions/${testAdoption._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.status).to.equal('pending');
        });

        it('Debe retornar error 400 con ID inválido', async function () {
            const response = await request.get('/api/adoptions/123');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('ID de adopción inválido');
        });

        it('Debe retornar error 404 cuando la adopción no existe', async function () {
            const fakeId = '000000000000000000000000';
            const response = await request.get(`/api/adoptions/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Adopción no encontrada');
        });
    });

    // ==========================================
    // POST /api/adoptions/:uid/:pid - Crear adopción
    // ==========================================
    describe('POST /api/adoptions/:uid/:pid', function () {
        it('Debe crear una adopción exitosamente con IDs válidos', async function () {
            const response = await request.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Adopción creada exitosamente');
            expect(response.body.payload).to.have.property('_id');

            // Verificar que la mascota fue marcada como adoptada
            const updatedPet = await Pet.findById(testPet._id);
            expect(updatedPet.adopted).to.be.true;
            expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());

            // Verificar que el usuario tiene la mascota en su array
            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.pets).to.have.lengthOf(1);
        });

        it('Debe retornar error 400 con ID de usuario inválido', async function () {
            const response = await request.post(`/api/adoptions/123/${testPet._id}`);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('ID de usuario inválido');
        });

        it('Debe retornar error 400 con ID de mascota inválido', async function () {
            const response = await request.post(`/api/adoptions/${testUser._id}/abc`);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('ID de mascota inválido');
        });

        it('Debe retornar error 404 cuando el usuario no existe', async function () {
            const fakeUserId = '000000000000000000000000';
            const response = await request.post(`/api/adoptions/${fakeUserId}/${testPet._id}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Usuario no encontrado');
        });

        it('Debe retornar error 404 cuando la mascota no existe', async function () {
            const fakePetId = '000000000000000000000000';
            const response = await request.post(`/api/adoptions/${testUser._id}/${fakePetId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Mascota no encontrada');
        });

        it('Debe retornar error 400 cuando la mascota ya está adoptada', async function () {
            // Marcar mascota como adoptada
            testPet.adopted = true;
            await testPet.save();

            const response = await request.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Esta mascota ya está adoptada');
        });
    });

    // ==========================================
    // PUT /api/adoptions/:aid - Actualizar adopción
    // ==========================================
    describe('PUT /api/adoptions/:aid', function () {
        beforeEach(async function () {
            testAdoption = await Adoption.create({
                user: testUser._id,
                pet: testPet._id,
                status: 'pending'
            });
        });

        it('Debe actualizar el estado a "approved"', async function () {
            const response = await request
                .put(`/api/adoptions/${testAdoption._id}`)
                .send({ status: 'approved' });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload.status).to.equal('approved');
        });

        it('Debe actualizar el estado a "rejected"', async function () {
            const response = await request
                .put(`/api/adoptions/${testAdoption._id}`)
                .send({ status: 'rejected' });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload.status).to.equal('rejected');
        });

        it('Debe retornar error 400 con estado inválido', async function () {
            const response = await request
                .put(`/api/adoptions/${testAdoption._id}`)
                .send({ status: 'invalid_status' });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.include('Estado inválido');
        });

        it('Debe retornar error 400 con ID inválido', async function () {
            const response = await request
                .put('/api/adoptions/123')
                .send({ status: 'approved' });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('ID de adopción inválido');
        });

        it('Debe retornar error 404 cuando la adopción no existe', async function () {
            const fakeId = '000000000000000000000000';
            const response = await request
                .put(`/api/adoptions/${fakeId}`)
                .send({ status: 'approved' });

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Adopción no encontrada');
        });
    });

    // ==========================================
    // DELETE /api/adoptions/:aid - Eliminar adopción
    // ==========================================
    describe('DELETE /api/adoptions/:aid', function () {
        beforeEach(async function () {
            // Crear adopción con mascota adoptada
            testPet.adopted = true;
            testPet.owner = testUser._id;
            await testPet.save();

            testUser.pets.push(testPet._id);
            await testUser.save();

            testAdoption = await Adoption.create({
                user: testUser._id,
                pet: testPet._id,
                status: 'approved'
            });
        });

        it('Debe eliminar una adopción y restaurar el estado de mascota y usuario', async function () {
            const response = await request.delete(`/api/adoptions/${testAdoption._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Adopción eliminada exitosamente');

            // Verificar que la adopción fue eliminada
            const deletedAdoption = await Adoption.findById(testAdoption._id);
            expect(deletedAdoption).to.be.null;

            // Verificar que la mascota ya no está adoptada
            const updatedPet = await Pet.findById(testPet._id);
            expect(updatedPet.adopted).to.be.false;
            expect(updatedPet.owner).to.be.null;

            // Verificar que el usuario no tiene la mascota
            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.pets).to.be.an('array').that.is.empty;
        });

        it('Debe retornar error 400 con ID inválido', async function () {
            const response = await request.delete('/api/adoptions/abc123');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('ID de adopción inválido');
        });

        it('Debe retornar error 404 cuando la adopción no existe', async function () {
            const fakeId = '000000000000000000000000';
            const response = await request.delete(`/api/adoptions/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.message).to.equal('Adopción no encontrada');
        });
    });
});