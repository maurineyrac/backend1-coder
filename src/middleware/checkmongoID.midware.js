import { request, response } from 'express';
import productDao from '../dao/mongoDB/product.dao.js';
import cartDao from '../dao/mongoDB/cart.dao.js';


/** Middleware para validar IDs de productos y carritos en MongoD 
 * Esto ayuda a identificar posibles errores de tipeo */

export const checkIDs = async (req = request, res = response, next) => {
  try {
    const { pid, cid } = req.params;

    // Validación de la longitud de los IDs
    if (pid && (typeof pid !== 'string' || pid.length !== 24)) {
      return res.status(400).json({ status: 'Error', msg: 'ID producto inválido' });
    }

    if (cid && (typeof cid !== 'string' || cid.length !== 24)) {
      return res.status(400).json({ status: 'Error', msg: 'ID cart inválido' });
    }

    // Verificación de la existencia del producto
    if (pid) {
      const product = await productDao.getById(pid);
      if (!product) {
        return res.status(404).json({ status: 'Not Found', msg: 'Product not found' });
      }
    }

    // Verificación de la existencia del carrito
    if (cid) {
      const cart = await cartDao.getById(cid);
      if (!cart) {
        return res.status(404).json({ status: 'Not Found', msg: 'Cart not found' });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'Error', msg: 'Error interno del servidor' });
  }
};
