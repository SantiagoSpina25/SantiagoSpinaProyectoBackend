
/*============================[Modulos]============================*/

import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js"


class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super("carritos", {
            email: {type: String, required: true},
            timestamp: {type: Number, required: true},
            products: {type: [], required: true},
            adress: {type: String, required: true}

        })
    }

    async listarCarrito(id){
        const readItem = await this.coleccion.find({ "_id": id })
        if (readItem.length == 0){
            throw new Error('No se encontro el carrito')
        }
        else{
            return readItem
        }
    }

    async listarCarritoByEmail(email){
        const readItem = await this.coleccion.find({ "email": email })
        if (readItem.length == 0){
            throw new Error('No se encontro el carrito')
        }
        else{
            return readItem
        }
    }

    async actualizarCarrito(id, newCart){
        const {email, timestamp, products, adress} = newCart

        const updateCart = await this.coleccion.replaceOne({"_id": id},{email: email, timestamp: timestamp, products: products, adress: adress})
        return updateCart
    }

    async borrarCarrito(id){
        await this.coleccion.deleteOne({ "_id": id })
    }

    
}

export default CarritosDaoMongoDb