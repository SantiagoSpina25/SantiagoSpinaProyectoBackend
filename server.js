
/*============================[Modulos]============================*/

import express from "express"
import session from "express-session"
import exphbs from 'express-handlebars'
import path from 'path'
import { generateHashPassword , verifyPass } from "./src/scripts/bcrypt.js"
import logger from "./config/loggers.js"
import CustomError from "./classes/CustomError.class.js"

import productosRouter from "./src/routes/productosRouter.js"
import carritosRouter from "./src/routes/carritosRouter.js"
import ordenesRouter from "./src/routes/ordenesRoutes.js"
import mensajesRouter from "./src/routes/mensajesRouter.js"
import productosFake from "./src/routes/fakerRouter.js"

import minimist from "minimist"

import { fork } from "child_process"

import passport from "passport"
import { Strategy } from "passport-local"
const LocalStrategy = Strategy

import compression from "compression"




/*----------- Base de datos -----------*/

import ContenedorMongoDb from "./src/models/containers/ContenedorMongoDb.js"

export const usuariosDb = new ContenedorMongoDb("usuarios", {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        edad: { type: Number, required: true },
        telefono: { type: String, required: true },
        foto: { type: String, required: false },
        adress: { type: String, required: true },
        carrito: { type: String, required: true }
})

/*----------- Transporter -----------*/

import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.ADMIN_MAIL,
        pass: 'qwphpvoyjwkjkvfd'
    }
});

/*----------- Socket.io -----------*/

import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { mensajesDB } from "./src/controllers/mensajesController.js"
import { carritosDB } from "./src/controllers/carritosController.js"
import { productosDB } from "./src/controllers/productosController.js"
import { ordenesDB } from "./src/controllers/ordenesController.js"



const app = express()


const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)



io.on("connection", socket =>{
    

    socket.on("newMessage", data =>{

        const {email, type, date, message} = data
        
        const newMessage = {
            email: email,
            type: type,
            date: date,
            message: message
        }

        mensajesDB.guardar(newMessage)

    })

    socket.on("newAddedProduct", data=>{
        const {prod_id, carritoId} = data

        productosDB.listarProducto(prod_id).then((producto)=>{
            const productoEncontrado = producto.find(producto => producto._id == prod_id)


            carritosDB.listarCarrito(carritoId).then((carrito)=>{
                const carritoEncontrado = carrito.find(carrito => carrito._id == carritoId)
                
                const carritoReal = carritoEncontrado._doc
                
                carritoEncontrado.products.push(productoEncontrado)
                const newCart = {...carritoReal}
                
                carritosDB.actualizarCarrito(carritoId, newCart)
            })        
        })
    })

    socket.on("newOrder", data=>{   
        const {carritoId, email} = data 

        carritosDB.listarCarrito(carritoId).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == carritoId)
            const productosEnCarrito = carritoEncontrado.products
            
            let fecha = new Date()
            const timestamp = fecha.getTime()

            ordenesDB.listarAll().then(ordenes=>{
                let orderNumber
                ordenes.length === 0 ? orderNumber = 1 : orderNumber = ordenes[ordenes.length - 1].orderNumber + 1 
                
                const newOrden = {
                    items: productosEnCarrito,
                    orderNumber: orderNumber,
                    date: timestamp,
                    state: "generada",
                    email: email
                }
    
                ordenesDB.guardar(newOrden)

                // Envio de mail 

                let fechaActual = new Date(newOrden.date)
                let fechaFachera = fechaActual.toLocaleString()

                const mailOptions = {
                    from: "Proyecto Backend (Santiago Spina)",
                    to: process.env.ADMIN_MAIL,
                    subject: "Nueva orden!",
                    html: `<h1 style="color: blue"> Se detectó una neuva orden en la app! </h1>
                           <h2>Los datos son:</h2>
                           <ul>
                               <li>MAIL: ${newOrden.email}</li> 
                               ${newOrden.items.map(prod=>{
                                    return `<li>Productos: ${prod.title}</li>
                                            <h4>Precio: ${prod.price}</h4>`
                               })}
                               <li>Fecha del pedido: ${fechaFachera}</li>
                           </ul> `
                }

                transporter.sendMail(mailOptions).then(data=>{
                })

            })

        })

    })


    

})



/*============================[Middlewares]============================*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression())


/*----------- Passport -----------*/

passport.use(new LocalStrategy(
    async function (username, password, done) {

        //Logica para validar si un usuario existe
        await usuariosDb.listar(username).then(data=>{

            const usuarioEncontrado = data.find(usuario=> usuario.username == username)

            if(usuarioEncontrado){
                const userPassword = usuarioEncontrado.password
                const match = verifyPass(userPassword, password)
                match.then((v)=>{
                    if (v == false) {
                        const cuserr = new CustomError(500, 'Contraseña no coincide', "error");
                        logger.error(cuserr);
                        return done(null, false)
                    }
                    return done(null, data);
                    
                })

            }
            else{
                const cuserr = new CustomError(500, 'Usuario no encontrado en la DB', "error");
                logger.error(cuserr);
                return done(null, false);
            }
        })
    }
    ))
    

passport.serializeUser((user, done)=> {
    const usuario = user[0]
    done(null, usuario.username);
})
  
