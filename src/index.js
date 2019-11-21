const express = require('express');
const morgan  = require('morgan');
const exphbs = require('express-handlebars')
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MYSQLStore = require('express-mysql-session');
const passport = require('passport');
const {database} = require('./keys');

//inicializaciones
const app = express();
require('./lib/passport');

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/utilidades')
}));

//inicializamos las plantilas de las vistas
app.set('view engine','.hbs');

//Middlewares
app.use(session({
    secret: 'faztforcekey',
    resave: false,
    saveUninitialized: false,
    store: new MYSQLStore(database)
}));
//mensajes entre pantallas
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
//para recibir peticiones de json (webservices)
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
//app.use(hbs.match());





//variables globales
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes -url del servidor
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/estudiante',require('./routes/estudiante'));
app.use('/profesor',require('./routes/profesor'));
app.use('/materia',require('./routes/materia'));
app.use('/grupo',require('./routes/grupo'));
app.use('/horarios',require('./routes/horarios'));
app.use('/registrar',require('./routes/registrar'));
app.use('/horario_estudiante',require('./routes/horario_estudiante'));
app.use('/notas',require('./routes/notas'));
app.use('/notas_estudiante',require('./routes/notas_estudiante'));

//archivos publicos
app.use(express.static(path.join(__dirname,'public')));

//arrancar servidor
app.listen(app.get('port'), ()=>{
   console.log('servidor desplegado en puerto', app.get('port'));
});
