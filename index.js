import app from './app.js';
import { connectDB } from './src/config/config.js';

const PORT = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📝 Documentación: http://localhost:${PORT}/`);
    console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
});