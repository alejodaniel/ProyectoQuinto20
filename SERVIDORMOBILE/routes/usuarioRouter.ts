import {Router, Request, Response} from "express";
import {Usuario} from "../models/usuarioModel";
import Token from "../classes/token";
import {verificaToken} from "../middlewares/autenticacion";


const userRoutes = Router();
//Crear un usuario
userRoutes.post('/user/create', (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        carrera: req.body.carrera,
        huella: req.body.huella,
        tema: req.body.tema

    };
    Usuario.create(user).then(userDB => {
        const tokenUsuario = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            email: userDB.email,
            carrera: userDB.carrera,
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
    })
});

//Actualiza usuario
userRoutes.put('/user/update', verificaToken, (req: any, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        carrera: req.body.carrera,
        huella: req.body.huella,
        tema: req.body.tema

    };
    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese id'
            });
        } else {
            const tokenUsuario = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                apellido: userDB.apellido,
                email: userDB.email,
                carrera: userDB.carrera,
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

userRoutes.get('/user', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    })
});

export default userRoutes;
