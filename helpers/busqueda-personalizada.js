const { request, response } = require("express");
// Esta importación sirve para ejecutar la función isValid() en mongo
const { ObjectId } = require('mongoose').Types;
const {
    Usuario,
    Producto,
    Categoria
} = require('../models');


// Buscamos el usuario por un término (nombre o correo)
const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);

        return res.json({
            /* Si no se encontró al usuario, la variable usuario se le asignará null,
            sin embargo mostrar eso como resultado es incorrecto por que significa
            que sí hay algo.
            usaremos el operador ternario para decir que si la variable usuario está 
            vacía, meterla en un arreglo y si no dejar el arreglo vacío. */
            results: (usuario) ? [usuario] : []
        });
    }

    // esta expresión regular hacer que término sea insensible 
    // a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i');


    // retorna a todos los usuarios que tengan coincidencias con ese nombre
    // si no hay coincidencias, retorna un arreglo vacío
    const usuario = await Usuario.find({
        // Tenemos que saber si está buscando por nombre o por correo
        // Para ello usaremos operadores lógicos de mongo

        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        results: usuario
    });

}


// Buscamos el usuario por un categoría

const buscarCategoria = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        // Búsqueda por el ID de la categoría
        const categoria = await Categoria.findById(termino);

        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    // esta expresión regular hacer que término sea insensible 
    // a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i');


    const categoria = await Categoria.find({
        // Tenemos que saber si está buscando por nombre o por correo
        // Para ello usaremos operadores lógicos de mongo
        $and: [{ nombre: regex }, { estado: true }]
    });
    res.json({
        results: categoria
    });

}


// Buscar por productos
const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        // Búsqueda por el ID del producto
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    // esta expresión regular hacer que término sea insensible 
    // a mayúsculas y minúsculas
    const regex = new RegExp(termino, 'i');


    const producto = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre');

    res.json({
        results: producto
    });

}


module.exports = {
    buscarUsuarios,
    buscarCategoria,
    buscarProductos
}