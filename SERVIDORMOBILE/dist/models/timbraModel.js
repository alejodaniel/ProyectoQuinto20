"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timbrarSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una relacion con usuario']
    }
});
exports.Timbrar = mongoose_1.model('Timbrar', timbrarSchema);
