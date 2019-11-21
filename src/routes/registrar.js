const express = require('express');
const router = express.Router();
//conexion a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//listado de horarios
router.get('/', isLoggedIn, async (req, res)=>{
    const horarios = await pool.query('SELECT ho.horarios_id, pr.nombre as profesor_id, ma.nombre as materia_id, gr.nombre as grupo_id, dia, hora_inicio, hora_fin FROM horarios as ho, profesor as pr, materia as ma, grupo as gr WHERE ho.profesor_id = pr.profesor_id and ho.materia_id = ma.id_materia and ho.grupo_id = gr.grupo_id ');
    //console.log(horarios);
    res.render('registrar/list', {horarios});
 });

 router.get('/agregar/:horario_id', isLoggedIn, async (req, res)=>{
    const {horario_id} = req.params;
    const estudiante_id  = req.user.idEstudiante; 
    const newRegistro = {
        horario_id, 
        estudiante_id
       };
       //se consulta que la materia ya no este registrado en el mismo o semestre 
       const materia = await pool.query('SELECT * FROM registro_materias WHERE horario_id = ? and estudiante_id = ?',[horario_id,estudiante_id]);
     
       if(materia.length > 0){
            if(materia[0].horario_id == horario_id && materia[0].estudiante_id == estudiante_id){
                req.flash('success','La materia se agrego anteriormente por favor consultar horario');
                res.redirect('/registrar');  
            }else{
                await pool.query('INSERT INTO registro_materias set ?',[newRegistro]);
                req.flash('success','Materia agregada exitosamente');
                res.redirect('/registrar');
            }
        }else{
            await pool.query('INSERT INTO registro_materias set ?',[newRegistro]);
            req.flash('success','Materia agregada exitosamente');
            res.redirect('/registrar');
        }
       
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

module.exports = router;