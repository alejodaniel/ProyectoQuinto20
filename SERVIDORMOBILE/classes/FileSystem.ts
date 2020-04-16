import {IFileUpload} from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    constructor() {
    }

    guardarImagen(file: IFileUpload, userId: string, avatar: string) {
        return new Promise((resolve, reject) => {
            if (avatar) {
                this.eliminarAnterior(userId, avatar);
            }
            const path = this.crearCarpetaUsuario(userId);
            const nombreArchivo = this.generarNombreArchivo(file.name);


            //Mover el archivo del temp a a nuestra carpeta Temporal
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {


                    resolve(nombreArchivo);
                }
            });
        });
    }

    private generarNombreArchivo(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid();
        return `${idUnico}.${extension}`
    }

    private eliminarAnterior(userId: string, avatar: string) {
        const foto = path.resolve(__dirname, '../images/', userId, 'profile', avatar);

        const existe = fs.existsSync(foto);

        if (existe) {
            fs.unlinkSync(foto)
        }
    }

    private crearCarpetaUsuario(userId: string) {
        // __dirname todo la direccion de mi carpeta
        const pathUser = path.resolve(__dirname, '../images/', userId);
        const pathTemp = pathUser + '/profile';
        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathTemp);
        }
        return pathTemp;
    }


    private obtenerImagenesTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../images/', userId, 'profile');

        return fs.readdirSync(pathTemp) || [];
    }

    getFotoUrl(userId: string, img: string) {
        const foto = path.resolve(__dirname, '../images/', userId, 'profile', img);

        const existe = fs.existsSync(foto);

        if (!existe) {
            return path.resolve(__dirname, '../assets/img-01.png');
        }

        return foto;
    }
}
