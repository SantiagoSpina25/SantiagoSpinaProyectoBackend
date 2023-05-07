import dotenv from "dotenv"
dotenv.config()


export default {
    server: {
        NODE_ENV: process.env.NODE_ENV
    },
    mongodb: {
        cnxStr: 'mongodb+srv://SantiagoS25:DorYX1wV1jFge3Nq@clustercoderhousebacken.cdkg6du.mongodb.net/ProyectoBackend-SantiagoSpina',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}