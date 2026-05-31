# API REST con Node.js, Express, MongoDB y Testing Automatizado

## Objetivo

Desarrollar una API REST profesional utilizando Node.js y Express, aplicando arquitectura por capas, persistencia de datos mediante MongoDB, validaciones con Zod y pruebas automatizadas con Jest y Supertest.

---

# Competencias

Al finalizar la actividad el estudiante será capaz de:

- Diseñar APIs REST siguiendo buenas prácticas.
- Aplicar arquitectura por capas.
- Persistir información utilizando MongoDB.
- Gestionar configuraciones mediante variables de entorno.
- Implementar validaciones de entrada utilizando Zod.
- Crear pruebas automatizadas para endpoints REST.
- Aplicar principios de mantenibilidad y escalabilidad.

---

# Caso de Negocio

Una empresa necesita una API para administrar productos de su catálogo.

La API debe permitir:

- Crear productos.
- Obtener todos los productos.
- Obtener un producto por ID.
- Actualizar productos.
- Eliminar productos.

---

# Tecnologías Obligatorias

| Tecnología  | Uso                  |
| ----------- | -------------------- |
| Node.js 24+ | Runtime              |
| Express 5   | Framework Web        |
| MongoDB     | Base de Datos        |
| Mongoose    | ODM                  |
| dotenv      | Variables de entorno |
| Zod         | Validaciones         |
| Jest        | Testing              |
| Supertest   | Testing HTTP         |
| GitHub      | Control de versiones |

---

# Instalación del Proyecto

## Inicialización

```bash
mkdir products-api

cd products-api

pnpm init -y
```

---

## Dependencias

### Producción

```bash
pnpm install express mongoose dotenv zod cors
```

### Desarrollo

```bash
pnpm install --save-dev jest supertest nodemon
```

---

# Configuración package.json

Reemplazar el contenido de `package.json` con:

```json
{
  "name": "nodejs-products-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@11.1.2",
  "type": "module",
  "pnpm": {
    "onlyBuiltDependencies": ["unrs-resolver"]
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.6.3",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "jest": "^30.4.2",
    "nodemon": "^3.1.14",
    "supertest": "^7.2.2"
  }
}
```

> `packageManager` le dice a corepack qué versión exacta de pnpm usar.
> `pnpm.onlyBuiltDependencies` autoriza los build scripts de paquetes nativos que los necesitan.

---

# Configuración Jest

Crear el archivo `jest.config.js` en la raíz del proyecto:

```javascript
export default {
  testEnvironment: "node",
};
```

---

# Estructura del Proyecto

```text
src/
│
├── config/
│   └── database.js
│
├── controllers/
│   └── product.controller.js
│
├── services/
│   └── product.service.js
│
├── repositories/
│   └── product.repository.js
│
├── models/
│   └── product.model.js
│
├── validations/
│   └── product.validation.js
│
├── routes/
│   └── product.routes.js
│
├── middlewares/
│   └── validate.middleware.js
│
├── app.js
│
└── index.js

tests/
│
└── product.test.js

.env
.dockerignore
Dockerfile
docker-compose.yml
```

---

# Variables de Entorno

Crear el archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development

PORT=3000

MONGODB_URI=mongodb://mongo:27017/productsdb
```

---

# Modelo de Datos

## Product

```json
{
  "name": "Notebook Lenovo",
  "description": "Equipo portátil",
  "price": 750000,
  "stock": 10
}
```

---

# Implementación

## Configuración MongoDB

### database.js

```javascript
import mongoose from "mongoose";

export const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB conectado");
};
```

---

## Modelo

### product.model.js

```javascript
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    stock: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", ProductSchema);
```

---

# Validaciones con Zod

## product.validation.js

```javascript
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});
```

---

# Middleware de Validación

## validate.middleware.js

```javascript
export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = schema.parse(req.body);

    next();
  } catch (error) {
    return res.status(400).json({
      errors: error.errors,
    });
  }
};
```

---

# Arquitectura por Capas

## Repository

Responsabilidad:

- Acceso a MongoDB.

```javascript
import Product from "../models/product.model.js";

export class ProductRepository {
  async create(data) {
    return Product.create(data);
  }

  async findAll() {
    return Product.find();
  }

  async findById(id) {
    return Product.findById(id);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}
```

---

## Service

Responsabilidad:

- Reglas de negocio.

```javascript
import { ProductRepository } from "../repositories/product.repository.js";

const repository = new ProductRepository();

export class ProductService {
  create(data) {
    return repository.create(data);
  }

