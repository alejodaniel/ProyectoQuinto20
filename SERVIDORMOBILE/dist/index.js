"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FILEUPLOAD
//server.app.use(fileUpload({useTempFiles:true}));
//CORS CONFIGURAR
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas de mi app
//server.app.use('/user',userRoutes );
//server.app.use('/posts',postRoutes );
//Conecgar DB
mongoose_1.default.connect('mongodb://localhost:27017/BiometricoMobile', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('BASE DE DATOS ONLINE');
});
//levantar express
server.start(() => {
    console.log(`servidor Corriendo en puerto ${server.port}`);
});
