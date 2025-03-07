import express, {Request, Response} from 'express'
import {User, UserStore} from '../models/user'
import { validateToken, generateToken } from '../util/tokenOperations';




const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {

        const authorizationHeader = _req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }
    const users = await store.index()
    res.json(users)
}

const show = async (req: Request, res: Response) => {

    try {

        const authorizationHeader = req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }

    const user = await store.show(req.params.id)
    if(!user){
        res.status(404)
        res.json(`User ${req.params.id} not found`)
    }
    res.json(user)
}

const create = async (req: Request, res: Response) => {

    const tokenSecret = process.env.TOKEN_SECRET as string

    try {

        const authorizationHeader = req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }

    try {

        const user: User = {
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            username : req.body.username,
            password_digest : req.body.password_digest

        }
        const newUser = await store.create(user)
        var token = generateToken(newUser)
        res.json(token)

    } catch(err) {
        res.status(400)
        res.json(`${err} failed to create user `)
    }
}

const authenticate = async (req: Request, res: Response) => {

    try {

        const username = req.body.username
        const password = req.body.password

        const userAuthenticated = await store.authenticate(username, password)

        if(!userAuthenticated){
            res.status(403)
            res.json(`Invalid username or password`)

        }

      

        var token = generateToken(userAuthenticated as User)
         
        res.json(token)
 
     } catch(err) {
         res.status(400)
         res.json(`${err} failed to get orders for user ${req.params.id} `)
     }

}

const showUserOrder = async (req: Request, res: Response) => {
    try {

        const authorizationHeader = req.headers.authorization as string
        validateToken(authorizationHeader)

    } catch(err) {
        res.status(401)
        res.json(`Access denied, invalid token`)
        return
    }
    
    try {

        

       const userOrders = await store.showUserOrder(req.params.id)
        
        res.json(userOrders)

    } catch(err) {
        res.status(400)
        res.json(`${err} failed to get orders for user ${req.params.id} `)
    }
}


const user_routes = (app: express.Application) => {
    app.get('/users', index)
    app.get('/users/:id', show)
    app.post('/users/authenticate', authenticate)
    app.post('/users', create)
    app.get('/users/:id/order', showUserOrder)
}

export default user_routes