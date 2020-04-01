import Server from "./classes/server";

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'

import cors from 'cors';
import userRoutes from "./routes/usuarioRouter";


const server = new Server();

//BodyParser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());


//FILEUPLOAD
server.app.use(fileUpload({useTempFiles: true}));

//CORS CONFIGURAR
server.app.use(cors({origin: true, credentials: true}));


//Rutas de mi app
server.app.use('/server', [userRoutes]);

//Conecgar DB
mongoose.connect('mongodb://localhost:27017/BiometricoMobile', {
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
    console.log('Base de datos conectada')
});
mongoose.createConnection('mongodb://localhost:27017/BiometricoMobile', {useNewUrlParser: true});


//levantar express
server.start(() => {
    console.log(`servidor Corriendo en puerto ${server.port}`);
});
