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
