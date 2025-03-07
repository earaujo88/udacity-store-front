import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import {User} from '../models/user'
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string

function generateToken (user: User): string {
    const token = jwt.sign({ user: user }, tokenSecret );
    return token
}

function validateToken (tokenHeader: string) {
    jwt.verify(tokenHeader, tokenSecret)
}

export{
    generateToken,
    validateToken
};