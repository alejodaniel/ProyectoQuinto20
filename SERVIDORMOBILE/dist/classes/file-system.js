"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() {
    }
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            //CREAR CARPETAS
            const path = this.crearCarpetaUsuario(userId);
            //NOMBRE ARCHIVO
            const nombreArchivo = this.generarNombreUnico(file.name);
            //MOVER EL ARCHIVO DEL TEMP A LA CARPETA
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUSer = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUSerTemp = pathUSer + '/temp';
        const existe = fs_1.default.existsSync(pathUSer);
        if (!existe) {
            fs_1.default.mkdirSync(pathUSer);
            fs_1.default.mkdirSync(pathUSerTemp);
        }
        return pathUSerTemp;
    }
    imgenesDeTempHaciaPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts', img);
        //si existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/noExiste.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
