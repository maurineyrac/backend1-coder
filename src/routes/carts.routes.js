import { Router } from 'express';
import cartDao from '../dao/mongoDB/cart.dao.js';
import { checkIDs } from '../middleware/checkmongoID.midware.js';
import { checkProductInCart } from '../middleware/checkProductInCart.midware.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const carts = await cartDao.getAll(limit);

        res.status(200).json({ status: 'OK', carts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }

});

router.post('/', async (req, res) => {
    try {

        const newCart = await cartDao.create();

        res.status(201).json({ status: 'Created', msg: 'Cart created', newCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.get('/:cid', checkIDs, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getById((cid));

        if (!cart) {
            return res.status(404).json({ status: 'Not Found', msg: 'Cart not found' });
        }

        res.status(200).json({ status: 'OK',  cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.post('/:cid/products/:pid', checkIDs, async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartDao.addProductToCart((cid), (pid));

        res.status(201).json({ status: 'OK', msg: 'Product added to cart', cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.delete('/:cid/products/:pid', checkIDs, checkProductInCart, async (req, res) => {
    try {
        const { cid, pid } = req.params; 

        const cart = await cartDao.deleteProductFromCart((cid), (pid));
        
        res.status(200).json({ status: 'Deleted', msg: 'Product deleted from cart', cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.put('/:cid/products/:pid', checkIDs, checkProductInCart, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(400).json({ status: 'Error', msg: 'Quantity is required' });
        }
        
        const cart = await cartDao.updateQuantity((cid), (pid), Number(quantity));

        res.status(200).json({ status: 'Updated', msg: 'Product updated from cart', cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.delete('/:cid/deleteCart', checkIDs, async (req, res) => {
    try {
        const { cid } = req.params;
        const deletedCart = await cartDao.deleteOne(cid);
        if (!deletedCart) {
            return res.status(404).json({ status: 'Not Found', msg: 'Cart not found' });
        }

        res.status(200).json({ status: 'Deleted', deletedCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

router.delete('/:cid', checkIDs, async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartDao.deleteAllProductsFromCart(cid);

        res.status(200).json({ status: 'Deleted', msg: 'All products deleted from cart', updatedCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
});

export default router;