import Client from '../database'
import { Order } from './order'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string
const saltRounds = process.env.SALT_ROUNDS as string


export type User = {
    id? : Number;
    first_name : string;
    last_name: string;
    username: string;
    password_digest: string;
}

export class UserStore {
    async index(): Promise<User[]>{
        try{
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release()
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get users ${err}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)'     
            console.log(sql)     
            const conn = await Client.connect()        
            const result = await conn.query(sql, [id])        
            conn.release()    
        return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`)
        }
      }
    
      async create(u: User): Promise<User> {
        try {
            
            const hash = bcrypt.hashSync(
                u.password_digest + pepper, 
                parseInt(saltRounds)
             );

            const sql = `INSERT INTO users (first_name, last_name, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *`
            // @ts-ignore
            const conn = await Client.connect()

            console.log(sql)
    
            const result = await conn
                .query(sql, [u.first_name, u.last_name, u.username, hash])
    
            const user = result.rows[0]
            
            conn.release()
    
            return user
          } catch (err) {
            console.log(err)
            throw new Error(`Could not add new user. Error: ${err}`)
          }
      }

      async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)'     
            console.log(sql)     
            const conn = await Client.connect()        
            const result = await conn.query(sql, [id])        
            conn.release()    
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not remove user ${id}. Error: ${err}`)
        }
      }

      async authenticate (username: string, password: string): Promise<User | null> {

        const sql = 'SELECT password_digest FROM users WHERE username=($1)'
        const conn = await Client.connect()
        const result = await conn.query(sql, [username])
        console.log(sql)
        conn.release() 

        if(result.rows.length) {

            const user = result.rows[0]
      
            console.log(user)
      
            if (bcrypt.compareSync(password+pepper, user.password_digest)) {
              return user
            }
          }
          return null
      }

      async showUserOrder(id: string): Promise<Promise<Order>[]> {
        try {
            const sql = 'SELECT * FROM orders WHERE user_id=($1)'     
            console.log(sql)     
            const conn = await Client.connect()        
            const result = await conn.query(sql, [id])        
            conn.release()    
            return result.rows
        } catch (err) {
            throw new Error(`Could not find orders for user ${id}. Error: ${err}`)
        }
      }
}