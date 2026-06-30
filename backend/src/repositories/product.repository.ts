import { Product } from '../models/product.model';

export class ProductRepository {
    private products: Product[] = [];

    public async findAll(): Promise<Product[]> {
        return this.products;
    }

    public async findById(id: string): Promise<Product | null> {
        const product = this.products.find(p => p.id === id);
        return product || null;
    }

    public async create(productData: Product): Promise<Product> {
        const newProduct = { ...productData, id: this.generateId() };
        this.products.push(newProduct);
        return newProduct;
    }

    public async update(id: string, productData: Partial<Product>): Promise<Product | null> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        const updatedProduct = { ...this.products[index], ...productData };
        this.products[index] = updatedProduct;
        return updatedProduct;
    }

    public async delete(id: string): Promise<boolean> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;
        this.products.splice(index, 1);
        return true;
    }

    private generateId(): string {
        return (Math.random() * 1000000).toString(36);
    }
}