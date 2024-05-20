import { Router } from 'express';
import cartManager from '../cartManager.js';
import productManager from '../productManager.js';

const router = Router();

router.post('/', async (req, res) => {
    try {

        const newCart = await cartManager.createCart();

        res.status(201).json({ status: 'Created', newCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(Number(cid));

        if (!cart) {
            return res.status(404).json({ status: 'Not Found', msg: 'Cart not found' });
        }

        res.status(200).json({ status: 'OK', cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const product = await productManager.getProductById(Number(pid));
        if (!product) {
            return res.status(404).json({ status: 'Not Found', msg: 'Product not found' });
        }

        const cart = await cartManager.addProductToCart(Number(cid), Number(pid));
        if (!cart) {
            return res.status(404).json({ status: 'Not Found', msg: 'Cart not found' });
        }

        res.status(201).json({ status: 'Created', cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

export default router;