
/*============================[Modulos]============================*/

import CustomError from "../../classes/CustomError.class.js"
import logger from "../../config/loggers.js"
import ordenesDao from "../models/daos/index.js"


export const ordenesDB = ordenesDao.ordenesDao

const getOrdenesController = async (req, res)=>{
    try {
        ordenesDB.listarAll().then((ordenes)=>{
            res.json(ordenes)
        })
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarAll()', error);
        logger.error(cuserr);
        res.json(cuserr)
    }
}


const getOrdenesControllerById = async (req,res)=>{
    try {

        let id = req.params.id
    
        ordenesDB.listarOrdenById(id).then((orden)=>{
            res.json(orden)
        })
        
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        res.json(cuserr)
    }
}

const postOrdenesController = async (req,res)=>{
    try {
        
        const {items, orderNumber, date, state, email} = req.body

        const newOrder = {
            items: items,
            orderNumber: orderNumber,
            date: date,
            state: state,
            email: email
        }

        ordenesDB.guardar(newOrder)
        res.send("Orden subida correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        res.json(cuserr)
    }
}

const updateOrdenesController = async (req,res)=>{
    try {
        let id = req.params.id
        
        const {items, orderNumber, date, state, email} = req.body

        const newOrder = {
            items: items,
            orderNumber: orderNumber,
            date: date,
            state: state,
            email: email
        }

        ordenesDB.actualizarOrden(id, newOrder)
        res.send("Orden actualizada correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al actualizar:', error);
        logger.error(cuserr);
        res.json(cuserr)
    }
}

const deleteOrdenesController = async (req,res)=>{
    try {

        let id = req.params.id
        ordenesDB.borrarOrden(id)
        res.send("Orden eliminada correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        res.json(cuserr)
    }
}


export {
    getOrdenesController,
    getOrdenesControllerById,
    postOrdenesController,
    updateOrdenesController,
    deleteOrdenesController
}

