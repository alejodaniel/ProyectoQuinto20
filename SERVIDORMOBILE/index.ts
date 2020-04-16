import Server from "./classes/server";

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'

import cors from 'cors';
import userRoutes from "./routes/usuarioRouter";
import timbrarRoutes from "./routes/timbrarRoutes";


const server = new Server();

//BodyParser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());


//FILEUPLOAD
server.app.use(fileUpload({useTempFiles: true}));

//CORS CONFIGURAR
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, POST, PUT, DELETE');
    next()
});


//Rutas de mi app
server.app.use('/server', [userRoutes, timbrarRoutes]);
server.app.use('/', (req, res) => {
    return 'Servidor En Linea'
})

//Conecgar DB
mongoose.connect('mongodb+srv://prueba:prueba12345@cluster0-bpftk.mongodb.net/BioDB', {
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
    console.log('Base de datos conectada')
});
mongoose.createConnection('mongodb+srv://prueba:prueba12345@cluster0-bpftk.mongodb.net/BioDB', {useNewUrlParser: true});


//levantar express
server.start(() => {
    console.log(`servidor Corriendo en puerto ${server.port}`);
});
