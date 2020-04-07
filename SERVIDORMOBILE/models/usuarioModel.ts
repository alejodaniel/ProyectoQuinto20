import {Schema, model, Document} from 'mongoose';
import bcrypt from "bcrypt";

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
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es requerido']
    },

    avatar: {
        type: String,
        default: 'img-01.png'
    },
    huella: {
        type: String,
        required: [true, 'La huella dactilar es requerido']
    },
    tema: {
        type: Boolean,
        default: true
    },

});

usuarioSchema.method('compararPassword', function (password: string = ""): boolean {
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface IUser extends Document {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    carrera: string;
    avatar: string;
    huella: string;
    tema: boolean;

    compararPassword(password: string): boolean;
}

export const Usuario = model<IUser>('Usuario', usuarioSchema);
