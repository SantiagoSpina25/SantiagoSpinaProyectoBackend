import dotenv from "dotenv"
dotenv.config()


export default {
    server: {
        NODE_ENV: process.env.NODE_ENV
    },
    mongodb: {
        cnxStr: 'mongodb+srv://SantiagoS25:2qKCGRW9753xqyjD@clustercoderhousebacken.cdkg6du.mongodb.net/ProyectoBackend-SantiagoSpina',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // serverSelectionTimeoutMS: 5000,
        }
    }
}