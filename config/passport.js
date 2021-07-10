const passport = require('passport');
const  LocalStrategy = require('passport-local').Strategy;

//hacemos referencias al modelo que aunteticaremos
const Usuarios = require('../models/Usuarios');

//local Strategy - login con credenciales propias(usuario y pass)
passport.use(
    new LocalStrategy(
        //por default espera un usuario  y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done)=>{
            try {
            const usuario = await Usuarios.findOne({
                where: {
                    email,
                    activo:1
                    }
            });
            //password incorrecto
                if(!usuario.VerificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                //el Email existe y el password es correcto
                return done(null, usuario);
            } catch (error) {
                console.log(error);
                //este usuario no existe
                return done(null, false, {
                    message: 'No existe esta Cuenta'
                })
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});

//desearalizar al usuaripo

passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});



//exoportamos
module.exports = passport;

