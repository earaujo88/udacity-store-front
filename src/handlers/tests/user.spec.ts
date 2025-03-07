import supertest from "supertest";
import app from '../../server';
import { User, UserStore } from '../../models/user';
import { generateToken } from '../../util/tokenOperations';

const request = supertest(app);
const userStore = new UserStore();

describe('UserStore', () => {

    let testUser: User;
    let testToken: string;

    beforeAll(async () => {
        testUser = await userStore.create({first_name: 'Roberta', last_name: 'Quito', username: 'rquito', password_digest: '123'});        
        testToken = generateToken(testUser)
        
    });

    it('should get all users', async () => {
        const response = await request.get('/users').set('Authorization', testToken);
        expect(response.status).toBe(200);
    });

    it('should retrieve an user by id', async () => {
        const response = await request.get(`/users/${testUser.id}`).set('Authorization', testToken);
        expect(response.status).toBe(200);
    });

    it('should return a not found for a user not found', async () => {
        const response = await request.get('/users/900000').set('Authorization', testToken);
        expect(response.status).toBe(404);
    });

    it('should return no authorized for no token passed', async () => {
        const response = await request.get(`/users/${testUser.id}`);
        expect(response.status).toBe(401);
    });

    it('should create a new user', async () => {
        const response = await request.post('/users').set('Authorization', testToken).send({first_name: 'Roberta 2', last_name: 'Quito', username: 'rquito2', password_digest: '123'});
        expect(response.status).toBe(200)
    });
});