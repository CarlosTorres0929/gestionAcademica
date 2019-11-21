const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//listado de materias
router.get('/', isLoggedIn, async (req, res)=>{
    const grupos = await pool.query('SELECT * FROM grupo');
    console.log(grupos);
    res.render('grupo/list', {grupos});
 });

 router.get('/agregar', isLoggedIn, (req, res)=>{
    res.render('grupo/agregar');
});
//metodo para agregar
router.post('/agregar', isLoggedIn, async (req, res)=>{
   // console.log(req.body); para mostrar lo que llega del formulario
   const {nombre} = req.body;
   const newGrupo = {
    nombre
   };

   await pool.query('INSERT INTO grupo set ?',[newGrupo]);
   req.flash('success','Grupo agregado exitosamente');
   res.redirect('/grupo');

});

//metodo para consultar datos los grupos
router.get('/editar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const grupo = await pool.query('SELECT * FROM grupo WHERE grupo_id = ?',[id]);
  
    res.render('grupo/editar', {grupo: grupo[0]});

});

//metodo para modificar los datos
router.post('/editar/:id', async (req, res)=>{
    // console.log(req.body); para mostrar lo que llega del formulario
    const {id} = req.params;
    const {nombre} = req.body;
    
    const newGrupo= {
        nombre
    };
    console.log(newGrupo);
    await pool.query('UPDATE grupo set ? WHERE grupo_id = ?',[newGrupo, id]);
    req.flash('success','Grupo actualizado exitosamente');
    res.redirect('/grupo');
 
 });

 //metodo para borrar las materias
router.get('/borrar/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM grupo WHERE grupo_id = ?',[id]);
    req.flash('success','Grupo eliminado exitosamente');
    res.redirect('/grupo'); 
});

module.exports = router;