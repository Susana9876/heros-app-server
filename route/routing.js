const heroes = require('../controller/heroes.controller.js');
var router = require('express').Router();

// GET Methods

// GET All
router.get('/heroes', heroes.findAll);

// GET by ID
router.get('/heroe/:id', heroes.findOne);

// GET by Term
router.get('/heroesTerm', heroes.findSome);

// GET Active
router.get('/heroesAct', heroes.findActive);

// GET Agrupación
router.get("/heroesGroup", heroes.grouping);

// Get Paginación
router.get("/heroesPag", heroes.pagination);

//POST Heroe
router.post('/heroe', heroes.create);

// PUT Héroe
router.put("heroe/:id", heroes.update);

// DELETE Heroe
router.delete("/heroe/:id", heroes.delete);

module.exports = router;