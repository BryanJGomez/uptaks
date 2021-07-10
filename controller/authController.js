const passport = require('passport')
const Sequelize = require("sequelize");
const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const  {Op } = require("sequelize");
const enviarEmail = require('../handlers/email');
// const { token } = require('morgan');

exports.autenticarUsuarios = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para revisar si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next)=>{
    //si el usuario esta autenticado 
    if(req.isAuthenticated()){
        return next();
    }

    //sino esta autenticado redirigir a home
    return  res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res, next)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')//al cerrar sesion nos lleva al login
    })
};

//genera un token si el usuario es valido
exports.enviarToken = async(req, res, next)=>{
    //verificar si el usuario existe
    const {email} = req.body
    const usuario = await Usuario.findOne({where: {email}})

    //sino existe el usuario
    if(!usuario){
        req.flash('error', 'no existe esa cuenta');
        res.redirect('/restablecer');
    }
    //si el usuario existe 
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar en la base de datos
    await usuario.save();

    //url de reset
    const urlReset = `http://${req.headers.host}/restablecer/${usuario.token}`;
    //envia al correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        urlReset,
        archivo: 'restablecer-password'
    });
    //finalizacion
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion')
    
};


exports.validarToken = async (req, res, next)=>{
    // res.json(req.params.token)   

    const usuario = await Usuario.findOne({
        where:{
            token: req.params.token
        }
    });

    //sino encuentra el usuario
    if(!usuario){
        req.flash('error', 'Token no valido');
        res.redirect('/restablecer');
    }
    //formulario para generar el password
    res.render('resetPassword',{
        nombrePagina: 'Restablecer Contraseña'
    })

};
//cambiar el password por uno nuevo
exports.actualizarPassword = async (req, res, next)=>{
    //verificar la fecha de expiracion y token valido
    const usuario = await Usuario.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //verificampos si el usuario existe
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/restablecer');
    }

    //hasheamos el password 
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); 
    usuario.token = null;
    usuario.expiracion = null;
    //guardamos el nuevo password
    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}



