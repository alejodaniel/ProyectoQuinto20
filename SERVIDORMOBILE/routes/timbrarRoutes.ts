import {Request, Response, Router} from "express";
import {verificaToken} from "../middlewares/autenticacion";
// @ts-ignore
import {Timbrar} from "../models/timbraModel";

import FileSystem from "../classes/FileSystem";

const fileSystem = new FileSystem();

const timbrarRoutes = Router();

//'-password'

timbrarRoutes.post('/user/create/timbrar', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    Timbrar.create(body).then(async (result: any) => {
        await result.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            timbrar: result
        });
    }).catch((err: any) => {
        res.json(err);
    });
});

timbrarRoutes.post('/user/update/timbrar', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    Timbrar.findByIdAndUpdate(body._id, body, {new: true}).then(async (timbrar: any) => {
        // @ts-ignore
        await timbrar.populate('usuario').execPopulate();
        res.json({
            ok: true,
            timbrar
        });
    }).catch((err: any) => {
        res.json(err);
    });
});

timbrarRoutes.get('/user/obtener/timbrar/:fecha', [verificaToken], (req: any, res: Response) => {
    let fecha = req.params.fecha;
    fecha = fecha.replace('-', '/');
    fecha = fecha.replace('-', '/');
    Timbrar.findOne({fecha: fecha, usuario: req.usuario._id}).then(async (timbrar: any) => {
        if (!timbrar) {
            return res.json({
                ok: false,
            });
        }
        // @ts-ignore
        await timbrar.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            timbrar
        });
    }).catch((err: any) => {
        res.json(err);
    });
});



export default timbrarRoutes;
