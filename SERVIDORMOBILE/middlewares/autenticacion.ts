import {Request, Response, NextFunction} from 'express';
import Token from "../classes/token";


export const verificaToken = (req: any, res: Response, next: NextFunction) => {

    const userToken= req.get('token')|| '';
    Token.comprobarToker(userToken).then((decoded:any)=>{
        console.log('DECODED',decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch(err=>{
        res.json({
            ok:false,
            mensaje: 'Token no es correcto'
        });
    });

}
