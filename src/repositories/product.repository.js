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
