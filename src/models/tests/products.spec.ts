import { Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('ProductStore', () => {
    let testProduct: Product;

    beforeAll(async () => {
        testProduct = await productStore.create({
            name: 'Product 1',
            price: 100,
            category: 'Product 1 category',
        });
    });

    it('should create a new product', async () => {
        const product = await productStore.create({
            name: 'Product 2',
            price: 50,
            category: 'Product 2 category',
        });
        expect(product).toBeDefined();
        expect(product.name).toEqual('Product 2');
    });

    it('should retrieve a product by id', async () => {
        const product = await productStore.show(testProduct.id as unknown as string);
        expect(product).toBeDefined();
        expect(product.name).toEqual(testProduct.name);
    });

    it('should retrieve all products', async () => {
        const products = await productStore.index();
        expect(products).toBeDefined();
        expect(products.length).toBeGreaterThan(0);
    });
});