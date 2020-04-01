"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usuarioSchema = new mongoose_1.Schema({
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
    },
    tema: {
        type: Boolean,
        default: true
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
