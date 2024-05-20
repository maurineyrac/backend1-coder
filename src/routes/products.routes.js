import { Router } from 'express';
import productManager from '../productManager.js'
import { checkProductData } from '../middleware/checkProductData.midware.js';
import { checkProductKeys } from '../middleware/checkProductKeys.midware.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts(limit);

        res.status(200).json({ status: 'OK', products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }

});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(Number(pid));

        if (!product) {
            return res.status(404).json({ status: 'Not Found', msg: 'Product not found' });
        }

        res.status(200).json({ status: 'OK', product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.post('/', checkProductData, async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productManager.addProduct(product);

        res.status(201).json({ status: 'Created', newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.put('/:pid',checkProductKeys, async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;

        const updatedProduct = await productManager.updateProduct(Number(pid), product);

        if (!updatedProduct) {
            return res.status(404).json({ status: 'Not Found', msg: 'Product not found' });
        }

        res.status(200).json({ status: 'Updated', updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(Number(pid));

        if (!deletedProduct) {
            return res.status(404).json({ status: 'Not Found', msg: 'Product not found' });
        }

        res.status(200).json({ status: 'Deleted', deletedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});


export default router;