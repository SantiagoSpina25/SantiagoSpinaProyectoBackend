
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
import productosFake from "./src/routes/fakerRouter.js"

import minimist from "minimist"

import { fork } from "child_process"

import passport from "passport"
import { Strategy } from "passport-local"
const LocalStrategy = Strategy

import compression from "compression"

import { createTransport } from "nodemailer";


/*----------- Base de datos -----------*/

import ContenedorMongoDb from "./src/models/containers/ContenedorMongoDb.js"

export const usuariosDb = new ContenedorMongoDb("usuarios", {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        edad: { type: Number, required: true },
        telefono: { type: String, required: true },
        foto: { type: String, required: false }
})



/*----------- Socket.io -----------*/

import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'


const app = express()


const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

io.on("connection", socket =>{
    console.log("Nuevo cliente conectado")
})

/*============================[Middlewares]============================*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression())


// /*----------- Passport -----------*/

passport.use(new LocalStrategy(
    async function (username, password, done) {
        // console.log(`${username} ${password}`)

        //Logica para validar si un usuario existe
        await usuariosDb.listar(username).then(data=>{

            const usuarioEncontrado = data.find(usuario=> usuario.username == username)

            if(usuarioEncontrado){
                const userPassword = usuarioEncontrado.password
                const match = verifyPass(userPassword, password)
                match.then((v)=>{
                    if (v == false) {
                        console.log("Contraseña no coincide")
                        return done(null, false)
                    }
                    return done(null, data);
                    
                })
                
            }
            else{
                console.log("Usuario no encontrado en la DB")
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



// /*----------- Session -----------*/
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

app.set('views', 'src/views');
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
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
    if (!req.user.contador) {
        req.user.contador = 1
    } else {
        req.user.contador++
    }
    const datosUsuario = {
        nombre: req.user.username,
        email: req.user.email,
        edad: req.user.edad,
        telefono: req.user.telefono,
        foto: req.user.foto
    }
    
    res.render('datos', { contador: req.user.contador, datos: datosUsuario });
    
})




app.post('/register', async (req, res) => {
    const { username, password, email, edad, telefono, foto } = req.body;
    const newUser = {
        username: username,
        password: await generateHashPassword(password),
        email: email,
        edad: edad,
        telefono: telefono,
        foto: foto
    }

    await usuariosDb.listar(username).then(data=>{
        
        const usuarioEncontrado = data.find(usuario=> usuario.username == username)

        if(usuarioEncontrado){
            console.log("Usuario ya existente")
            res.redirect("/register-error")
        }else{
            console.log("Nuevo usuario creado")
            usuariosDb.guardar(newUser)


            // Envio de mail al admin sobre el registro //


            const transporter = createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: process.env.ADMIN_MAIL,
                    pass: 'qwphpvoyjwkjkvfd'
                }
            });

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
                    // console.log(data)
                })
            }
            catch(e){
                console.log(e)
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

/*============================[Servidor]============================*/


/*----------- Minimist -----------*/
let options = { alias: { p: "port"}, default: { p: 8080 } }

let args = minimist(process.argv.slice(2), options)
const PORT = args.port 

const server = httpServer.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`)
})
server.on('error', error => {
    const cuserr = new CustomError(500, '`Error en el servidor', error);
    logger.error(cuserr);
    throw cuserr;
});

export default app