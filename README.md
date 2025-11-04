# 🐾 Proyecto Backend III - API de Adopción de Mascotas

Sistema de adopción de mascotas desarrollado con Node.js, Express y MongoDB.

## 📋 Descripción

API RESTful que permite gestionar usuarios, mascotas y procesos de adopción. Incluye generación de datos mock para pruebas, tests automatizados y documentación con Swagger.

## 🚀 Características

- ✅ CRUD de Usuarios, Mascotas y Adopciones
- ✅ Generación de datos mock (usuarios y mascotas)
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validaciones completas
- ✅ Tests automatizados con Mocha/Chai/Supertest (19 tests)
- ✅ Documentación API con Swagger
- ✅ Dockerizado y disponible en DockerHub

## 🛠️ Tecnologías

- **Node.js** v18+
- **Express** v5
- **MongoDB** con Mongoose
- **Docker** & Docker Compose
- **Swagger** para documentación
- **Mocha/Chai/Supertest** para testing
- **Bcrypt** para encriptación
- **Faker.js** para datos mock

## 📦 Imagen de Docker

### Pull desde DockerHub

```bash
docker pull manugonzalez5/adoptme-api:latest
```

**Link de la imagen:** [https://hub.docker.com/r/manugonzalez5/adoptme-api](https://hub.docker.com/r/manugonzalez5/adoptme-api)

### Ejecutar con Docker

```bash
docker run -d -p 8080:8080 \
  -e MONGODB_URI="tu_mongodb_uri_aqui" \
  --name adoptme-api \
  manugonzalez5/adoptme-api:latest
```

### Ejecutar con Docker Compose

1. Clona el repositorio
2. Crea un archivo `.env.prod` con tu `MONGODB_URI`
3. Ejecuta:

```bash
docker-compose up -d
```

## 🔧 Instalación Local

### Prerrequisitos

- Node.js v18 o superior
- MongoDB Atlas o MongoDB local
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/manugonzalez5/ProyectoBackendIII
cd ProyectoBackendIII
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.dev`:
```env
PORT=8080
MONGODB_URI=tu_uri_de_mongodb_aqui
NODE_ENV=development
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Ejecutar tests**
```bash
npm test
```

## 📚 Documentación API

Una vez iniciado el servidor, accede a la documentación interactiva en:

```
http://localhost:8080/api-docs
```

## 🌐 Endpoints

### Mocks
- `GET /api/mocks/mockingusers` - Genera 50 usuarios mock
- `GET /api/mocks/mockingpets` - Genera 100 mascotas mock
- `POST /api/mocks/generateData` - Inserta usuarios y mascotas en BD

### Users
- `GET /api/users` - Obtiene todos los usuarios
- `GET /api/users/:id` - Obtiene un usuario por ID

### Pets
- `GET /api/pets` - Obtiene todas las mascotas
- `GET /api/pets/:id` - Obtiene una mascota por ID

### Adoptions
- `GET /api/adoptions` - Obtiene todas las adopciones
- `GET /api/adoptions/:aid` - Obtiene una adopción por ID
- `POST /api/adoptions/:uid/:pid` - Crea una adopción
- `PUT /api/adoptions/:aid` - Actualiza estado de adopción
- `DELETE /api/adoptions/:aid` - Elimina una adopción

## 🧪 Testing

El proyecto incluye 19 tests automatizados que cubren todos los endpoints del router de adopciones.

```bash
npm test
```

### Cobertura de Tests

- ✅ GET /api/adoptions (2 tests)
- ✅ GET /api/adoptions/:aid (3 tests)
- ✅ POST /api/adoptions/:uid/:pid (6 tests)
- ✅ PUT /api/adoptions/:aid (5 tests)
- ✅ DELETE /api/adoptions/:aid (3 tests)

## 📁 Estructura del Proyecto

```
proyecto-backendIII/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── swagger.js
│   ├── models/
│   │   ├── Adoption.js
│   │   ├── Pet.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adoption.router.js
│   │   ├── mocks.router.js
│   │   ├── pets.router.js
│   │   └── users.router.js
│   ├── services/
│   │   └── mocking.service.js
│   └── utils/
│       └── password.utils.js
├── test/
│   ├── adoption.test.js
│   └── setup.js
├── .dockerignore
├── .env.dev
├── .env.prod
├── .gitignore
├── .mocharc.json
├── app.js
├── docker-compose.yml
├── Dockerfile
├── index.js
├── package.json
└── README.md
```

## 🐳 Docker

### Construir imagen localmente

```bash
docker build -t adoptme-api:1.0.0 .
```

### Ejecutar contenedor

```bash
docker run -d -p 8080:8080 \
  -e MONGODB_URI="tu_uri" \
  adoptme-api:1.0.0
```

### Docker Compose

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🔐 Seguridad

- Todas las contraseñas se encriptan con bcrypt
- Contraseña por defecto para usuarios mock: `coder123`
- Variables de entorno para información sensible
- Validación de ObjectIds de MongoDB

## 👨‍💻 Autor

**Manuel Joaquin Gonzalez**
- GitHub: [@manugonzalez5](https://github.com/manugonzalez5)
- - Email: manujoaquingonzalez5@gmail.com


## 📄 Licencia

ISC

## 🙏 Agradecimientos

Proyecto desarrollado para el curso de Backend III - CoderHouse

---

⭐ Si te gustó el proyecto, dale una estrella en GitHub!