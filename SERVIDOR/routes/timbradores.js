'use strict'
var express = require('express');
var asistenteController = require('../controllers/timbrador');

var api = express.Router();

api.post('/asistente', asistenteController.create);
api.post('/archivo', asistenteController.createFile);
api.get('/getArchivos', asistenteController.findAllFiles);
api.get('/asistente', asistenteController.findAll);
api.get('/asistente/:asistenteId', asistenteController.findOne);
api.get('/archivo/:archivoId', asistenteController.findOneArchivo);
api.put('/asistente', asistenteController.update);
api.delete('/asistente/:asistentesId', asistenteController.delete);
api.get('/asistentes/:Nombre', asistenteController.findByName);
api.get('/asistentes/fecha/:Fecha', asistenteController.findByDate);
module.exports = api;
