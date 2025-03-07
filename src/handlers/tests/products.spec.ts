import supertest from "supertest";
import app from '../../server';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';
import { generateToken } from '../../util/tokenOperations';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();

describe('OrderStore', () => {    
    let testUser: User;
    let testProduct: Product;
    let testToken: string;

    beforeAll(async () => {
        testUser = await userStore.create({first_name: 'Roberta', last_name: 'Quito', username: 'rquito', password_digest: '123'});
        testProduct = await productStore.create({name: 'Product 1', price: 100, category: 'new product'});        
        testToken = generateToken(testUser)
        
    });

    it('should get all products', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
    });

    it('should retrieve an product by id', async () => {
        const response = await request.get(`/products/${testProduct.id}`);
        expect(response.status).toBe(200);
    });

    it('should return a not found for a product not found', async () => {
        const response = await request.get('/products/900000');
        expect(response.status).toBe(404);
    });

    it('should create a new product', async () => {
        const response = await request.post('/products').set('Authorization', testToken).send({name: 'Product 1', price: 100, category: 'new product'});
        expect(response.status).toBe(200)
    });   

    it('should return no authorized for no token passed', async () => {
        const response = await request.post('/products').send({name: 'Product 1', price: 100, category: 'new product'});
        expect(response.status).toBe(401)
    });   

});