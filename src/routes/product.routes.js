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
