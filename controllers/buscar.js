const { request, response } = require("express");
const {
    buscarUsuarios,
    buscarCategoria,
    buscarProductos
} = require("../helpers/busqueda-personalizada");

// Categorías válidas
const coleccionesPermitidas = [
    'categoria',
    'productos',
    'usuarios',
    'roles'
];


const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break

        case 'categoria':
            buscarCategoria(termino, res);
            break

        case 'productos':
            buscarProductos(termino, res);
            break

        default:
            return res.status(500)({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
            break;
    }


}

module.exports = {
    buscar
}