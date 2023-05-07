
/*============================[Modulos]============================*/

import CustomError from "../../classes/CustomError.class.js"
import logger from "../../config/loggers.js"
import mensajesDao from "../models/daos/index.js"


export const mensajesDB = mensajesDao.mensajesDao

const getMensajesController = async (req, res)=>{
    try {
        mensajesDB.listarAll().then((messages)=>{

            const datosUsuario = {
                nombre: req.user.username,
                email: req.user.email,
                edad: req.user.edad,
                telefono: req.user.telefono,
                adress: req.user.adress,
                foto: req.user.foto,
                carritoId: req.user.carrito
            }

            res.render("chat", {messages: messages, datos: datosUsuario})         
        })
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarAll()', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const getMensajesControllerByEmail = async (req,res)=>{
    try {

        let email = req.params.email

        mensajesDB.listarMensajeByEmail(email).then((message)=>{
            res.json(message)
        })

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const postMensajesController = async (req,res)=>{
    try {
        
        const {email, type, date, message} = req.body

        const newMessage = {
            email: email,
            type: type,
            date: date,
            message: message
        }

        mensajesDB.guardar(newMessage)
        res.send("Mensaje subido correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const updateMensajesController = async (req,res)=>{
    try {
        let id = req.params.id
        
        const {email, type, date, message} = req.body

        const newMessage = {
            email: email,
            type: type,
            date: date,
            message: message
        }

        mensajesDB.actualizarMensaje(id, newMessage)
        res.send("Mensaje actualizado correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al actualizar:', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const deleteMensajesController = async (req,res)=>{
    try {

        let id = req.params.id
        mensajesDB.borrarMensaje(id)
        res.send("Mensaje eliminado correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}


export {
    getMensajesController,
    getMensajesControllerByEmail,
    postMensajesController,
    updateMensajesController,
    deleteMensajesController
}
