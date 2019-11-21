const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//listado de horarios
router.get('/', isLoggedIn, async (req, res)=>{
    const estudiante_id  = req.user.idEstudiante; 
    const horarios = await pool.query('SELECT ho.horarios_id, pr.nombre as profesor_id, ma.nombre as materia_id, gr.nombre as grupo_id, dia, hora_inicio, hora_fin, aula, registro_id, rm.estudiante_id FROM registro_materias rm, horarios ho, profesor as pr, materia as ma, grupo gr WHERE rm.horario_id = ho.horarios_id AND ho.profesor_id = pr.profesor_id and ho.materia_id = ma.id_materia and ho.grupo_id = gr.grupo_id and rm.estudiante_id = ? ', [estudiante_id] );
    console.log(horarios);
    res.render('horario_estudiante/list', {horarios});
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
    await pool.query('DELETE FROM registro_materias WHERE registro_id = ?',[id]);
    req.flash('success','Materia cancelada exitosamente');
    res.redirect('/horario_estudiante'); 
});

module.exports = router;