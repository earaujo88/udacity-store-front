import Client from '../database'

export type Order = {
    id? : Number;
    status : string,
    user_id : Number
}

export type OrderProducts = {
    id? : Number,
    quantity: Number,
    order_id : Number,
    product : Number
}

export class OrderStore {
    async index(): Promise<Order[]>{
        try{
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release()
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get orders ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'     
            console.log(sql)     
            const conn = await Client.connect()        
            const result = await conn.query(sql, [id])        
            conn.release()    
        return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
      }
    
      async create(o: Order): Promise<Order> {
        try {
            
            const sql = `INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *`
            // @ts-ignore
            const conn = await Client.connect()

            console.log(sql)
    
            const result = await conn
                .query(sql, [o.status, o.user_id])
    
            const order = result.rows[0]
            conn.release()
    
            return order

          } catch (err) {
            console.log(err)
            throw new Error(`Could not add new order. Error: ${err}`)
          }
      }

      async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)'     
            console.log(sql)     
            const conn = await Client.connect()        
            const result = await conn.query(sql, [id])        
            conn.release()    
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`)
        }
      }

      async showProductsOrder(id: string): Promise<Promise<OrderProducts>[]> {
        try {
            const sql = 'SELECT * FROM order_products WHERE order_id=($1)'     
            console.log(sql)     
            const conn = await Client.connect()        
            const result = await conn.query(sql, [id])        
            conn.release()    
            return result.rows
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
      }

      async addProduct(quantity: Number, orderId: Number, productId: Number): Promise<OrderProducts> {
        try {
            

            const sql = `INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *`
            // @ts-ignore
            const conn = await Client.connect()

            console.log(sql)
    
            const result = await conn
                .query(sql, [quantity, orderId, productId])
    
            const addedProduct = result.rows[0]
            conn.release()
    
            return addedProduct

          } catch (err) {
            console.log(err)
            throw new Error(`Could not add new product to order ${orderId}. Error: ${err}`)
          }
      }
}