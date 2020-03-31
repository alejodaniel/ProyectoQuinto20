import Server from "./classes/server";

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'

import cors from 'cors';

import userRoutes from "./routes/usuarioRouter";



const server = new Server();

//BodyParser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());


//FILEUPLOAD
//server.app.use(fileUpload({useTempFiles:true}));

//CORS CONFIGURAR
server.app.use(cors({origin:true,credentials:true}));


//Rutas de mi app
server.app.use('/user',userRoutes );
//server.app.use('/posts',postRoutes );

//Conecgar DB
mongoose.connect('mongodb://localhost:27017/BiometricoMobile',
    {useNewUrlParser:true,useCreateIndex:true},(err)=>{
    if( err) throw err;
    console.log('BASE DE DATOS ONLINE')
    }
)

//levantar express
server.start(()=>{
    console.log(`servidor Corriendo en puerto ${server.port}`);
});