  findAll() {
    return repository.findAll();
  }

  findById(id) {
    return repository.findById(id);
  }

  update(id, data) {
    return repository.update(id, data);
  }

  delete(id) {
    return repository.delete(id);
  }
}
```

---

## Controller

Responsabilidad:

- Manejo HTTP.

```javascript
import { ProductService } from "../services/product.service.js";

const service = new ProductService();

export class ProductController {
  async create(req, res) {
    const product = await service.create(req.body);

    return res.status(201).json(product);
  }

  async findAll(req, res) {
    const products = await service.findAll();

    return res.json(products);
  }

  async findById(req, res) {
    const product = await service.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  }

  async update(req, res) {
    const product = await service.update(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  }

  async delete(req, res) {
    const product = await service.delete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(204).send();
  }
}
```

---

## Rutas

Responsabilidad:

- Manejo de Rutas.

```javascript
import { Router } from "express";

import { ProductController } from "../controllers/product.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import { productSchema } from "../validations/product.validation.js";

const router = Router();

const controller = new ProductController();

router.get("/", controller.findAll.bind(controller));

router.get("/:id", controller.findById.bind(controller));

router.post("/", validate(productSchema), controller.create.bind(controller));

router.put("/:id", validate(productSchema), controller.update.bind(controller));

router.delete("/:id", controller.delete.bind(controller));

export default router;
```

---

## app.js

Responsabilidad:

- Iniciar Express.

```javascript
import express from "express";
import cors from "cors";

import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

export default app;
```

---

## index.js

Responsabilidad:

- Iniciar API REST.

```javascript
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 3000;

await connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

---

# Docker

## .dockerignore

Crear el archivo `.dockerignore` en la raíz del proyecto:

```
node_modules
.env
.git
```

> Sin este archivo, `COPY . .` copiaría el `node_modules` local al container y rompería la instalación.

## Dockerfile

```Dockerfile
FROM node:24-slim

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]
```

---

# docker-compose.yml

```yml
services:
  api:
    build: .

    container_name: products-api

    ports:
      - "3000:3000"

    env_file:
      - .env

    depends_on:
      - mongo

    networks:
      - products-network

  mongo:
    image: mongo:8

    container_name: mongo-db

    restart: unless-stopped

    ports:
      - "27017:27017"

    volumes:
      - mongo-data:/data/db

    networks:
      - products-network

volumes:
  mongo-data:

networks:
  products-network:
```

---

# Endpoints

| Método | Endpoint          |
| ------ | ----------------- |
| GET    | /api/products     |
| GET    | /api/products/:id |
| POST   | /api/products     |
| PUT    | /api/products/:id |
| DELETE | /api/products/:id |

---

# Pruebas Automatizadas

Todos los endpoints deben poseer pruebas.

## Casos mínimos

### POST

- Crear producto correctamente.
- Error por datos inválidos.

### GET

- Obtener productos.
- Obtener producto por ID.

### PUT

- Actualizar producto.

### DELETE

- Eliminar producto.

---

## Configuración de Tests

Los tests usan una base de datos MongoDB real. Asegurarse de tener MongoDB corriendo antes de ejecutar.

Para correr con Docker Compose:

```bash
docker-compose up -d mongo
```

Para correr localmente (requiere MongoDB instalado):

```bash
MONGODB_URI=mongodb://localhost:27017/productsdb-test pnpm test
```

---

## Ejemplo de Test

```javascript
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/products", () => {
  test("debe crear un producto", async () => {
    const response = await request(app).post("/api/products").send({
      name: "Notebook",
      description: "Lenovo IdeaPad",
      price: 750000,
      stock: 10,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  test("debe rechazar datos inválidos", async () => {
    const response = await request(app).post("/api/products").send({
      name: "AB",
      price: -100,
    });

    expect(response.statusCode).toBe(400);
  });
});

describe("GET /api/products", () => {
  test("debe obtener todos los productos", async () => {
    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

# Levantar proyecto

## Construir

```bash
docker-compose build
```

## Iniciar

```bash
docker-compose up -d
```

## Verificar

```bash
curl http://localhost:3000/health
```

### Respuesta esperada

```json
{
  "status": "ok"
}
```

---

# Desafío Adicional

Implementar:

- Paginación.
- Filtros.
- Ordenamiento.
- Búsqueda por nombre.
- Soft Delete.
