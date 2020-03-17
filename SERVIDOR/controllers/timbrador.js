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
        res.status(500).send({message: 'Error a' +
                'l guardar'});
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

//encontrar uno solo
exports.findOne = (req, res) => {
    Asistente.findById(req.params.asistenteId).then(asistente => {
        if (!asistente) {
            res.status(404).send({message: 'No se encuentra lo que busca'});
        }
        res.json(asistente);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({message: 'No se encuentra el dato '});
        }
        return res.status(500).send({message: 'Error de servidor'});
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

exports.uploadImage = (req, res) => {
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Animal.findByIdAndUpdate(animalId, {image: file_name}, {new: true}, (err, animalUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar usuario'
                    });
                } else {
                    if (!animalUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar el animal'});
                    } else {
                        res.status(200).send({animal: animalUpdated, image: file_name});
                    }
                }
            });

        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({message: 'Extensión no valida y fichero no'});
                } else {
                    res.status(200).send({message: 'Extensión no valida'});
                }
            });
        }

    } else {
        res.status(200).send({message: 'No se han subido archivos'});
    }
}
