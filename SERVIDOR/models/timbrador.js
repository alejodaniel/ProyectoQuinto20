'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var asistSchema = Schema({

   nombre: String,
    fecha: String,
    departamento: String,
    hora1: String,
    hora2: String,
    hora3: String,
    hora4: String,
    timbradas: Number,
    horaTrabajada: Number,

});

module.exports = mongoose.model('Asistente', asistSchema);
