'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileSchema = Schema({

    nombre: {
        type: String,
        unique: true
    },
    usuarios: [{}],

});

module.exports = mongoose.model('Files', fileSchema);
