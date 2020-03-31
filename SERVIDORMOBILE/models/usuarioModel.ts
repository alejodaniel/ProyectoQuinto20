import {Schema, model, Document} from 'mongoose';


const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nomnbre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El nomnbre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es necesaria']
    },
    ubicacion: {
        type: String,

    },
    huella: {
        type: String,
        required: [true, 'La huella dactilar es necesaria']
    }
});

interface IUser extends Document{
   nombre:string;
    apellido:string;
    email:string;
    carrera:string;
    ubicacion:string;
    huella:string;
    
}

export const  Usuario =  model<IUser>('Usuario',usuarioSchema);