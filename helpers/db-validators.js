// Importación modelo Rol
const {
    Categoria,
    Usuario,
    Producto
} = require('../models');

const Role = require('../models/rol');
//------------------------------------------------

const esRolValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya está registrado`);
    }
}


const exiteUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) throw new Error(`El Usuario con ${id} no existe`);
}

/* 
            Validadores de categorías
*/
// Verificar si existe categoría por id
const existeCategoriaPorId = async(id) => {
    // Validamos que el id de la categoría que enviamos como parámetro, exista
    const existeCategoria = await Categoria.findById(id);
    // Si no existe la categoría
    if (!existeCategoria) throw new Error(`La categoría con el  ${id} no existe`);

}

// Validar que el nombre ingresado no se repita en la base de datos
const existeNombre = async(nombre) => {
    nombre = nombre.toUpperCase();
    const existeNombre = await Categoria.findOne({ nombre });

    if (existeNombre) throw new Error(`La categoría con el nombre ${nombre} ya está registrado`);
}


/* 
        Validadore de Productos
*/
//Validar que el id del producto que se envió, exista en la base de datos
const existeProductoPorId = async(id) => {
    // Validamos que el id del producto que enviamos como parámetro, exista
    const existeProducto = await Producto.findById(id);
    // Si no existe el producto
    if (!existeProducto) throw new Error(`El Producto con el  ${id} no existe`);
}

module.exports = {
    esRolValido,
    emailExiste,
    exiteUsuarioPorId,
    existeCategoriaPorId,
    existeNombre,
    existeProductoPorId
}