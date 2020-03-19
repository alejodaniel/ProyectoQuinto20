'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Asistentes = mongoose.model('Asistentes');

var fileSchema = Schema({
    nombre: {
        type: String,
        unique: true
    },
    usuarios: [{type: Schema.ObjectId, ref: "Asistentes"}]

});

module.exports = mongoose.model('Files', fileSchema);
