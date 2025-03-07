import express, {Request, Response} from 'express'
import {Order, OrderStore} from '../models/order'
import { validateToken} from '../util/tokenOperations';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
    const orders = await store.index()
    res.json(orders)
}

const show = async (req: Request, res: Response) => {
    const order = await store.show(req.params.id)
    if(!order){
        res.status(404)
        res.json(`Order ${req.params.id} not found`)
    }
    res.json(order)
}

const create = async (req: Request, res: Response) => {

    try {

        const authorizationHeader = req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }

    try {

        const order: Order = {
            status: req.body.status,
            user_id: parseInt(req.body.user_id)
        }
       
        const newOrder = await store.create(order)
        
        res.json(newOrder)

    } catch(err) {
        res.status(400)
        res.json(`${err} failed to create order `)
    }
}

const addProduct = async (req: Request, res: Response) => {

    try {

        const authorizationHeader = req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }

    try {

        const quantity = parseInt(req.body.quantity)
        const order_id = parseInt(req.body.order_id)
        const product_id = parseInt(req.body.product_id)
        const addedProducts = await store.addProduct(quantity, order_id, product_id)
        
        res.json(addedProducts)

    } catch(err) {
        res.status(400)
        res.json(`${err} failed to create order `)
    }
}

const showProductsOrder = async (req: Request, res: Response) => {
    try {

        const authorizationHeader = req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }
    
    try {

        

       const productsOrder = await store.showProductsOrder(req.params.id)
        
        res.json(productsOrder)

    } catch(err) {
        res.status(400)
        res.json(`${err} failed to get products from order ${req.params.id} `)
    }
}

const order_routes = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', create)
    app.post('/orders/:id/products', addProduct)
    app.get('/orders/:id/products', showProductsOrder)
}

export default order_routes