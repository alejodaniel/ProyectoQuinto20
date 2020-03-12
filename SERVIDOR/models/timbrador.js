'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var asistSchema = Schema({

   fecha: String,
    hora: String,
    departamento: String,
    nombre: String
});

module.exports = mongoose.model('Asistente', asistSchema);
