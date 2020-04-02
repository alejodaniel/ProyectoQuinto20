"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usuarioSchema = new mongoose_1.Schema({
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
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
