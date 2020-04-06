import {Request, Response, Router} from "express";
import {verificaToken} from "../middlewares/autenticacion";
import {Timbrar} from "../models/timbraModel";

const timbrarRoutes = Router();

//'-password'

timbrarRoutes.post('/user/create/timbrar', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    console.log(body)
    body.usuario = req.usuario._id;
    Timbrar.create(body).then(async timbrar => {
        await timbrar.populate('usuario').execPopulate();
        res.json({
            ok: true,
            timbrar
        });
    }).catch(err => {
        res.json(err);
    });
});

timbrarRoutes.post('/user/update/timbrar', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    Timbrar.findByIdAndUpdate(body._id, body, {new: true}).then(async timbrar => {
        // @ts-ignore
        await timbrar.populate('usuario').execPopulate();
        res.json({
            ok: true,
            timbrar
        });
    }).catch(err => {
        res.json(err);
    });
});


export default timbrarRoutes;
