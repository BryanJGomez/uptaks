//importamos los modelos
// const { where } = require('sequelize/types');
const Proyectos = require('../models/proyecto');
const Tareas = require("../models/Tareas");

//definimos las rutas
exports.inicio = async (req, res, next)=>{

    // console.log(res.locals.usuario);
    const ususarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{ususarioId}});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};

exports.nuevo = async (req, res, next)=>{
    const ususarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{ususarioId}});

    res.render('NuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
};

exports.enviarFormulario = async (req, res, next)=>{
    //enviamos ala cosnola lo que el usuario escriba
    const ususarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{ususarioId}});

//    console.log(req.body);

    //validamos que tengamos algo valido en el input
    const nombre = req.body.nombre;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'No dejes campos Vacios'})
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('NuevoProyecto',{
            nombrePagina: 'Nuevo Proyectos',
            errores,
            proyectos
        })
    }else{
        //sino hay errores insertar en la DB
         const ususarioId = res.locals.usuario.id;
         await Proyectos.create({nombre, ususarioId});
        //  console.log(ususarioId);
         res.redirect('/');
    }
}

//controlador para listar proyecto
exports.proyectoUrl = async (req, res, next)=>{

    const ususarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where:{ususarioId}});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            url : req.params.url,
            ususarioId
        }
    });
    
    const [proyectos, proyecto ] = await Promise.all([proyectosPromise,proyectoPromise]);

    //consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        }
    });

    // console.log(tareas)


    if(!proyecto) return next(); 

    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.formularioEditar = async (req, res, next)=>{
    const ususarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where:{ususarioId}});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id,
            ususarioId
        }
    });
    
    const [proyectos, proyecto ] = await Promise.all([proyectosPromise,proyectoPromise])

    res.render('NuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}


exports.ActualizarProyecto = async (req, res, next)=>{
    //enviamos ala cosnola lo que el usuario escriba
    const ususarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{ususarioId}});

//    console.log(req.body);

    //validamos que tengamos algo valido en el input
    const nombre = req.body.nombre;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'No dejes campos Vacios'})
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('NuevoProyecto',{
            nombrePagina: 'Nuevo Proyectos',
            errores,
            proyectos
        })
    }else{
        //sino hay errores insertar en la DB
          await Proyectos.update(
              {nombre: nombre},
              {where : {id: req.params.id} }
            );
          res.redirect('/');
    }
}

exports.eliminar = async (req, res, next)=>{
    // console.log(req);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});   
    if(!resultado){
        return next();
    } 
    res.status(200).send('Proyecto eliminado Correctamente');
}