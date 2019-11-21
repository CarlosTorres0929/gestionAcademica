const express = require('express');
const router = express.Router();

router.get('/',(req,res) =>{
    res.render('index');
});

router.get('/preguntas', async(req, res) => {
    res.render('preguntasenelindex/preguntas');
});
router.get('/preguntas1', async(req, res) => {
    res.render('preguntasenelindex/preguntas1');
});
router.get('/preguntas2', async(req, res) => {
    res.render('preguntasenelindex/preguntas2');
});
router.get('/preguntas3', async(req, res) => {
    res.render('preguntasenelindex/preguntas3');
});
router.get('/preguntas4', async(req, res) => {
    res.render('preguntasenelindex/preguntas4');
});

router.get('/admisionesregistro', async(req, res) => {
    res.render('respuestasindex/admisionesregistro');
});

router.get('/admisionestudiante', async(req, res) => {
    res.render('respuestasindex/admisionestudiante');
});

router.get('/extension', async(req, res) => {
    res.render('respuestasindex/extension');
});

router.get('/investigacion', async(req, res) => {
    res.render('respuestasindex/investigacion');
});

router.get('/orientacion', async(req, res) => {
    res.render('respuestasindex/orientacion');
});

module.exports = router;