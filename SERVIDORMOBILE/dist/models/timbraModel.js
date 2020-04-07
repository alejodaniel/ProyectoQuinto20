"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timbrarSchema = new mongoose_1.Schema({
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
    ubicacion: {
        type: String,
        default: null
    },
    observacion: {
        type: String,
        default: null
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una relacion con usuario']
    }
});
exports.Timbrar = mongoose_1.model('Timbrada', timbrarSchema);
