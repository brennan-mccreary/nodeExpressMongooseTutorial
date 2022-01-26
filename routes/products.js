const { User } = require('../models/user'); 
const { Product, validate } = require('../models/product');
const express = require('express');
// const { valid } = require('joi');
// const { resolveSoa } = require('dns');
const router = express.Router();

//Endpoints
////Post
router.post('/', async (req, res) => {
    try{

        //validation through Joi
        const { error } = validate(req.body);
        if(error) {
            return res.status(400).send(error);
        }

        //request handler
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
        });
        
        await product.save();

        return res.send(product);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

////PUT
router.put('/:id', async (req, res) => {
    try{
        const { error } = validate(req.body);
        if(error) {
            return res.status(400).send(error);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
            },
            { new: true}
        );

        if(!product) {
            return res.send(400).send(`The Product with id ${req.params.id} does not exist.`)
        }

        await product.save();

        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Interal Server Error: ${ex}`);
    }
});

////DELETE
router.delete('/:id', async (req, res) => {
    try{
        const product = await Product.findByIdAndRemove(req.params.id);

        if(!product) {
            return res.status(400).send(`The product with id ${req.params.id} does not exist.`);
        }
    } catch(ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

////GET
router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        return res.send(products);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

////GET by ID
router.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(400).send(`The product with id ${req.params.id} does not exist.`)
        }

        return res.send(product);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

//Export
module.exports = router;