import { buildSchema } from 'graphql';

export const ProductoSchema = buildSchema(`

  input ProductoInput {
    title: String,
    price: Int,
    thumbnail: String,
    stock: Int
  }

  type Producto {
    id: ID!,
    title: String,
    price: Int,
    thumbnail: String,
    stock: Int
  }

  type Query {
    obtenerProductos: [Producto],
    obtenerProducto(id: ID!): Producto
  }

  type Mutation {
    crearProducto(datos: ProductoInput): Producto,
    actualizarProducto(id: ID!, datos: ProductoInput): Producto,
    borrarProducto(id: ID!): Producto
}
`);

// export const CarritosSchema = buildSchema(`
// input CarritoInput {
//     productos: []
//   }

//   type Carrito {
//     id: ID!,
//     productos: []
//   }

//   type Query {
//     obtenerCarritos: [Carrito],
//     obtenerCarrito(id: ID!): Carrito
//   }

//   type Mutation {
//     crearCarrito(datos: CarritoInput): Carrito,
//     actualizarCarrito(id: ID!, datos: CarritoInput): Carrito,
//     borrarCarrito(id: ID!): Carrito
// }
// `)

// export const UsuariosSchema = buildSchema(`
// input UsuarioInput {
//     username: String,
//     password: String,
//     email: String,
//     edad: Int,
//     telefono: Int,
//     foto: String
//   }

//   type Usuario {
//     id: ID!,
//     username: String,
//     password: String,
//     email: String,
//     edad: Int,
//     telefono: Int,
//     foto: String
//   }

//   type Query {
//     obtenerUsuarios: [Usuario],
//     obtenerUsuario(id: ID!): Usuario
//   }

//   type Mutation {
//     crearUsuario(datos: UsuarioInput): Usuario,
//     actualizarUsuario(id: ID!, datos: UsuarioInput): Usuario,
//     borrarUsuario(id: ID!): Usuario
// }
// `)
