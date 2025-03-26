import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());


app.get('/api/products', async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({success: true, data: products});
    } catch(error){
        res.status(500).json({success: false, message: error.message});
    }
});


app.post('/api/products', async (req, res) => {
    const product = req.body;
    console.log(product);

    if(!product.name || !product.price || !product.image){
        return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    const newProduct = new Product(product);

    try{
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    } catch{
        res.status(500).json({success: false, message: error.message});
    }
});


app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No product with that id');
    }

    const product = req.body;

    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, {new: true});
        res.status(200).json({success: true, data: updatedProduct});
    } catch(error){
        res.status(500).json({success: false, message: "Server Error"});
    }
});


app.delete('/api/products/:id', async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({success: true, message: 'Product is deleted'});
    } catch(error){
        res.status(404).json({success: false, message: "Product not found"});
    }
});


app.listen(5000, () => {
    connectDB();
  console.log('Server is running on port 5000 !');
});
