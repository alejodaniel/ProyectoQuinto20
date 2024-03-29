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

timbrarRoutes.get('/user/obtener/timbrar/reporte/:fecha1/:fecha2', (req: any, res: Response) => {
    let fecha1 = req.params.fecha1;
    fecha1 = fecha1.replace('-', '/');
    fecha1 = fecha1.replace('-', '/');
    let fecha2 = req.params.fecha2;
    fecha2 = fecha2.replace('-', '/');
    fecha2 = fecha2.replace('-', '/');
    Timbrar.find({fecha: {$gte: fecha1, $lte: fecha2}}).then((timbrar: any) => {
        if (!timbrar) {
            return res.json({
                ok: false,
            });
        }
        res.json({
            ok: true,
            timbrar
        });
    }).catch((err: any) => {
        res.json(err);
    });
});

timbrarRoutes.get('/user/obtener/userTimbradas', [verificaToken], (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1
    let skip = pagina - 1;
    skip = skip * 10;

    Timbrar.find({usuario: req.usuario._id})
        .sort({_id: -1})
        .skip(skip)
        .limit(10)
        .then(async (timbrar: any) => {
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
    }).catch((err: any) => {
        res.json(err);
    });
});

export default timbrarRoutes;
