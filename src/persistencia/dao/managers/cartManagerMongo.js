import { cartModel } from "../models/carts.model.js"

class CartManager {

    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };


    
    getCartById = async (cartId) => {
        try {
            if (!cartId) {
                throw new Error('El ID del carrito es undefined o no está definido correctamente.');
            }

            const cart = await cartModel.findById(cartId).populate('products.product');
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return err;
        }
    };

    addCart = async (cartData) => {
        try {
            const cart = await cartModel.create(cartData);
            return cart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            throw err; 
        }
    };

    deleteProductInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }

    }

    updateCart = async (cid, products) => {
        return await cartModel.updateOne(
            { _id: cid },
            { products })
    }

    updateProductsInCart = async (cid, products) => {
        return await cartModel.updateOne(
            { _id: cid },
            { products }
        );

    }
    
};

export default CartManager;