"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioModel_1 = require("../models/usuarioModel");
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const bcrypt_1 = __importDefault(require("bcrypt"));
const FileSystem_1 = __importDefault(require("../classes/FileSystem"));
const fileSystem = new FileSystem_1.default();
const userRoutes = express_1.Router();
userRoutes.get('/', (req, res) => {
    res.json({
        ok: true,
    });
});
userRoutes.get('/user/obtenerPorId/:id', (req, res) => {
    const id = req.params.id;
    usuarioModel_1.Usuario.findById(id).then((usuario) => __awaiter(void 0, void 0, void 0, function* () {
        if (!usuario) {
            return res.json({
                ok: false,
            });
        }
        res.json({
            ok: true,
            usuario
        });
    })).catch((err) => {
        res.json(err);
    });
});
//Crear un usuario
userRoutes.post('/user/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        avatar: req.body.avatar,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        carrera: req.body.carrera,
        huella: req.body.huella,
        rol: req.body.rol,
        tema: req.body.tema
    };
    usuarioModel_1.Usuario.create(user).then(userDB => {
        const tokenUsuario = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            email: userDB.email,
            carrera: userDB.carrera,
            avatar: userDB.avatar,
            huella: userDB.huella,
            rol: userDB.rol,
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
userRoutes.post('/user/update', [autenticacion_1.verificaToken], (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        email: req.body.email || req.usuario.email,
        carrera: req.body.carrera || req.usuario.carrera,
        huella: req.body.huella || req.usuario.huella,
        avatar: req.body.avatar,
        rol: req.body.rol,
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
                huella: userDB.huella,
                avatar: userDB.avatar,
                rol: userDB.rol,
                tema: req.body.tema
            });
            return res.json({
                ok: true,
                token: tokenUsuario
            });
        }
    });
});
userRoutes.post('/user/login', (req, res) => {
    const body = req.body;
    usuarioModel_1.Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err)
            throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Usuario o Contraseña no son correctos'
            });
        }
        if (usuario.compararPassword(body.password)) {
            const token = token_1.default.getJwtToken({
                _id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                avatar: usuario.avatar,
                carrera: usuario.carrera,
                rol: usuario.rol,
                tema: usuario.tema
            });
            return res.json({
                ok: true,
                token: token
            });
        }
        return res.json({
            ok: false,
            mensaje: 'Usuario o Contraseña no son correctos'
        });
    });
});
userRoutes.post('/user/pass', (req, res) => {
    const body = req.body;
    usuarioModel_1.Usuario.findOne({ password: body.password }, (err, usuario) => {
        if (err)
            throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Usuario o Contraseña no son correctos'
            });
        }
        if (usuario.compararPassword(body.password)) {
            const user = {
                _id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                avatar: usuario.avatar,
                carrera: usuario.carrera,
                rol: usuario.rol,
                tema: usuario.tema
            };
            return res.json({
                ok: true,
                user: user
            });
        }
        return res.json({
            ok: false,
            mensaje: 'Contraseña no es correcto'
        });
    });
});
userRoutes.get('/user', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
//Subir Archivo
userRoutes.post('/user/imagen', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debes subir una imagen'
        });
    }
    yield fileSystem.guardarImagen(file, req.usuario._id, req.usuario.avatar).then(img => {
        return res.json({
            ok: true,
            img
        });
    });
}));
userRoutes.get('/user/imagen/:userId/:img', (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = userRoutes;
