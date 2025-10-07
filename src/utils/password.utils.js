import bcrypt from 'bcrypt';

/**
 * Encripta una contraseña usando bcrypt
 */
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña en texto plano con una encriptada
 */
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Genera la contraseña por defecto "coder123" encriptada
 */
export const getDefaultPassword = async () => {
    return await hashPassword('coder123');
};