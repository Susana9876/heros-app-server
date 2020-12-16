// ******* CONTROLLER *************
const db = require('../model/heroes.model');
const Heroe = db.heroes;

// CREATE operation
exports.create = (req, res) => {
    // Validar petición
    if (!req.body) {
        req.status(400).send({ message: "El contenido de la petición no puede estar vacío" });
        return;
    }

    // Crear héroe
    const heroe = new Heroe({
        nombre: req.body.nombre,
        bio: req.body.bio,
        img: req.body.img,
        aparicion: req.body.aparicion,
        casa: req.body.casa,
        activo: true
    });

    Heroe
        .save(heroe)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            throwError(res, err);
        });
};

// READ Operations
exports.findAll = (req, res) => {
    Heroe.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            throwError(res, err);
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Heroe.findById(id)
        .then(data => {
            if (!data)
                res.status(400).send({ message: `No se encontró elemento con ID: ${id}` });
            else res.send(data);
        })
        .catch(err => {
            throwError(res, err);
        });
}

exports.findSome = (req, res) => {
    const termino = req.query.termino;
    var query = termino ? { nombre: { $regex: new $RegExp(termino), $options: "i" }, activo: true } : {};
    Heroe.find(query)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            throwError(res, err);
        });
}
exports.findActive = (req, res) => {
    Heroe.find({ activo: true }).then(data => {
            res.send(data);
        })
        .catch(err => {
            throwError(res, err);
        });
};

// UPDATE Operations
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "La petición no puede estar vacía"
        });
    }

    const id = req.params.id;

    Heroe.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(400).send({
                    message: `No se pudo actualizar el héroe con el ID: ${id}`
                });
            } else res.send({ message: "Héroe actualizado correctamente" });
        })
        .catch(err => {
            throwError(res, err);
        })
}

// DELETE Operation
exports.delete = (req, res) => {
    const id = req.params.id;
    console.log(id);
    Heroe.findByIdAndUpdate(id, { activo: false }, { useFindAndModify: false })
        .then(data => {
            if (!data)
                res.status(400).send({
                    message: `No se pudo eliminar el héroe con el ID: ${id}`
                });
            else res.send({ message: "Héroe removido correctamente" });
        })
        .catch(err => {
            console.log(err);
            throwError(res, err);
        });
};

// AGGREGATE
exports.grouping = (req, res) => {
    Heroe.aggregate([{
                $lookup: {
                    from: "Casas",
                    localField: "casa",
                    foreignField: "casa",
                    as: "casas"
                }
            },
            { $unwind: "$casas" },
            // { $match: { casa: "DC" } },
            // { $project: { _id: 0, nombre: 1, casa: 1, "casas.casas": 1 } }])
            {
                $group: {
                    _id: "$casas.casa",
                    count: { $sum: 1 }
                }
            }
        ])
        .then(grupo => {
            res.send(grupo)
        })
        .catch(err => {
            throwError(res, err);
        });

}

// Exportar paginacion
exports.pagination = (req, res) => {
    const page = 1;
    const limit = 3;
    try {
        // Ejecutar query con numero de pagina y limite de documentos
        const heroes = Heroe.find()
            .limit(limit)
            .skip((page - 1) * limit);

        res.send(heroes);
    } catch (err) {
        throwError(res, err);
    }
};

// UTILS
function throwError(res, err) {
    res.status(500).send({
        message: err.message || "Ocurrión un error en el web server"
    });
}