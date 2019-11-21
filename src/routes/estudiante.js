const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar', isLoggedIn, (req, res)=>{
    res.render('estudiante/agregar');
});
//metodo para agregar
router.post('/agregar', isLoggedIn, async (req, res)=>{
   // console.log(req.body); para mostrar lo que llega del formulario
   const {nombres, apellidos, cedula, correo} = req.body;
   const newEstudiante = {
    nombres, 
    apellidos, 
    cedula, 
    correo
    //usua_id :req.user.usua_id
   };

   await pool.query('INSERT INTO estudiante set ?',[newEstudiante]);
   req.flash('success','Estudiante agregado exitosamente');
   res.redirect('/estudiante');

});

//listado de estudiantes
router.get('/', isLoggedIn, async (req, res)=>{
   const estudiantes = await pool.query('SELECT * FROM estudiante');
   console.log(estudiantes);
   res.render('estudiante/list', {estudiantes});
});

//metodo para borrar los estudiantes
router.get('/borrar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM estudiante WHERE estudiante_id = ?',[id]);
    req.flash('success','Estudiante eliminado exitosamente');
    res.redirect('/estudiante'); 
});

//metodo para consultar datos los estudiantes
router.get('/editar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const estudiante = await pool.query('SELECT * FROM estudiante WHERE estudiante_id = ?',[id]);
    //console.log(estudiante[0]);
    res.render('estudiante/editar', {estudiante: estudiante[0]});
    //res.redirect('/estudiante'); 
});

//metodo para modificar los datos
router.post('/editar/:id', async (req, res)=>{
    // console.log(req.body); para mostrar lo que llega del formulario
    const {id} = req.params;
    const {nombres, apellidos, cedula, correo} = req.body;
    
    const newEstudiante = {
     nombres, 
     apellidos, 
     cedula, 
     correo
    };
    console.log(newEstudiante);
    await pool.query('UPDATE estudiante set ? WHERE estudiante_id = ?',[newEstudiante, id]);
    req.flash('success','Estudiante actualizado exitosamente');
    res.redirect('/estudiante');
 
 });

module.exports = router;