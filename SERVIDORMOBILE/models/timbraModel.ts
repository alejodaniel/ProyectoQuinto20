import {Schema, model, Document} from 'mongoose';

const timbrarSchema = new Schema({
    entrada: {
        type: String,
        default: '00:00'
    },
    coordEntrada: {
        type: String,
        default: null
    },
    almuerzo: {
        type: String,
        default: '00:00'
    },
    coordAlmuerzo: {
        type: String,
        default: null
    },
    regreso: {
        type: String,
        default: '00:00'
    },
    coordRegreso: {
        type: String,
        default: null
    },
    salida: {
        type: String,
        default: '00:00'
    },
    coordSalida: {
        type: String,
        default: null
    },
    fecha: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una relacion con usuario']
    }
});

interface ITimbrar extends Document {
    entrada: string;
    coordEntrada: string;
    almuerzo: string;
    coordAlmuerzo: string;
    regreso: string
    coordRegreso: string;
    salida: string;
    coordSalida: string;
    fecha: string;
    usuario: string;
}

export const Timbrar = model<ITimbrar>('Timbrada', timbrarSchema);
