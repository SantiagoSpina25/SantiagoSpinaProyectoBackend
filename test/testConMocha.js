import mongoose from 'mongoose'
import supertest from 'supertest'
import { expect } from 'chai'
import { createFakeProduct } from "../src/mocks/productos-fake.js"
import app from "../server.js"
import config from "../config/config.js"
import CustomError from "../classes/CustomError.class.js"
import logger from "../config/loggers.js"


let request
let server

let id = "642998200d62c6f92b7c1cf1"

describe("Test api-restfull",  ()=>{

    before(async function () {
        await connectDb()
        server = await startServer()
        request = supertest(`http://localhost:${server.address().port}/productos`)
        console.log('/*============================[COMIENZO DE TEST]============================*/')
    })

    after(function () {
        mongoose.disconnect()
        server.close()
        console.log('/*============================[FIN DE TEST]============================*/')
    })


    describe('GET', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get('/')
            expect(response.status).to.eql(200)
        })
    })

    describe('GET BY ID', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get(`/${id}`)
            expect(response.status).to.eql(200)
        })
    })

    describe('POST', () => {
        it('debería incorporar un producto', async () => {
            const producto = createFakeProduct()

            const response = await request.post('/').send(producto)
            expect(response.status).to.eql(200)

            expect(producto).to.include.keys("title", "price", "thumbnail", "stock")
        })
    })

    describe('PUT', () => {
        it('debería actualizar un producto', async () => {

            const producto = createFakeProduct()
            const response = await request.put(`/${id}`).send(producto)

            expect(response.status).to.eql(200)

            expect(producto).to.include.keys("title", "price", "thumbnail", "stock")
        })
    })

    describe('DELETE', () => {
        it('debería eliminar un producto', async () => {

            const response = await request.delete(`/${id}`)
            expect(response.status).to.eql(200)

        })
    })










})










async function connectDb() {
    try {
        await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
        console.log('Base de datos conectada!');

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al conectarse a la DB', error)
        logger.error(cuserr);
        throw cuserr;
    }
}

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 8081
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            const cuserr = new CustomError(500, 'Error al conectarse a el servidor', error)
            logger.error(cuserr);
            reject(error)
        });
    })
}