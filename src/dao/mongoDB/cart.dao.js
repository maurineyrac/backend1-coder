import e from "express";
import { cartModel } from "./models/cart.model.js";

const getAll = async () => {
  const carts = await cartModel.find();
  return carts;
};

const getById = async (cid) => {

  const cart = await cartModel.findById(cid).populate('products.productID');
  return cart;
};

const create = async (data) => {
  const cart = await cartModel.create(data);
  return cart;
};

const deleteOne = async (cid) => {
  const cart = await cartModel.deleteOne({ _id: cid });
  return cart;
};

const addProductToCart = async (cid, pid) => {
  let isInCart = await cartModel.findOneAndUpdate({ _id: cid, "products.productID": pid }, { $inc: { "products.$.quantity": 1 } }, { new: true });
  if (!isInCart) {
    isInCart = await cartModel.findByIdAndUpdate(cid, { $push: { products: { productID: pid, quantity: 1 } } }, { new: true });
  }
  return isInCart;
}

const deleteProductFromCart = async (cid, pid) => {
  const updatedCart = await cartModel.findByIdAndUpdate(cid, { $pull: { products: { productID: pid } } }, { new: true });
  return updatedCart;
}

const updateQuantity = async (cid, pid, quantity) => {
  const updatedCart = await cartModel.findOneAndUpdate({ _id: cid, "products.productID": pid }, { $set: { "products.$.quantity": quantity } }, { new: true });
  return updatedCart;
}

const deleteAllProductsFromCart = async (cid) => {
  const updatedCart = await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
  return updatedCart;
}

export default {
  getAll,
  getById,
  create,
  deleteOne,
  addProductToCart,
  deleteProductFromCart,
  updateQuantity,
  deleteAllProductsFromCart
};