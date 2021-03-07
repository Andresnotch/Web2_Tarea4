const express = require('express');
const db = require('../db')
const router = express.Router();
const Joi = require('joi');

const animalSchema = Joi.object({
  animalsname: Joi.string().min(5).required(),
  animalsage: Joi.string().required(),
  breedname: Joi.string(),
  speciesname: Joi.string(),
  basecolour: Joi.string()
})

router.use(function (req, res, next) {
  if (req.method == 'GET') next();
  const {
    error,
    value
  } = animalSchema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).send(error);
  } else {
    next();
  }
})


router.get('/', async function (req, res) {
  try {
    let animals = await db.getAllAnimalsWithUser();
    res.send(animals);
  } catch (error) {
    res.send(error);
  }

});

router.get('/:id', async function (req, res) {
  const {
    id
  } = req.params;
  try {
    const animal = await db.getAnimalById(id);
    res.send(animal);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async function (req, res) {
  const newAnimal = req.body;
  try {
    const resp = await db.insertAnimal(newAnimal);
    newAnimal.id = resp.rows[0].id;
    res.send(newAnimal);

  } catch (error) {
    res.send(error);
  }
});


router.put('/:id', async function (req, res) {
  const {
    id
  } = req.params;
  const animal = req.body;
  try {
    const resp = await db.updateAnimal(id, animal);
    res.send(resp.rows[0]);
  } catch (error) {
    res.send(error);
  }

});

router.delete('/:id', async function (req, res) {
  const {
    id
  } = req.params;

  try {
    const resp = await db.deleteAnimal(id);
    res.send(resp.rows[0]);
  } catch (error) {
    res.send(error);
  }

});

module.exports = router;