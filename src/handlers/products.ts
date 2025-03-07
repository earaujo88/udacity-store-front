import express, {Request, Response} from 'express'
import {Product, ProductStore} from '../models/product'
import { validateToken} from '../util/tokenOperations';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index()
    res.json(products)
}

const show = async (req: Request, res: Response) => {
    const products = await store.show(req.params.id)

    if(!products){
        res.status(404)
        res.json(`Product ${req.params.id} not found`)
    }

    res.json(products)
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

        const product: Product = {

            name : req.body.name,
            price : parseInt(req.body.price),
            category : req.body.category

        }

        
        const newProduct = await store.create(product)
        
        

        res.json(newProduct)

    } catch(err) {
        res.status(400)
        res.json(`${err} failed to create product `)
    }
}

const product_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', create)
}

export default product_routes