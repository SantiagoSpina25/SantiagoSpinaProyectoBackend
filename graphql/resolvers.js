import { productosDB } from "../src/controllers/productosController.js";


export async function obtenerProductos(){
    return await productosDB.listarAll().then((productos)=>{
        return productos
    });
}

export async function obtenerProducto({id}){
    return await productosDB.listarProducto(id).then((producto)=>{  
        return producto
    })
}

export function crearProducto({ datos }) {

    const {title, price, thumbnail, stock} = datos

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }

        productosDB.guardar(newProduct)

    return newProduct
}

export function actualizarProducto({ id, datos }) {

    const {title, price, thumbnail, stock} = datos

    const newProduct = {
        title: title,
        price: price,
        thumbnail: thumbnail,
        stock: stock
    }

    productosDB.actualizarProducto(id, newProduct)
    return newProduct
}

export function borrarProducto({ id }) {
    productosDB.borrarProducto(id)
}