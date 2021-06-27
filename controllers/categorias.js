const { request, response } = require('express');
const { Categoria } = require('../models');


// Obtener categorías - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [categorias, total] = await Promise.all([
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre'),
        Categoria.countDocuments(query)
    ]);


    res.json({
        total,
        categorias
    });
}

// obtener categoría - populate {}
const obtenerCategoria = async(req = request, res = response) => {
    // Con el id que nos enviaron lo guardaremos en la variable id
    const { id } = req.params;
    // Buscamos ese producto 
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}


// Crear Categoria
const crearCategoria = async(req = request, res = response) => {
    // Obtener el nombre
    const nombre = req.body.nombre.toUpperCase();

    // Validar que la categoría enviada no existe
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // Grabación den la base de datos
    const categoria = new Categoria(data);
    await categoria.save();

    return res.status(201).json({
        msg: `La categoría: ${categoria.nombre} ha sido creada`
    });
}


// Actualizar categoría - recibir nombre
const actualizarCategoria = async(req = request, res = response) => {
    const { id } = req.params;

    // Tomamos los datos que nos interesan
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();

    // Usuario que realiza la actualización
    data.usuario = req.usuario._id;

    // Realizar la actualización 
    const categoria = await Categoria.findByIdAndUpdate(id, data);

    res.json({
        msg: 'Categoría Actualzada con éxito',
        categoria
    });
}

// borrar categoría - estado: false
const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    // Cambiar su estado a false
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: "Categoría borrada exitosamente",
        categoriaBorrada
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}