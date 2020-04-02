"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuarioRouter_1 = __importDefault(require("./routes/usuarioRouter"));
const server = new server_1.default();
//BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FILEUPLOAD
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//CORS CONFIGURAR
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
    res.header('Allow', 'GET, POST, PUT, DELETE');
    next();
});
//Rutas de mi app
server.app.use('/server', [usuarioRouter_1.default]);
//Conecgar DB
mongoose_1.default.connect('mongodb://localhost:27017/BiometricoMobile', {
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos conectada');
});
mongoose_1.default.createConnection('mongodb://localhost:27017/BiometricoMobile', { useNewUrlParser: true });
//levantar express
server.start(() => {
    console.log(`servidor Corriendo en puerto ${server.port}`);
});
