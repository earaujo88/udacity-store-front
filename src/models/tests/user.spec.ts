import { User, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('UserStore', () => {
    let testUser: User;

    beforeAll(async () => {
        testUser = await userStore.create({
            first_name: 'Eduardo',
            last_name: 'Araujo',
            username: 'earaujo',
            password_digest: 'password123',
        });
    });

    it('should create a new user', async () => {
        const user = await userStore.create({
            first_name: 'Eduardo',
            last_name: 'Araujo',
            username: 'earaujo2',
            password_digest: 'pass123',
        });
        expect(user).toBeDefined();
        expect(user.username).toEqual('earaujo2');
    });

    it('should retrieve a user by id', async () => {
        const user = await userStore.show(testUser.id as unknown as string);
        expect(user).toBeDefined();
        expect(user.username).toEqual(testUser.username);
    });

    it('should retrieve all users', async () => {
        const users = await userStore.index();
        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThan(0);
    });
});