import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.dev
dotenv.config({ path: join(__dirname, '..', '.env.dev') });

// Configuración global para tests
process.env.NODE_ENV = 'test';

// Verificar que MONGODB_URI esté cargado
if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definido en .env.dev');
    process.exit(1);
}