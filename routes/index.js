const express = require('express');
//importamos express validator
const {body} = require('express-validator/check');
//importamos el Router para crear nuestras rutas
const router = express.Router();
//importar el controlador
const controladores = require('../controller/index-controller');
const TareaControlador = require('../controller/Tareas-controller');
const authController = require('../controller/authController');

//controlador de usuarios
const UsuariosControllers = require('../controller/UsuariosControllers');

module.exports = function(){
    router.get('/',
        authController.usuarioAutenticado,
        controladores.inicio 
    );

    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
         controladores.nuevo
    );
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        controladores.enviarFormulario
     );

     //listado de el protyecto
     router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        controladores.proyectoUrl
     );

     //editar Proyecto
     router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        controladores.formularioEditar
     );

     router.post('/nuevo-proyecto/:id',
         authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        controladores.ActualizarProyecto
    );

    //eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        controladores.eliminar
    );

    //agregar rutas para tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        TareaControlador.formularioTarea
     );
    //cambiando estado de tarea
    //ir a js y hacer un request
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        TareaControlador.estado
    );

    //eliminar las tareas
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        TareaControlador.eliminarTarea
     );


    //creamos una nueva cuenta
    router.get('/crear-cuenta', UsuariosControllers.crearCuenta);
    router.post('/crear-cuenta', UsuariosControllers.cuenta);
    router.get('/confirmar/:correo', UsuariosControllers.confirmarCuenta);

    //inciar session
    router.get('/iniciar-sesion', UsuariosControllers.formSession);
    router.post('/iniciar-sesion', authController.autenticarUsuarios);

    //cerrar sessiones
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer la contraseña
    router.get('/restablecer', UsuariosControllers.formReset);
    router.post ('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);
     
    
    return router;
}

