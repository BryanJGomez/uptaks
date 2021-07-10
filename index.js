//exportamamos archivos requeridos
const routes = require('./routes')

//exportamos express
const express = require('express');
//lee los archivos que existen en la carpeta
const path = require('path');
const bodyParser = require('body-parser');
//importamos los helpers
const helpers = require('./helpers');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookies-parser');
const passport = require('./config/passport');

//crear conexion a la db
const db = require('./config/db');
require('./models/proyecto')
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(()=> console.log('conectado ala BD'))
    .catch(error => console.log(error));

//creamos una apliccion de express
const app = express();

//cargaremos los archivos estaticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitmos body-parse
app.use(bodyParser.urlencoded({extended:true}));

// app.use(expressValidator());



//agrgar carpeta de vistas
app.set('views', path.join(__dirname, './views'));

//agregamos flash message

app.use(flash()); 

// app.use(cookieParser());

//sessiones que nos permite navegar entre distintas
//paginas sin volvernos a autenticar
app.use(session({
    secret: 'bryan',
    resave: false,
    saveUninitialized: false    
}))

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la app
app.use((req, res, next)=>{
    
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    // console.log(res.locals.usuario); 
    next();
});


//definimos el puerto donde correra la app
const port = process.env.PORT || 3000;

app.use('/', routes() );

//creamos el servidor
app.listen(port, ()=>{
    console.log(`el servidor esta corriendo en el puerto ${port}`)
});










