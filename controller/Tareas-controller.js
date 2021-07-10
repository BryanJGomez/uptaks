const Proyectos = require("../models/proyecto");
const Tareas = require("../models/Tareas");

exports.formularioTarea = async (req, res, next) => {
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
  //leemos el valor de el input
  const { tarea } = req.body;
  //estado = 0 incompleto y ID de el proyecto
  const estado = 0;
  const proyectoId = proyecto.id;

  //insertamos en la base de datos
  const resultado = await Tareas.create({ tarea, estado, proyectoId });

  if (!resultado) {
    return next();
  }
  //redireccionamos a una vista
  res.redirect(`/proyectos/${req.params.url}`);
};



//estado de tareas
exports.estado = async(req, res)=>{
  const { id } = req.params;
  const tarea = await Tareas.findOne({where: { id }});

  // cambiar el estado
  let estado = 0;
  if(tarea.estado === estado) {
      estado = 1;
  }
  tarea.estado = estado;

  const resultado = await tarea.save();

  if(!resultado) return next();
  
  res.status(200).send('Actualizado');
}

//eliminar tarea
exports.eliminarTarea = async (req, res, next)=>{
  const { id } = req.params;

  // Eliminar la tarea
  const resultado = await Tareas.destroy({where : { id  }});

  if(!resultado) return next();

  res.status(200).send('Tarea Eliminada Correctamente')
}
