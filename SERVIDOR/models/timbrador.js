'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var asistSchema = Schema({
    Nombre: {
        type: String,
        unique: true
    },
    Fecha: String,
    Departamento: String,
    Hora1: String,
    Hora2: String,
    Hora3: String,
    Hora4: String,
    timbradas: Number,
    HoraTrabajada: Number,

});

module.exports = mongoose.model('Asistentes', asistSchema);
