const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const {
    validarJWT,
    validarCampos,
    tieneRole
} = require('../middlewares');

const {
    existeNombre,
    existeCategoriaPorId
} = require('../helpers/db-validators');


const router = Router();

/* 
    Obtener todas las categorías - público
*/
router.get('/', obtenerCategorias);


/* 
    Obtener una categoría por ID - público
*/
router.get('/:id', [
        check('id', 'No es un id de Mongo').isMongoId(),
        check('id', ).custom(existeCategoriaPorId),
        validarCampos,
    ],
    obtenerCategoria);


/* 
    Crear una nueva categoría - privado - Cualquier persona con cualquier token válido
*/
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearCategoria);

/* 
    Actualizar - privado - cualquiera con token válido
*/
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', ).custom(existeCategoriaPorId),
    check('nombre').custom(existeNombre),
    tieneRole('ADMIN_ROLE'),
    validarCampos
], actualizarCategoria);

/* 
    Borrar una categoría - ADMIN_ROLE
*/

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    tieneRole('ADMIN_ROLE'),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;