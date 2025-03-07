
import { Order, OrderProducts, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';

const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

describe('OrderStore', () => {
    let testOrder: Order;
    let testUser: User;
    let testProduct: Product;

    beforeAll(async () => {
        testUser = await userStore.create({first_name: 'Roberta', last_name: 'Quito', username: 'rquito', password_digest: '123'});
        console.log(testUser)
        testProduct = await productStore.create({name: 'Product 1', price: 100, category: 'new product'});
        testOrder = await orderStore.create({ status: 'pending', user_id: testUser.id as Number});
    });

    it('should create a new order', async () => {
        const order = await orderStore.create({ status: 'oromanara', user_id: testUser.id as Number });
        console.log(order)
        expect(order).toBeDefined();
        expect(order.status).toEqual('oromanara');
        expect(order.user_id).toEqual(testUser.id as Number);
    });

    it('should retrieve an order by id', async () => {
        const order = await orderStore.show(testOrder.id as unknown as string);
        expect(order).toBeDefined();
        expect(order.id).toEqual(testOrder.id);
    });

    it('should retrieve all orders', async () => {
        const orders = await orderStore.index();
        expect(orders).toBeDefined();
        expect(orders.length).toBeGreaterThan(0);
    });

    it('should add a product to an order', async () => {
        const addedProduct = await orderStore.addProduct(2, testOrder.id as number, testProduct.id as Number);
        expect(addedProduct).toBeDefined();
        console.log(addedProduct)
        expect(addedProduct.order_id).toEqual(testOrder.id as Number);
    });

    it('should get products by order id', async () => {
        const products = await orderStore.showProductsOrder(testOrder.id as unknown as string);
        expect(products).toBeDefined();
    });
});