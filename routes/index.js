const express = require('express');
const axios = require('axios');
const db = require('../db');
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    let animals = await db.getAllAnimals();
    const animalsPromises = animals.map(() => {
        return new Promise((resolve, reject) => {
            axios.get('https://api.thecatapi.com/v1/images/search')
                .then(function ({
                    data
                }) {
                    const [cat] = data;
                    const {
                        url
                    } = cat;
                    resolve(url);
                }).catch(function (error) {
                    reject(error);
                });
        });
    });

    Promise.all(animalsPromises)
        .then(function (urls) {
            const animalsWithImage = animals.map((animal, index) => ({
                ...animal,
                image: urls[index]
            }));
            res.render('index', {
                animalsWithImage
            });
        })
        .catch(function (errors) {
            res.send(`${errors}`)
        });
});

router.get('/:id', async function (req, res) {
    const {
        id
    } = req.params;
    let animal = await db.getAnimalById(id);
    const {
        url
    } = req.query;
    res.render('animal', {
        animal,
        image: url
    })
});


module.exports = router;