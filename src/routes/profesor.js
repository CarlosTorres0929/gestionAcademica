const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/agregar', isLoggedIn, (req, res)=>{
    res.render('profesor/agregar');
});
//metodo para agregar
router.post('/agregar', isLoggedIn, async (req, res)=>{
   // console.log(req.body); para mostrar lo que llega del formulario
   const {nombre, cedula, correo} = req.body;
   const newProfesor = {
    nombre, 
    cedula, 
    correo
    //usua_id :req.user.usua_id
   };

   await pool.query('INSERT INTO profesor set ?',[newProfesor]);
   req.flash('success','Profesor agregado exitosamente');
   res.redirect('/profesor');

});

//listado de profesores
router.get('/', isLoggedIn, async (req, res)=>{
   const profesores = await pool.query('SELECT * FROM profesor');
   console.log(profesores);
   res.render('profesor/list', {profesores});
});

//metodo para borrar los profesores
router.get('/borrar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM profesor WHERE profesor_id = ?',[id]);
    req.flash('success','Profesor eliminado exitosamente');
    res.redirect('/profesor'); 
});

//metodo para consultar datos los profesores
router.get('/editar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const profesor = await pool.query('SELECT * FROM profesor WHERE profesor_id = ?',[id]);
    //console.log(profesor[0]);
    res.render('profesor/editar', {profesor: profesor[0]});
    //res.redirect('/estudiante'); 
});

//metodo para modificar los datos
router.post('/editar/:id', async (req, res)=>{
    // console.log(req.body); para mostrar lo que llega del formulario
    const {id} = req.params;
    const {nombre, cedula, correo} = req.body;
    
    const newProfesor = {
     nombre, 
     cedula, 
     correo
    };
    console.log(newProfesor);
    await pool.query('UPDATE profesor set ? WHERE profesor_id = ?',[newProfesor, id]);
    req.flash('success','Profesor actualizado exitosamente');
    res.redirect('/profesor');
 
 });

module.exports = router;