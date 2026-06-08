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
