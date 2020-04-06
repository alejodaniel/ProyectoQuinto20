import {Schema, model, Document} from 'mongoose';

const timbrarSchema = new Schema({
    entrada: {
        type: String,
        default: '00:00'
    },
    almuerzo: {
        type: String,
        default: '00:00'
    },
    regreso: {
        type: String,
        default: '00:00'
    },
    salida: {
        type: String,
        default: '00:00'
    },
    fecha: {
        type: Date
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una relacion con usuario']
    }
});

interface ITimbrar extends Document {
    entrada: string;
    almuerzo: string;
    regreso: string;
    salida: string;
    fecha: Date;
    usuario: string;
}

export const Timbrar = model<ITimbrar>('Timbrar', timbrarSchema);
