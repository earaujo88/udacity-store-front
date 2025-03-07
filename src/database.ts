import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config();

const {
    POSTGRESS_HOST,
    POSTGRESS_DB,
    POSTGRESS_USER,
    POSTGRESS_PASSWORD,
    POSTGRESS_TEST_DB,
    ENV
} = process.env

let client = new Pool()
console.log(ENV)

if(ENV === 'test') {
  client = new Pool({
    host: POSTGRESS_HOST,
    database: POSTGRESS_TEST_DB,
    user: POSTGRESS_USER,
    password: POSTGRESS_PASSWORD,
  })
}

if(ENV === 'dev') {
  client = new Pool({
    host: POSTGRESS_HOST,
    database: POSTGRESS_DB,
    user: POSTGRESS_USER,
    password: POSTGRESS_PASSWORD,
  })
}

export default client
