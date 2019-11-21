const passport = require('passport');
//para conexion con bd local
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./utilidades');

//id usuario clave y tipo
passport.use('local.loguin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async(req, usuario, contrasena, done) => {
    console.log(req.body);
    console.log(usuario);
    console.log(contrasena);
    
    const rows = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasena, user.contrasena)
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenid@ ' + user.tipo));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe.'));
    }
}));


passport.use('local.registro', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena',
    tipoField: 'tipo',
    tokenField: 'token',
    passReqToCallback: true
}, async(req, usuario, contrasena, done) => {
    //console.log(req.body);
    var  idEstudiante = 0;
    var idProfesor = 0;
    const { token } = req.body;
    const { tipo } = req.body;
    if (tipo === 'Profesor') {
        idProfesor = token;
        idEstudiante = 0;
    }else{
        idEstudiante = token;
        idProfesor = 0;

    }
   
    newUser = {
        usuario,
        contrasena,
        tipo,
        idEstudiante,
        idProfesor

    };

    newUser.contrasena = await helpers.encryptPassword(contrasena);
    console.log(newUser)
    // Guarda los usuarios en la base de datos
    const result = await pool.query('INSERT INTO usuario SET ? ', newUser);
    newUser.usua_id = result.insertId;
    return done(null, newUser); 
}));


passport.serializeUser((user, done) => {
    done(null, user.usua_id);
});

passport.deserializeUser(async(usua_id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE usua_id = ?', [usua_id]);
    done(null, rows[0]);
   
});