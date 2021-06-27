// Lógica métodos HTTP
const { response, request } = require('express');

const { Producto } = require('../models');

const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [productos, total] = await Promise.all([
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)),
        Producto.countDocuments(query)
    ]);


    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req = request, res = response) => {
    // Con el id que nos enviaron lo guardaremos en la variable id
    const { id } = req.params;
    // Buscamos ese producto 
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    });
}

const crearProducto = async(req = request, res = response) => {
    // Obtener el nombre
    const { estado, usuario, ...body } = req.body;

    // Validar que la categoría enviada no existe
    const productoDB = await Producto.findOne({ nombre: body.nombre });


    if (productoDB) {
        return res.status(400).json({
            msg: `La producto ${ productoDB.nombre } ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }


    // Grabación den la base de datos
    const producto = new Producto(data);
    await producto.save();

    return res.status(201).json({
        msg: `El producto: ${producto.nombre} ha sido creado`
    });
}

const actualizarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    // Tomamos los datos que nos interesan
    const { estado, usuario, ...data } = req.body;

    // Si viene el nombre para acualizar, lo guardamos
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    // Usuario que realiza la actualización
    data.usuario = req.usuario._id;

    // Realizar la actualización 
    const producto = await Producto.findByIdAndUpdate(id, data);

    res.json({
        msg: 'Producto actualizado con éxito',
        producto
    });
}

const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    // Cambiar su estado a false
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: "Prodcuto borrado exitosamente",
        productoBorrado
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}