import { request, response } from 'express';

import { cartModel } from '../dao/mongoDB/models/cart.model.js';

export const checkProductInCart = async (req = request, res = response, next) => {
  // Verificación de la existencia del carrito y del producto dentro del carrito
  try {
    const { pid, cid } = req.params;
    if (pid) {
      const cart = await cartModel.findById(cid)
      const productInCart = cart.products.some((product) => product.productID.toString() === pid);
      if (!productInCart) {
        return res.status(404).json({ status: 'Not Found', msg: 'Product not found in cart' });
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
  }
};