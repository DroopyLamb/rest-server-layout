// Lógica métodos HTTP
const { response, request } = require('express'); // para tener los snippets de req. y res.
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    // Consulta para traer solo los usuarios activos
    const query = { estado: true }



    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({

        total,
        usuarios
    });
}
const usuariosPost = async(req, res) => {
    // Capturar datos del body de la página
    const { nombre, correo, password, rol } = req.body;

    // Creamos una constante del tipo del modelo
    const usuario = new Usuario({ nombre, correo, password, rol });
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(12);
    usuario.password = bcryptjs.hashSync(password, salt);

    // Subimos los datos a la base de datos
    await usuario.save();
    res.status(201).json({
        ok: true,
        message: 'post Api - controlador',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // Todo validar contra base de datos

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(12);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Obtener el uid que le enviamos a través del middleware validar-jwt
    const uid = req.uid;

    // Borrado físico de la base de datos
    //const usuario = await Usuario.findByIdAndDelete(id);

    // Cambiar su estado a false
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    const usuarioAutenticado = req.usuario;

    res.json({
        msg: "Usuario borrado exitosamente",
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}