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
