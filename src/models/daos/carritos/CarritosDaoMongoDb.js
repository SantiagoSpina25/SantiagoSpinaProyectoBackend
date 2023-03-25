import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js"


class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super("carritos", {
            productos: {type: [], required: true}
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

    async actualizarCarrito(id, newCart){
        const {productos} = newCart

        const updateCart = await this.coleccion.replaceOne({"_id": id},{productos: productos})
        return updateCart
    }

    async borrarCarrito(id){
        await this.coleccion.deleteOne({ "_id": id })
    }

    
}

export default CarritosDaoMongoDb