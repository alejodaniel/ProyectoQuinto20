import {Router, Request, Response} from "express";
import {Usuario} from "../models/usuarioModel";
import Token from "../classes/token";
import {verificaToken} from "../middlewares/autenticacion";
import bcrypt from "bcrypt";
import {IFileUpload} from "../interfaces/file-upload";
import FileSystem from "../classes/FileSystem";

const fileSystem = new FileSystem();

const userRoutes = Router();
userRoutes.get('/', (req: any, res: Response) => {
    res.json({
        ok: true,
    })
});

userRoutes.get('/user/obtenerPorId/:id', (req: any, res: Response) => {
    const id = req.params.id;
    Usuario.findById(id).then(async (usuario: any) => {
        if (!usuario) {
            return res.json({
                ok: false,
            });
        }
        res.json({
            ok: true,
            usuario
        });
    }).catch((err: any) => {
        res.json(err);
    });
});

//Crear un usuario
userRoutes.post('/user/create', (req: Request, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        avatar: req.body.avatar,
        password: bcrypt.hashSync(req.body.password, 10),
        carrera: req.body.carrera,
        huella: req.body.huella,
        rol: req.body.rol,
        tema: req.body.tema

    };
    Usuario.create(user).then(userDB => {
        const tokenUsuario = Token.getJwtToken({
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
    })
});

//Actualiza usuario
userRoutes.post('/user/update', [verificaToken], (req: any, res: Response) => {
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

userRoutes.post('/user/login', (req: Request, res: Response) => {

    const body = req.body;

    Usuario.findOne({email: body.email}, (err, usuario) => {
        if (err) throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Usuario o Contraseña no son correctos'
            });
        }
        if (usuario.compararPassword(body.password)) {
            const token = Token.getJwtToken({
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

userRoutes.post('/user/pass', [verificaToken], (req: any, res: Response) => {

    const pass = req.body.password;

    Usuario.findOne({_id: req.usuario._id}, (err, usuario) => {
        if (err) throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Contraseña no es correcta'
            });
        }
        if (usuario.compararPassword(pass)) {
            return res.json({
                ok: true,
            });
        }
        return res.json({
            ok: false,
            mensaje: 'Contraseña no es correcta'
        });
    });

});

userRoutes.get('/user', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    })
});


//Subir Archivo
userRoutes.post('/user/imagen', [verificaToken], async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: IFileUpload = req.files.image;

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


    await fileSystem.guardarImagen(file, req.usuario._id, req.usuario.avatar).then(img => {
        return res.json({
            ok: true,
            img
        });
    });


});

userRoutes.get('/user/imagen/:userId/:img', (req: any, res: Response) => {
    const userId = req.params.userId;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathFoto);
});

export default userRoutes;
