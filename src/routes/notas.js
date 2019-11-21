const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//listado de horarios
router.get('/:estudiante_id/:horarios_id', isLoggedIn, async (req, res)=>{
    const {estudiante_id} = req.params;
    const {horarios_id} = req.params;
    const {tipo} = req.user;
    console.log('tipo de usuarios'+req.user.tipo);
    const notas = await pool.query('SELECT po.nombre as profesor, ma.nombre as materia, momento, nota, notas_id FROM notas nota, horarios ho, profesor po, materia ma, estudiante es where nota.horario_id = ho.horarios_id and ho.profesor_id = po.profesor_id and ho.materia_id = ma.id_materia and nota.estudiante_id = es.estudiante_id and es.estudiante_id =? and nota.horario_id =?',[estudiante_id, horarios_id]);
    console.log(notas);
    res.render('notas/list', {notas: notas, tipo:tipo});
 });

 router.get('/estudiantes/:horario_id', isLoggedIn, async (req, res)=>{
    const {horario_id} = req.params;
    const estudiantes = await pool.query('SELECT es.estudiante_id, nombres, apellidos, cedula, correo, horario_id  FROM registro_materias rm, estudiante es where rm.estudiante_id = es.estudiante_id and rm.horario_id =?',[horario_id]);
    
    res.render('horarios/estudiantes', {estudiantes: estudiantes});
});

router.get('/agregar', isLoggedIn, async (req, res)=>{
    const profesores = await pool.query('SELECT * FROM profesor');
    const materias = await pool.query('SELECT * FROM materia');
    const grupos = await pool.query('SELECT * FROM grupo');
    res.render('horarios/agregar', {profesores: profesores, materias: materias, grupos: grupos});
});
//metodo para agregar
router.post('/agregar', isLoggedIn, async (req, res)=>{
   // console.log(req.body); para mostrar lo que llega del formulario
   const {profesor_id, materia_id, grupo_id, dia, hora_inicio, hora_fin, aula} = req.body;
   const newHorario = {
    profesor_id, 
    materia_id, 
    grupo_id,
    dia,
    hora_inicio,
    hora_fin,
    aula
   };

   await pool.query('INSERT INTO horarios set ?',[newHorario]);
   req.flash('success','Horario agregado exitosamente');
   res.redirect('/horarios');

});

//metodo para consultar datos los 
router.get('/editar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const materia = await pool.query('SELECT * FROM materia WHERE id_materia = ?',[id]);
  
    res.render('materia/editar', {materia: materia[0]});
    //res.redirect('/estudiante'); 
});

//metodo para modificar los datos
router.post('/editar/:id', async (req, res)=>{
    // console.log(req.body); para mostrar lo que llega del formulario
    const {id} = req.params;
    const {nombre, creditos, materia_pre_id} = req.body;
    
    const newMateria = {
        nombre, 
        creditos, 
        materia_pre_id
    };
    console.log(newMateria);
    await pool.query('UPDATE materia set ? WHERE id_materia = ?',[newMateria, id]);
    req.flash('success','Materia actualizado exitosamente');
    res.redirect('/materia');
 
 });

 //metodo para borrar las materias
router.get('/borrar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM materia WHERE id_materia = ?',[id]);
    req.flash('success','Materia eliminada exitosamente');
    res.redirect('/materia'); 
});

//metodo para consultar datos los 
router.get('/agregar_nota/:horario_id/:estudiante_id', isLoggedIn, async (req, res)=>{
    const {horario_id} = req.params;
    const {estudiante_id} = req.params;
    console.log('horario '+horario_id);
    console.log('estudiante '+estudiante_id);
    //const materia = await pool.query('SELECT * FROM materia WHERE id_materia = ?',[id]);
  
    res.render('horarios/agregar_nota', {horario_id: horario_id, estudiante_id:estudiante_id});
    //res.redirect('/estudiante'); 
});

//metodo para agregar
router.post('/agregar_nota', isLoggedIn, async (req, res)=>{
    // console.log(req.body); para mostrar lo que llega del formulario
    const {estudiante_id, horario_id, momento, nota} = req.body;
    const newNota = {
        estudiante_id, 
        horario_id, 
        momento,
        nota
    };
 
    await pool.query('INSERT INTO notas set ?',[newNota]);
    req.flash('success','Nota agregada exitosamente');
    res.redirect('/horarios/estudiantes/'+horario_id);
 
 });

module.exports = router;