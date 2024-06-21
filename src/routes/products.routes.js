import { Router } from 'express';
import productDao from '../dao/mongoDB/product.dao.js';
import { checkProductData } from '../middleware/checkProductData.midware.js';
import { checkProductKeys } from '../middleware/checkProductKeys.midware.js';
import { checkIDs } from '../middleware/checkmongoID.midware.js';



const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, category, status } = req.query;

        const options = { 
            limit: parseInt(limit) || 10, 
            page: parseInt(page) || 1, 
            sort: { price: sort == 'asc' ? 1 : -1},
            lean: true
        };

        if (category) {
            const products = await productDao.getAll({category}, options);
            return res.status(200).json({ status: 'OK', products });
        }
        if (status) {
            const products = await productDao.getAll({status}, options);
            return res.status(200).json({ status: 'OK', products });
        }

        const products = await productDao.getAll({}, options);

        res.status(200).json({ status: 'OK', products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }

});

router.get('/:pid', checkIDs, async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.getById((pid));

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
        const newProduct = await productDao.create(product);

        res.status(201).json({ status: 'Created', newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.put('/:pid', checkIDs, checkProductKeys, async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;

        const updatedProduct = await productDao.update((pid), product);

        res.status(200).json({ status: 'Updated', updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.delete('/:pid', checkIDs, async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productDao.deleteOne(pid);

        res.status(200).json({ status: 'Deleted', deletedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});


export default router;