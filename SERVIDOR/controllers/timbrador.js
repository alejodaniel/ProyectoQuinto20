'use strict'
var Asistente = require('../models/timbrador');

//Guardar
exports.create = (req, res) => {
    //iniciar el objeto
    var asistente = new Asistente(req.body);

    //guardar
    asistente.save().then(data => {
        res.json(data);
        res.status(200).send({personasagg: data});
    }).catch(err => {
        res.status(500).send({message: 'Error al guardar'});
    });
}


//buscar todos
exports.findAll = (req, res) => {
    Asistente.find().then(asistentes => {
        res.json(asistentes);
    }).catch(err => {
        res.status(500).send({message: 'Error al buscar'});
    });
}


//actualizar

exports.update = (req, res) => {
    Asistente.findByIdAndUpdate(req.body.id.req.body, {new: true}).then(asistente => {
        if (!asistente) {
            res.status(404).send({message: 'Asistente no se encuentra'});
        }
        res.json(asistente);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            res.status(404).send({message: 'Asistente no encontrado'});
        }
        res.status(500).send({message: 'Error de servidor'});
    });
}


// DELETE a Customer
exports.delete = (req, res) => {
    Asistente.findByIdAndRemove(req.params.asistentesId)
        .then(asistente => {
            if (!asistente) {
                return res.status(404).json({
                    msg: "Asistente no se ecuentra " + req.params.asistentesId
                });
            }
            res.json({msg: "Se borro correctamente"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.nombre === 'NotFound') {
            return res.status(404).json({
                msg: "Asistente no se encuentra" + req.params.asistentesId
            });
        }
        return res.status(500).json({
            msg: "No se puede borrar" + req.params.asistentesId
        });
    });
};

