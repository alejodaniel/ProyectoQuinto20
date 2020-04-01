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
        ubicacion: req.body.ubicacion,
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


//actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {
    const user = {

        nombre: req.body.nombre   || req.usuario.nombre,
        apellido: req.body.apellido   || req.usuario.apellido,
        email: req.body.email   || req.usuario.email,
        carrera: req.body.carrera   || req.usuario.carrera,
        ubicacion: req.body.ubicacion   || req.usuario.ubicacion,
        huella:req.body.huella   || req.usuario.huella
    }
    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

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

    });

});


userRoutes.get('/', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    })
});
export default userRoutes;