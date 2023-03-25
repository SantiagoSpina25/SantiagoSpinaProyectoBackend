import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super("productos", {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            thumbnail: { type: String, required: false },
            stock: { type: Number, required: true }
        })
    }

    async listarProducto(id){
        const readItem = await this.coleccion.find({ "_id": id })
        if (readItem.length == 0){
            throw new Error('No se encontro el producto')
        }
        else{
            return readItem
        }
    }
    
    async actualizarProducto(id, newProduct){
        const {title, price, thumbnail, stock} = newProduct

        const updateProduct = await this.coleccion.replaceOne({"_id": id},{title: title,price: price,thumbnail: thumbnail,stock: stock})
        return updateProduct
    }

    async borrarProducto(id){
        await this.coleccion.deleteOne({ "_id": id })
    }
    
}

export default ProductosDaoMongoDb