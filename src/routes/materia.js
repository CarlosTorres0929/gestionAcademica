const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//listado de materias
router.get('/', isLoggedIn, async (req, res)=>{
    const materias = await pool.query('SELECT * FROM materia as mat1 where materia_pre_id = 0 union all SELECT mat2.id_materia, mat2.nombre, mat2.creditos, mat1.nombre as materia_pre_id  FROM materia as mat1 join materia as mat2 on mat1.id_materia = mat2.materia_pre_id');
    console.log(materias);
    res.render('materia/list', {materias});
 });

 router.get('/agregar', isLoggedIn, async (req, res)=>{
    const materias = await pool.query('SELECT * FROM materia');
    res.render('materia/agregar', {materias: materias});
});
//metodo para agregar
router.post('/agregar', isLoggedIn, async (req, res)=>{
   // console.log(req.body); para mostrar lo que llega del formulario
   const {nombre, creditos, materia_pre_id} = req.body;
   const newMateria = {
    nombre, 
    creditos, 
    materia_pre_id
   };

   await pool.query('INSERT INTO materia set ?',[newMateria]);
   req.flash('success','Materia agregado exitosamente');
   res.redirect('/materia');

});

//metodo para consultar datos los estudiantes
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

module.exports = router;