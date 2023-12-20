import { ticketModel } from "../persistencia/dao/models/ticket.model.js";
import CartManager from "../persistencia/dao/managers/cartManagerMongo.js";
import ProductManager from "../persistencia/dao/managers/productManagerMongo.js";
import UsersManager from "../persistencia/dao/managers/userManagerMongo.js";
import CustomError from "../errors/CustomError.js";
import { errorMessages } from "../errors/error.enum.js";

class CartService {

  constructor() {
    this.cart = new CartManager();
    this.product = new ProductManager();
    this.user = new UsersManager();
  }

  addProductToCart = async (cid, pid, quantity) => {
    try {
      const cart = await this.cart.getCartById(cid);
      if (!cart) {
        throw new Error(`Cart with ID: ${cid} not found`);
      }
      const productIndex = cart.products.findIndex((p) => {
        return p.product._id.toString() == pid;
      });
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }

      await this.cart.updateProductsInCart(cid, cart.products);

      return await this.cart.getCartById(cid);
    } catch (error) {
      throw error;
    }
  };

  createCart = async (products, vemail) => {
    let cartData = {};
    const validProducts = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const checkId = await this.product.getProductById(product.product._id);
      if (checkId === null) {
        throw new Error(`Product with ID ${product._id} does not exist`);

      }
      validProducts.push(product);
    }
    cartData.purchaser = vemail;
    cartData.products = validProducts;
    let carrito = await this.cart.addCart(cartData)
    return carrito
  };

  getCart = async (id) => {
    const cart = await this.cart.getCartById(id);
    if (!cart) {
      const errorMessage = errorMessages.CART_NOT_FOUND;
      throw CustomError.createError(errorMessage);
    }
    return cart;
  }

  getCarts = async () => {
    const carts = await this.cart.getCarts();
    return carts;
  };

  updateProductQuantityInCart = async (cid, pid, quantity) => {
    const cart = await this.cart.getCartById(cid);
    const products = cart.products;
    const checkId = await this.product.getProductById(pid);
    if (checkId === null) {
      throw new Error(`Product with ID ${pid} does not exist`);
    }
    const productIndex = products.findIndex(product => product.product._id == pid);
    if (productIndex !== -1) {
      products[productIndex].quantity += quantity;
    } else {
      products.push({ _id: pid, quantity });
    }
    const updatedCart = await this.cart.updateProductsInCart(cid, products);

    return updatedCart;
  };


  updateProductList = async (cid, pid, quantity) => {
    try {
      const cart = await this.cart.getCartById(cid);

      const productIndex = cart.products.findIndex((product) => product.product._id == pid);

      if (productIndex > -1) {
        if (quantity > 0) {
          cart.products[productIndex].quantity = quantity;
        } else {
          cart.products.splice(productIndex, 1);
        }
      } else if (quantity > 0) {
        cart.products.push({ _id: pid, quantity });
      }

      return await cart
    } catch (error) {
      throw error;
    }
  };


  deleteProductInCart = async (cid, pid) => {
    try {
      const cart = await this.cart.getCartById(cid);
      const productIndex = cart.products.findIndex((product) => product.product._id.toString() == pid);
      if (productIndex === -1) {
        throw new Error(`Product with ID: ${pid} not found in cart`);
      }

      cart.products.splice(productIndex, 1);
      await this.cart.updateCart(cid, cart.products);
      return await this.cart.getCartById(cid);
    } catch (error) {
      throw error;
    }
  }



  emptyCart = async (cid) => {
    try {
      const cart = await this.cart.getCartById(cid);
      if (!cart) {
        throw new Error(`Cart with ID: ${cid} not found`);
      }

      if (cart.products.length === 0) {
        throw new Error('The cart is already empty');
      }

      cart.products = [];
      return await this.cart.updateCart(cid, cart.products);
    } catch (error) {
      throw error;
    }
  }



  finalizeCartPurchase = async (cid) => {

    try {
      const cart = await this.cart.getCartById(cid);
      const user = await this.user.findUserEmail(cart.purchaser);
      if (!user) {
        throw new Error('Usuario asociado al carrito no encontrado');
      }
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productsToUpdate = [];
      const productsToDelete = [];

      const productsToBuy = []

      for (const product of cart.products) {

        const productData = await this.product.getProductById(product.product._id);

        let quantityProduct = true;

        let productExist = true;

        if (!productData) {
          productExist = false;
        }

        if (product.quantity >= productData.stock) {
          quantityProduct = false;
        }

        if (productExist & quantityProduct) {
          productData.stock -= product.quantity;
          productsToUpdate.push(productData);
          productsToDelete.push(product);
          productsToBuy.push(product)
        }

      }

      for (const productData of productsToUpdate) {
        await this.product.updateProduct(productData._id, productData);
      }

      const calculateTotalAmount = (products) => {
        let totalAmount = 0;
        for (const product of products) {
          totalAmount += product.product.price * product.quantity;
        }
        return totalAmount;
      }
      const result = calculateTotalAmount(productsToBuy);

      const ticket = new ticketModel({
        purchase_datetime: new Date(),
        amount: result,
        purchaser: cart.purchaser,
      });

      await ticket.save();

      cart.products = cart.products.filter((product) => !productsToDelete.includes(product));

      await this.cart.updateCart(cid, cart.products);

      return { ticket: ticket };
    } catch (error) {
      throw error;
    }
  };


}

export default CartService