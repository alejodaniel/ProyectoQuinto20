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
    guardarImagen(file, userId, avatar) {
        return new Promise((resolve, reject) => {
            this.eliminarAnterior(userId, avatar);
            const path = this.crearCarpetaUsuario(userId);
            const nombreArchivo = this.generarNombreArchivo(file.name);
            //Mover el archivo del temp a a nuestra carpeta Temporal
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(nombreArchivo);
                }
            });
        });
    }
    generarNombreArchivo(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    eliminarAnterior(userId, avatar) {
        const foto = path_1.default.resolve(__dirname, '../images/', userId, 'profile', avatar);
        const existe = fs_1.default.existsSync(foto);
        if (existe) {
            fs_1.default.unlinkSync(foto);
        }
    }
    crearCarpetaUsuario(userId) {
        // __dirname todo la direccion de mi carpeta
        const pathUser = path_1.default.resolve(__dirname, '../images/', userId);
        const pathTemp = pathUser + '/profile';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathTemp);
        }
        return pathTemp;
    }
    obtenerImagenesTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../images/', userId, 'profile');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        const foto = path_1.default.resolve(__dirname, '../images/', userId, 'profile', img);
        const existe = fs_1.default.existsSync(foto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/img-01.png');
        }
        return foto;
    }
}
exports.default = FileSystem;
