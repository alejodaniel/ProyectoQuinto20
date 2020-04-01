"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioModel_1 = require("../models/usuarioModel");
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
//Crear un usuario
userRoutes.post('/user/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        carrera: req.body.carrera,
        ubicacion: req.body.carrera,
        huella: req.body.huella,
        tema: req.body.tema
    };
    usuarioModel_1.Usuario.create(user).then(userDB => {
        const tokenUsuario = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            email: userDB.email,
            carrera: userDB.carrera,
            ubicacion: userDB.ubicacion,
            huella: userDB.huella,
            tema: req.body.tema
        });
        res.json({
            ok: true,
            token: tokenUsuario
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Actualiza usuario
userRoutes.put('/user/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        carrera: req.body.carrera,
        ubicacion: req.body.carrera,
        huella: req.body.huella,
        tema: req.body.tema
    };
    usuarioModel_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese id'
            });
        }
        else {
            const tokenUsuario = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                apellido: userDB.apellido,
                email: userDB.email,
                carrera: userDB.carrera,
                ubicacion: userDB.ubicacion,
                huella: userDB.huella,
                tema: req.body.tema
            });
            return res.json({
                ok: true,
                token: tokenUsuario
            });
        }
    });
});
userRoutes.get('/user', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
