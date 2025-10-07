import { faker } from '@faker-js/faker';
import { getDefaultPassword } from '../utils/password.utils.js';

/**
 * Genera un usuario mock con formato de Mongo
 */
export const generateUser = async () => {
    const hashedPassword = await getDefaultPassword(); // "coder123" encriptada

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: [] // Array vacío 
    };
};

/**
 * Genera múltiples usuarios mock
 */
export const generateUsers = async (count = 50) => {
    const users = [];

    for (let i = 0; i < count; i++) {
        const user = await generateUser();
        users.push(user);
    }

    return users;
};

/**
 * Genera una mascota mock con formato de Mongo
 */
export const generatePet = () => {
    const species = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster'];

    return {
        name: faker.animal.petName(),
        specie: faker.helpers.arrayElement(species),
        birthDate: faker.date.past({ years: 10 }),
        adopted: false,
        image: faker.image.url()
    };
};

/**
 * Genera múltiples mascotas mock
 */
export const generatePets = (count = 50) => {
    const pets = [];

    for (let i = 0; i < count; i++) {
        pets.push(generatePet());
    }

    return pets;
};