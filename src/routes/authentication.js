const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { check, validationResult } = require('express-validator');



router.get('/registro', isNotLoggedIn,(req, res) =>{
    res.render ('auth/registro');
});

router.post('/registro', isNotLoggedIn, passport.authenticate('local.registro',{
    successRedirect:'/perfil', 
    failureRedirect:'/registro',
    failureFlash: true  
  }));

  router.get('/loguin', isNotLoggedIn, (req, res) =>{
    res.render ('auth/loguin');
});

//id	tipo	usuario	clave
router.post('/loguin', isNotLoggedIn, function(req, res, next) {
    
    check('usuario', 'Se requiere Usuario').not().isEmpty(),
    check('contrasena', 'Se requiere contraseña').not().isEmpty()
    /* const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return `${location}[${param}]: ${msg}`;
    }; */
    //const errors = validationResult(req);//.formatWith(errorFormatter);

    passport.authenticate('local.loguin', {
        successRedirect: '/perfil',
        failureRedirect: '/loguin',
        failureFlash: true
    })(req, res, next);

  /*   if(errors){
        req.session.errors = errors;
        req.session.success = false;
        res.render('auth/loguin', {errors: errors});
     }
     else{
        passport.authenticate('local.loguin', {
            successRedirect: '/perfil',
            failureRedirect: '/loguin',
            failureFlash: true
        })(req, res, next);
     } */
});

router.get('/perfil', isLoggedIn, (req, res) =>{
    res.render ('perfil');

});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;