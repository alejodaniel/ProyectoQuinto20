import {Usuario} from './usuario';

export class Timbrar {
    _id?: string;
    entrada: string;
    almuerzo: string;
    regreso: string;
    salida: string;
    fecha: Date;
    usuario?: Usuario;
}
