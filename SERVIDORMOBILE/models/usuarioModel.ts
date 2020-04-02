import {Schema, model, Document} from 'mongoose';


const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es requerido']
    },
    huella: {
        type: String,
        required: [true, 'La huella dactilar es requerido']
    },
    tema: {
        type: Boolean,
        default: true
    }
});

interface IUser extends Document {
    nombre: string;
    apellido: string;
    email: string;
    carrera: string;
    huella: string;
    tema: boolean;

}

export const Usuario = model<IUser>('Usuario', usuarioSchema);
