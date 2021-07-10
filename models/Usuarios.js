const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyecto = require('../models/proyecto');
const bcrypt = require('bcrypt-nodejs');

const Usuario  = db.define('ususario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull : false, 
        validate: {
            isEmail: {
                msg : 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'El e-mail no puede ir vacio'
            }
        }, 
        unique: {
            args: true,
            msg: 'Usuario Ya Registrado'
        }
    }, 
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty:{
                msg:'el password no puede ir vacio'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE 
}, {
    hooks: {
        beforeCreate(ususario){
            ususario.password = bcrypt.hashSync(ususario.password, bcrypt.genSaltSync(10)); 
        }
    }
}); 

//metodos personalizados 
Usuario.prototype.VerificarPassword = function(password){
     return bcrypt.compareSync(password, this.password);
}


Usuario.hasMany(Proyecto);

module.exports = Usuario;
