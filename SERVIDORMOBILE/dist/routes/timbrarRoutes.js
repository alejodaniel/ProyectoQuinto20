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
const autenticacion_1 = require("../middlewares/autenticacion");
// @ts-ignore
const timbraModel_1 = require("../models/timbraModel");
const FileSystem_1 = __importDefault(require("../classes/FileSystem"));
const fileSystem = new FileSystem_1.default();
const timbrarRoutes = express_1.Router();
//'-password'
timbrarRoutes.post('/user/create/timbrar', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    timbraModel_1.Timbrar.create(body).then((result) => __awaiter(void 0, void 0, void 0, function* () {
        yield result.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            timbrar: result
        });
    })).catch((err) => {
        res.json(err);
    });
});
timbrarRoutes.post('/user/update/timbrar', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    timbraModel_1.Timbrar.findByIdAndUpdate(body._id, body, { new: true }).then((timbrar) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        yield timbrar.populate('usuario').execPopulate();
        res.json({
            ok: true,
            timbrar
        });
    })).catch((err) => {
        res.json(err);
    });
});
timbrarRoutes.get('/user/obtener/timbrar/:fecha', [autenticacion_1.verificaToken], (req, res) => {
    let fecha = req.params.fecha;
    fecha = fecha.replace('-', '/');
    fecha = fecha.replace('-', '/');
    timbraModel_1.Timbrar.findOne({ fecha: fecha, usuario: req.usuario._id }).then((timbrar) => __awaiter(void 0, void 0, void 0, function* () {
        if (!timbrar) {
            return res.json({
                ok: false,
            });
        }
        // @ts-ignore
        yield timbrar.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            timbrar
        });
    })).catch((err) => {
        res.json(err);
    });
});
timbrarRoutes.get('/user/obtener/timbrar/reporte/:fecha1/:fecha2', (req, res) => {
    let fecha1 = req.params.fecha1;
    fecha1 = fecha1.replace('-', '/');
    fecha1 = fecha1.replace('-', '/');
    let fecha2 = req.params.fecha2;
    fecha2 = fecha2.replace('-', '/');
    fecha2 = fecha2.replace('-', '/');
    timbraModel_1.Timbrar.find({ fecha: { $gte: fecha1, $lte: fecha2 } }).then((timbrar) => {
        if (!timbrar) {
            return res.json({
                ok: false,
            });
        }
        res.json({
            ok: true,
            timbrar
        });
    }).catch((err) => {
        res.json(err);
    });
});
timbrarRoutes.get('/user/obtener/userTimbradas', [autenticacion_1.verificaToken], (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    timbraModel_1.Timbrar.find({ usuario: req.usuario._id })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .then((timbrar) => __awaiter(void 0, void 0, void 0, function* () {
        if (!timbrar) {
            return res.json({
                ok: false,
            });
        }
        res.json({
            ok: true,
            timbrar,
            pagina
        });
    })).catch((err) => {
        res.json(err);
    });
});
exports.default = timbrarRoutes;
