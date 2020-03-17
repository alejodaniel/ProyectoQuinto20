'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');

var app = express();

//cargar rutas
var asistRoutes = require('./routes/timbradores');


//midelwares de body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//cors
//config cabeceras y cors

const multipartMiddleware = multipart({
    uploadDir: './uploads'
});

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//rutas base
app.use('/api', asistRoutes);

app.post('/api/guardarArchivo', multipartMiddleware, (req, res) => {
    console.log(req.files['uploads'][0].path)
    res.json({'mensaje:': ''})
});


module.exports = app;
