import ContenedorMongoDb from "../models/ContenedorMongoDb.js"
import { createdFakeProducts } from "../mocks/productos-fake.js"



export const productosDB = new ContenedorMongoDb("productos", {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: false },
    stock: { type: Number, required: true }
})

const getProductosController = async (req, res)=>{
    try {
        productosDB.listarAll().then((productos)=>{
            res.json(productos)

            //Para cuando haya una vista ->
            // res.render('productos-disponibles', { contador: req.user.contador, datos: datosUsuario })
        })
    } catch (error) {
        console.log(`Error ${error}`)
    }
}


const getProductosControllerById = async (req,res)=>{
    try {

        let id = req.params.id

        productosDB.listarItem(id).then((producto)=>{
            res.json(producto)
        })

    } catch (error) {
        console.log(`Error ${error}`)
    }
}

const postProductosController = async (req,res)=>{
    try {
        
        const {title, price, thumbnail, stock} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }

        productosDB.guardar(newProduct)
        res.send("Producto subido correctamente")

    } catch (error) {
        console.log(`Error ${error}`)
    }
}

const updateProductosController = async (req,res)=>{
    try {
        let id = req.params.id
        
        const {title, price, thumbnail, stock} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }

        productosDB.actualizarProducto(id, newProduct)
        res.send("Producto actualizado correctamente")

    } catch (error) {
        console.log(`Error ${error}`)
    }
}

const deleteProductosController = async (req,res)=>{
    try {

        let id = req.params.id
        productosDB.borrarItem(id)
        res.send("Producto eliminado correctamente")

    } catch (error) {
        console.log(`Error ${error}`) 
    }
}

const fakeProductosController = async (req,res)=>{
    try {
        res.json(createdFakeProducts(10))
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}













export {
    getProductosController,
    getProductosControllerById,
    postProductosController,
    updateProductosController,
    deleteProductosController,
    fakeProductosController
}

