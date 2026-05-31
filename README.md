# Actividad Evaluada: Desarrollo de API REST con Node.js, Express, MongoDB y Testing Automatizado

## Asignatura

DSY1106 - Desarrollo Fullstack III

## Objetivo

Desarrollar una API REST profesional utilizando Node.js y Express, aplicando arquitectura por capas, persistencia de datos mediante MongoDB, validaciones con Zod y pruebas automatizadas con Jest y Supertest.

---

# Competencias

Al finalizar la actividad el estudiante será capaz de:

* Diseñar APIs REST siguiendo buenas prácticas.
* Aplicar arquitectura por capas.
* Persistir información utilizando MongoDB.
* Gestionar configuraciones mediante variables de entorno.
* Implementar validaciones de entrada utilizando Zod.
* Crear pruebas automatizadas para endpoints REST.
* Aplicar principios de mantenibilidad y escalabilidad.

---

# Caso de Negocio

Una empresa necesita una API para administrar productos de su catálogo.

La API debe permitir:

* Crear productos.
* Obtener todos los productos.
* Obtener un producto por ID.
* Actualizar productos.
* Eliminar productos.

---

# Tecnologías Obligatorias

| Tecnología  | Uso                  |
| ----------- | -------------------- |
| Node.js 22+ | Runtime              |
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

npm init -y
```

---

## Dependencias

### Producción

```bash
npm install express mongoose dotenv zod cors
```

### Desarrollo

```bash
npm install --save-dev jest supertest nodemon
```

---

# Configuración ES Modules

Modificar package.json:

```json
{
  "type": "module"
}
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
└── server.js

tests/
│
└── product.test.js

.env
```

---

# Variables de Entorno

## Archivo .env

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/productsdb
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
  await mongoose.connect(
    process.env.MONGODB_URI
  );

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
    stock: Number
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Product",
  ProductSchema
);
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
  stock: z.number().int().nonnegative()
});
```

---

# Middleware de Validación

```javascript
export const validate = (schema) =>
  async (req, res, next) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      return res.status(400).json({
        errors: error.errors
      });
    }
  };
```

---

# Arquitectura por Capas

## Repository

Responsabilidad:

* Acceso a MongoDB.

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
    return Product.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}
```

---

## Service

Responsabilidad:

* Reglas de negocio.

```javascript
import { ProductRepository }
  from "../repositories/product.repository.js";

const repository =
  new ProductRepository();

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

* Manejo HTTP.

```javascript
import { ProductService }
  from "../services/product.service.js";

const service =
  new ProductService();

export class ProductController {

  async create(req, res) {
    const product =
      await service.create(req.body);

    return res.status(201).json(product);
  }

  async findAll(req, res) {
    const products =
      await service.findAll();

    return res.json(products);
  }
}
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

* Crear producto correctamente.
* Error por datos inválidos.

### GET

* Obtener productos.
* Obtener producto por ID.

### PUT

* Actualizar producto.

### DELETE

* Eliminar producto.

---

## Ejemplo de Test

```javascript
import request from "supertest";
import app from "../src/app.js";

describe("POST /products", () => {

  test(
    "Debe crear un producto",
    async () => {

      const response =
        await request(app)
          .post("/api/products")
          .send({
            name: "Notebook",
            description: "Lenovo",
            price: 750000,
            stock: 10
          });

      expect(
        response.statusCode
      ).toBe(201);

    }
  );

});
```

---

# Desafío Adicional

Implementar:

* Paginación.
* Filtros.
* Ordenamiento.
* Búsqueda por nombre.
* Soft Delete.
