const nodemailer = require('nodemailer');
const pug  = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emialConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emialConfig.host,
    port: emialConfig.porq  ,
    auth: {
      user: emialConfig.user, // generated ethereal user
      pass: emialConfig.pass, // generated ethereal password
    },
});

//generar HTML
const generarHTML = (archvo, opciones={})=>{
    const html = pug.renderFile(`${__dirname}/../views/email/${archvo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones)=>{
    const html = generarHTML(opciones.archivo, opciones)
    const text = htmlToText.fromString(html);
    let opcionesEmail = ({
        from: 'UpTaks <no-reply@UpTaks.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
    });
    
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail)
}
  