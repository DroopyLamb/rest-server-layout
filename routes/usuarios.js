// Rutas
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuarios');

//Valida rol
const { esRolValido, emailExiste, exiteUsuarioPorId } = require('../helpers/db-validators');

// Importación de middlewares
/* const { validarCampos } = require('../middlewares/validar-campos'); */

// validar ruta
/* const { validarJWT } = require('../middlewares/validar-jwt'); */

// Validar roles
/* const { esAdminRole, tieneRole } = require('../middlewares/validar-roles'); */


const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength({ min: 6 }),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(exiteUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(exiteUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;