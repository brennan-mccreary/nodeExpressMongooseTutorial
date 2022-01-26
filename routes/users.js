const { Product, validate } = require('../models/product');
const express = require('express');
const { valid } = require('joi');
const { resolveSoa } = require('dns');
const { User, validate } = require('../models/user');
const router = express.Router();

//Endpoints
////Post
router.post('/:userId/shoppingcar/:productId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        if(!user) {
            return res.status(400).send(`The user with id ${req.params.userId} does not exist.`);
        }

        const product = await Product.findByIdAndUpdate(req.params.productId)
        if(!product) {
            return res.status(400).send(`The product with id ${req.params.productId} does not exist.`);
        }
        

        user.shoppingCart.push(product);
        
        await user.save();
        return res.send(user.shoppingCart);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

////PUT
router.post('/:userId/shoppingcar/:productId', async (req, res) => {
    try{
        const { error } = validate(req.body);
        if(error) {
            return res.status(400).send(error);
        }

        const user = await User.findById(req.params.userId);
        if(!user) {
            return res.status(400).send(`The user with id ${req.params.userId} does not exist.`);
        }

        const product = user.shoppingCart.id(req.params.productId)
        if(!product) {
            return res.status(400).send(`The product with id ${req.params.productId} does not exist in the users shopping cart.`);
        }
        
        product.name = req.body.name,
        product.description = req.body.description,
        product.category = req.body.category,
        product.price = req.body.price,
        product.dateModified = Date.now();

        await user.save();
        return res.send(product);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

////DELETE
router.delete('/:userId/shoppingcar/:productId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        if(!user) {
            return res.status(400).send(`The user with id ${req.params.userId} does not exist.`);
        }

        let product = user.shoppingCart.id(req.params.productId)
        if(!product) {
            return res.status(400).send(`The product with id ${req.params.productId} does not exist in the users shopping cart.`);
        }

        product = await product.remove();

        await user.save();
        return res.send(product);
        
    } catch(ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});


//Export
module.exports = router;