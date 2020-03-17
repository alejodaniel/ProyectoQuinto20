'use strict'
var express = require('express');
var asistenteController = require('../controllers/timbrador');

var api = express.Router();

api.post('/asistente', asistenteController.create);
api.get('/asistente', asistenteController.findAll);
api.put('/asistente', asistenteController.update);
api.delete('/asistente/:asistentesId', asistenteController.delete);
module.exports = api;
