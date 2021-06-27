const { Categoria } = require('../models');
// Lógica del middleware
const validarCategoria = async(req, res, next) => {


    next();
}

module.exports = {
    validarCategoria
}