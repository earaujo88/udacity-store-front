import supertest from "supertest";
import app from '../../server';
import { Order, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';
import { generateToken } from '../../util/tokenOperations';

const request = supertest(app);
const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

describe('OrderStore', () => {
    let testOrder: Order;
    let testUser: User;
    let testProduct: Product;
    let testToken: string;

    beforeAll(async () => {
        testUser = await userStore.create({first_name: 'Roberta', last_name: 'Quito', username: 'rquito', password_digest: '123'});
        testProduct = await productStore.create({name: 'Product 1', price: 100, category: 'new product'});
        testOrder = await orderStore.create({ status: 'pending', user_id: testUser.id as Number});
        testToken = generateToken(testUser)
        
    });

    it('should get all orders', async () => {
        const response = await request.get('/orders');
        expect(response.status).toBe(200);
    });

    it('should retrieve an order by id', async () => {
        const response = await request.get(`/orders/${testOrder.id}`);
        expect(response.status).toBe(200);
    });

    it('should return a not found for a order not found', async () => {
        const response = await request.get('/orders/900000');
        expect(response.status).toBe(404);
    });

    it('should create a new order', async () => {
        const response = await request.post('/orders').set('Authorization', testToken).send({'status': 'completed', 'user_id': testUser.id});
        expect(response.status).toBe(200)
    });

    it('should add a product to a order', async () => {
        const response = await request.post(`/orders/${testOrder.id}/products`).set('Authorization', testToken).send({'quantity': 4, 'product_id': testProduct.id, 'order_id': testOrder.id});
        expect(response.status).toBe(200)
    });

    it('should return no authorized for no token passed', async () => {
        const response = await request.get(`/orders/${testOrder.id}/products`);
        expect(response.status).toBe(401);
    });

    it('should retrieve all products related to an order', async () => {
        const response = await request.get(`/orders/${testOrder.id}/products`).set('Authorization', testToken);
        expect(response.status).toBe(200);
    });

});