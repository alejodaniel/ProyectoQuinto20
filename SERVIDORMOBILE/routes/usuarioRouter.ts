import {Router, Request, Response} from "express";
import {Usuario} from "../models/usuarioModel";
import Token from "../classes/token";
import {verificaToken} from "../middlewares/autenticacion";


const userRoutes = Router();
//Crear un usuario
userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        carrera: req.body.carrera,
        ubicacion: req.body.carrera,
        huella:req.body.huella

    };
    Usuario.create(user).then(userDB => {
        const tokenUsuario = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            email: userDB.email,
            carrera: userDB.carrera,
            ubicacion: userDB.ubicacion,
            huella:userDB.huella

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

userRoutes.get('/', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    })
});
export default userRoutes;