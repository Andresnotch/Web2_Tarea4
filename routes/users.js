const express = require('express');
const db = require('../db')
const router = express.Router();
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(5).required(),
  age: Joi.number().greater(0).required()
});

router.use(function(req, res, next) {
  if(req.method == 'POST' || req.method == 'PUT') {
    const { error, value } = userSchema.validate(req.body);
    if(error) {
      console.log(error);
      res.status(400).send(error);
    } 
  }
  next();
});


/* GET users listing. */
router.get('/', async function(req, res) {
  try {
    const usr = await db.getAllUsers();
    res.send(usr)
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async function(req, res) {
  const newUser = req.body;
  try {
    const resp = await db.insertUser(newUser);
    res.send(resp.rows[0]);
  } catch (error) {
    res.send(error);
  }
});

router.put('/:id', async function(req, res) {
  const {id} = req.params;
  const User = req.body;
  try {
    const resp = await db.updateUser(id, User);
    res.send(resp.rows[0]);
  } catch (error) {
    res.send(error);
  }
});

router.delete('/:id', async function (req, res) {
  const {id} = req.params;
  try {
    const resp = await db.deleteUser(id);
    res.send(resp.rows[0]);
  } catch (error) {
    res.send(error);
  }

});

module.exports = router;
