"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
usuarioSchema.method('compararPassword', function (password = "") {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
