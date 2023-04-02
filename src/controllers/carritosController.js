import carritosDao from "../models/daos/index.js"
import { productosDB } from '../controllers/productosController.js';




import { createTransport } from "nodemailer";
import twilio from 'twilio'
import CustomError from "../../classes/CustomError.class.js";
import logger from "../../config/loggers.js";


export const carritosDB = carritosDao.carritosDao


const getCarritosController = async (req,res)=>{
    try {
        carritosDB.listarAll().then((carritos)=>{
            res.json(carritos)
        })
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarAll()', error);
        logger.error(cuserr);
        throw cuserr;
    }
}


const getCarritosControllerById = async (req,res)=>{
    try {

        let id = req.params.id

        const carrito = await carritosDB.listarCarrito(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })

        const carritoReal = carrito._doc
        const carritoConProductos = carritoReal.productos


        const datosUsuario = {
            nombre: req.user.username,
            email: req.user.email,
            edad: req.user.edad,
            telefono: req.user.telefono,
            foto: req.user.foto
        }

        // Envio de mail y mensaje por WhatsApp al admin sobre el pedido //
        const realizarPedido = () =>{

            //Envio de mail
            const transporter = createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: process.env.ADMIN_MAIL,
                    pass: 'qwphpvoyjwkjkvfd'
                }
            });



            let html = `<h1 style="color: blue"> Se detectó un nuevo pedido en la app de ${datosUsuario.nombre}</h1>
                        <h2>Los productos son:</h2>
                        <style>
                            .table td,
                            .table th {
                                vertical-align: middle;
                            }
                        </style>
                        `

                        
            if(carritoConProductos.length > 0){
                html += `
                <div class="table-responsive">
                    <table class="table table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Foto</th>
                            <th>ID</th>
                        </tr>`


            for (const producto of carritoConProductos) {
                html += `
                        <tr>
                        <td>${producto.title}</td>
                        <td>$${producto.price}</td>
                        <td><img width="50" src=${producto.thumbnail} alt="not found"></td>
                        <td>${producto._id}</td>
                        </tr>`
            }
            html += `
                </table>
            </div >`


            }
            else{
                html = "<h3> No se pidió ningun producto!</h2>"
            }

            const mailOptions = {
                from: "Proyecto Backend (Santiago Spina)",
                to: process.env.ADMIN_MAIL,
                subject: `Nuevo pedido de ${datosUsuario.nombre}!`,
                html: html
            }


            transporter.sendMail(mailOptions)


            // Envio de mensaje por Whatsapp

            const accountSid = process.env.TWILIO_ACCOUNT_SID
            const authToken = process.env.TWILIO_AUTH_TOKEN

            const client = twilio(accountSid, authToken)
            const numbers = ['+34640815441']

            let messasge = ''




            let mensaje=
            `Se detectó un nuevo pedido en la app de ${datosUsuario.nombre}
                Los productos son: `

            if(carritoConProductos.length > 0){

            for (const producto of carritoConProductos) {
                mensaje += `
                        -Nombre del producto: ${producto.title}
                        -Precio: $${producto.price}
                        -Url de imagen: ${producto.thumbnail}
                        -ID Producto: ${producto._id}
                        
                        //////////////////////////////
                        `
                        
            }
            }
            else{
                mensaje = "No se pidió ningun producto!"
            }


            for (const number of numbers) {
                messasge = client.messages.create({
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:${number}`,
                    body: mensaje
                }).then(m=>{
                    // console.log(m)
                })
            }


        }
        
        res.render("carrito", {carrito: carritoReal, productos: carritoConProductos, realizarPedido})



    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const postCarritosController = async (req,res)=>{
    try {
        const {productos} = req.body
    
        const newCart = {
            productos: productos
        }
    
        carritosDB.guardar(newCart)
        res.send("Carrito subido correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const putCarritosController = async (req,res)=>{
    try {

        let id = req.params.id
        
        const {productos} = req.body
    
        const newCart = {
            productos: productos
        }

        carritosDB.actualizarCarrito(id, newCart)

        res.send("Carrito actualizado correctamente")
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al actualizar:', error);
        logger.error(cuserr);
        throw cuserr;
    }
}


const deleteCarritosController = async (req,res)=>{
    try {
        let id = req.params.id
        carritosDB.borrarCarrito(id)
        res.send("Carrito eliminado correctamente")
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const getProductosCarritoControllerById = async (req,res)=>{
    try {
       
        let id = req.params.id

        const carrito = await carritosDB.listarCarrito(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })

        const carritoReal = carrito._doc
        const carritoConProductos = carritoReal.productos

        res.json(carritoConProductos)

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const postProductosACarritoController = async (req,res)=>{
    try {
        let prod_id = req.body.id

        const productos = await productosDB.listarItem(prod_id).then((producto)=>{
            const productoEncontrado = producto.find(producto => producto._id == prod_id)
            return productoEncontrado
        })

        
        let id = req.params.id

        const carrito = await carritosDB.listarItem(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })
        const carritoReal = carrito._doc

        const carritoConProductos = carritoReal.productos.push(productos)

        const newCart = {...carritoReal, carritoConProductos}
        carritosDB.actualizarCarrito(id, newCart)

        res.send("Producto subido al carrito correctamente")
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const deleteProductoCarritoController = async (req,res)=>{
    try {
        let prod_id = req.params.prod_id

        let id = req.params.id
    
        const carrito = await carritosDB.listarItem(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })
    
        const carritoReal = carrito._doc
        const carritoConProductos = carritoReal.productos
    
        const index = carritoConProductos.findIndex(prod => prod._id == prod_id)
    
        const carritoConProductoEliminado = carritoConProductos.splice(index, 1)
    
        const newCart = {...carritoReal, carritoConProductoEliminado}
        carritosDB.actualizarCarrito(id, newCart)
    
        res.send("Producto borrado del carrito correctamente")
    
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

export {
    getCarritosController,
    getCarritosControllerById, 
    postCarritosController, 
    putCarritosController, 
    deleteCarritosController, 
    getProductosCarritoControllerById, 
    postProductosACarritoController, 
    deleteProductoCarritoController
}