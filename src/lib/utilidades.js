const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (clave) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(clave, salt);
  return hash;
};

helpers.matchPassword = async (clave, savedPassword) => {
  try {
    return await bcrypt.compare(clave, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

helpers.admin = (arg1) =>{
  console.log(arg1);
  //console.log(arg2);
  if(arg1 == 'Admin'){
    console.log('es admin');
    return '<a class="dropdown-item" href="/estudiante">Estudiantes</a><a class="dropdown-item" href="/profesor">Profesores</a><div class="dropdown-divider"></div><a class="dropdown-item" href="/grupo">Grupos</a><a class="dropdown-item" href="/materia">Materias</a><a class="dropdown-item" href="/horarios">Horarios</a>';
  }else if (arg1 == 'Profesor'){
    console.log('es profesor');
    return '<a class="dropdown-item" href="/grupo">Grupos</a><a class="dropdown-item" href="/horarios">Horarios</a>';
  }else if(arg1 == 'Estudiante'){
    console.log('es estudiantes');
    return '<a class="dropdown-item" href="/registrar">Registrar Materias</a><a class="dropdown-item" href="/horario_estudiante">Horario</a>';
  }
};

helpers.notas = (arg1) =>{
  console.log('tipo de usuario '+arg1);
  //console.log(arg2);
  if(arg1 == 'Admin'){
    console.log('es admin');
    return '<a href="/notas/editar/{{notas_id}}" class="btn btn-secondary">Editar</a>&nbsp;&nbsp;<a href="/notas/borrar/{{notas_id}}" class="btn btn-danger">Borrar</a>';
  }else if (arg1 == 'Profesor'){
    console.log('es profesor');
    return '<a href="/notas/editar/{{notas_id}}" class="btn btn-secondary">Editar</a>&nbsp;&nbsp;<a href="/notas/borrar/{{notas_id}}" class="btn btn-danger">Borrar</a>';
  }else if(arg1 == 'Estudiante'){
    console.log('es estudiantes');
    return '&nbsp;&nbsp;';
  }
};

module.exports = helpers;