passport.deserializeUser((username, done)=> {
    usuariosDb.listar(username).then(data=>{
        const usuarioEncontrado = data.find(usuario=> usuario.username == username)
        done(null, usuarioEncontrado);
    })
})



/*----------- Session -----------*/
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000 //10 min
    }
}))

app.use(passport.initialize())
app.use(passport.session())



export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}


/*----------- Motor de plantillas -----------*/
import  {allowInsecurePrototypeAccess}  from '@handlebars/allow-prototype-access'
import Handlebars  from 'handlebars'





app.set('views', 'src/views');
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');






/*============================[Rutas]============================*/


app.get('/', (req, res) => {
    res.redirect('/login')
})


app.get('/login', (req, res) => {
    res.render('login.hbs');
})


app.get('/register', (req, res) => {
    res.render('registro.hbs');
})


app.post('/login', passport.authenticate('local', { successRedirect: '/datos', failureRedirect: '/login-error' }));






app.get('/datos', isAuth, (req, res) => {
    
    const datosUsuario = {
        nombre: req.user.username,
        email: req.user.email,
        edad: req.user.edad,
        telefono: req.user.telefono,
        adress: req.user.adress,
        foto: req.user.foto,
        carrito: req.user.carrito
    }
    
    res.render('datos', { datos: datosUsuario });
    
})




app.post('/register', async (req, res) => {

    const { username, password, email, edad, telefono, adress, foto } = req.body;

    let fecha = new Date()
    const timestamp = fecha.getTime()

    const newCart = {
        email: email,
        timestamp: timestamp,
        products: [],
        adress: adress
    }

    await carritosDB.guardar(newCart)

    const carrito = await carritosDB.listarCarritoByEmail(email).then(cart=>{
        const carrito = cart.find(carrito => carrito.email == email)
        return carrito
    })
    
    const newUser = {
        username: username,
        password: await generateHashPassword(password),
        email: email,
        edad: edad,
        telefono: telefono,
        adress: adress,
        foto: foto,
        carrito: carrito._id
    }
    
    await usuariosDb.listar(username).then(data=>{
        
        const usuarioEncontrado = data.find(usuario=> usuario.username == username)
        const mailEncontrado = data.find(usuario => usuario.email == email)

        if(usuarioEncontrado || mailEncontrado){
            const cuserr = new CustomError(500, 'Usuario ya existente o mail ya utilizado', "error");
            logger.error(cuserr);

            res.redirect("/register-error")
        }else{
            logger.info("Nuevo usuario creado");
            usuariosDb.guardar(newUser)


            // Envio de mail al admin sobre el registro //

            const mailOptions = {
                from: "Proyecto Backend (Santiago Spina)",
                to: process.env.ADMIN_MAIL,
                subject: "Nuevo registro!",
                html: `<h1 style="color: blue"> Se detectó un nuevo registro en la app! </h1>
                       <h2>Los datos son:</h2>
                       <ul>
                           <li>USUARIO: ${newUser.username}</li>
                           <li>MAIL: ${newUser.email}</li> 
                           <li>EDAD: ${newUser.edad}</li>  
                           <li>TELEFONO: ${newUser.telefono}</li>
                       </ul> `
            }

            try{
                transporter.sendMail(mailOptions).then(data=>{
                })
            }
            catch(error){
                const cuserr = new CustomError(500, 'Usuario no encontrado en la DB', error);
                logger.error(cuserr);
            }
            res.redirect('/login')
        }

    })

})



app.get('/logout', (req, res) => {
    req.logOut(err => {
        res.redirect('/');
    });
})


app.get('/login-error', (req, res) => {
    res.render('login-error');
})

app.get('/register-error', (req, res) => {
    res.render('registro-error');
})




app.get('/info', (req, res) => {

    const info = {
        processId : process.pid,
        versionNode : process.version,
        plataforma: process.platform,
        usoDeMemoria: process.memoryUsage().rss,
        directorioActual: process.argv,
        carpetaProyecto: process.cwd()
    }

    res.render('info', { info: info });
})


function calcular(numero){
    return new Promise((res,rej)=>{
        const forkedProcess = fork('./src/scripts/calculoDeNumeros.js')
        forkedProcess.on("message", (msg)=>{
            if(msg == "finalizado"){
                forkedProcess.send(numero)
            }
            else{
                res(msg)
            }
        })
    })
}



app.get('/randoms', async (req,res) => {
    
    const { numeros = 100000000 } = req.query
    
    const resultado = await calcular(numeros)
    res.send(resultado)
})


app.use("/productos", productosRouter)
app.use("/productos-faker", productosFake)
app.use("/carritos", carritosRouter)
app.use("/chat", mensajesRouter)
app.use("/ordenes", ordenesRouter )


/*============================[Servidor]============================*/


/*----------- Minimist -----------*/
let options = { alias: { p: "port"}, default: { p: 8080 } }

let args = minimist(process.argv.slice(2), options)
const PORT = args.port || process.env.PORT

const server = httpServer.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`)
})
server.on('error', error => {
    const cuserr = new CustomError(500, '`Error en el servidor', error);
    logger.error(cuserr);
    throw cuserr;
});

export default app