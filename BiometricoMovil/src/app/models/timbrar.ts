import {Usuario} from './usuario';

export class Timbrar {
    _id?: string;
    entrada: string;
    coordEntrada: string;
    almuerzo: string;
    coordAlmuerzo: string;
    regreso: string;
    coordRegreso: string;
    salida: string;
    coordSalida: string;
    fecha: string;
    usuario?: Usuario;
}
