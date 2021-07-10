const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
const Usuario = require('../models/Usuarios');
exports.crearCuenta = (req, res,next)=>{
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuentan en UpTaks'
    });
}

//formularo para iniciar session
exports.formSession = (req, res,next)=>{
    const {error} = res.locals.mensajes;
    res.render('Session',{
        nombrePagina: 'Iniciar Session en UpTaks',
        error
    });
}

exports.cuenta = async (req, res, next)=>{
    //leemos los datos
    const {email, password} = req.body;

    try {
        //crear el usuario
        await  Usuarios.create({
            email,
            password
        });
        //crear un URL de confirmacion
          const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        
        //crear el objeto de confirmacion
        const usuario = {
            email
        }

        //enviar E-mail
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta en UpTaks',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir a los usuarios
        req.flash('correcto', 'enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
        //atrapar los errores que hayan cuando se crea una nueva cuenta
    } catch (error) {
        console.log(error);
        req.flash('error', error.errors.map(error=> error.message));
        res.render('crearCuenta',{
            mensajes: req.flash() , 
            nombrePagina: 'Crear cuentan en UpTaks',
            email,
            password
        });
    }
};

//formulario para restablecer el password
exports.formReset = (req, res, next)=>{
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu contraseña'
    });
}

exports.confirmarCuenta = async (req, res, next)=>{
    // const {email} = req.params.correo
    const usuario = await Usuario.findOne({
        where:{
            email: req.params.correo
        }
    });
    //sino existe el usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1
    await usuario.save();
    req.flash('correcto', 'Felicidades tu cuenta ah sido activda correctamente');    
    res.redirect('/iniciar-sesion');
}