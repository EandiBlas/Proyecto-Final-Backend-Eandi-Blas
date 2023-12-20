import CartService from "../services/cart.services.js";
import productService from "../services/product.services.js";
import usersManager from "../persistencia/dao/managers/userManagerMongo.js";
import CustomError from "../errors/CustomError.js";
import { errorMessages } from "../errors/error.enum.js";
import { sendMailWithPurchaser } from "../nodemailer.js";
import logger from "../winston.js"

class CartsController {
  constructor() {
    this.service = new CartService();
    this.userService = new usersManager();
    this.productService = new productService();
  }

  addProductToCart = async (req, res) => {

    const { cid } = req.params;
    const { pid, quantity } = req.body;

    try {

      const currentUsername = req.session.username;

      const currentUser = await this.userService.findUser(currentUsername);

      const product = await this.productService.getProduct(pid);

      
      if (currentUser.role === 'premium' && currentUser.email === product.owner) {

        return res.status(403).json({
          status: 'error',
          message: 'Premium users cannot add their own products to the cart.',
        });
        
      }
      if (!product) {
        return res.status(404).json((`Product with ID: ${pid} not found`))
      }
      
      const updatedCart = await this.service.addProductToCart(cid, pid, quantity);
      res.status(200).send({
        status: 'success',
        message: `The product with ID: ${pid} was added correctly`,
        cart: updatedCart,
      });
      

    } catch (error) {
      const customError = CustomError.createError(errorMessages.CART_NOT_FOUND);
      logger.error('Error al ingresar un producto al carrito //loggerTest//');
      return res.status(500).json({ error: customError.message });
    }
  }


  createCart = async (req, res) => {
    try {
      const fuser = await this.userService.findUser(req.session.username)
      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).send('Invalid request: products must be an array');
      }
      const cart = await this.service.createCart(products, fuser.email);
      res.status(200).json({ message: "Carrito creado", cart })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Necesitas loguearte para crear el carrito" });
    }
  };

  getCartById = async (req, res) => {
    try {
      const cart = await this.service.getCart(req.params.cid);
      res.status(200).json({ message: "Carrito obtenido con exito", cart })
    } catch (error) {
      const customError = CustomError.createError(errorMessages.CART_NOT_FOUND);
      logger.error('Ocurrio un error al traer el carrito //loggerTest//');
      return res.status(500).json({ error: customError.message });
    }
  }

  getAllCarts = async (req, res) => {
    try {
      const cart = await this.service.getCarts(req.body);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {

      const result = await this.service.updateProductQuantityInCart(cid, pid, quantity);
      return res.status(200).json({ message: "La cantidad del producto fue actualizada", result });
      

    } catch (error) {
      const customError = CustomError.createError(errorMessages.UPDATE_PRODUCT_QUANTITY);
      logger.error('Error al actualizar la cantidad del producto //loggerTest//');
      return res.status(404).json({ error: customError.message });
    }
  };

  updateProductList = async (req, res) => {
    const { cid } = req.params;
    const { pid, quantity } = req.body;
    try {
      const updatedCart = await this.service.updateProductList(cid, pid, quantity);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


  deleteProductInCart = async (req, res) => {

    const { cid, pid } = req.params;

    try {

      const updatedCart = await this.service.deleteProductInCart(cid, pid);

      if (!updatedCart) {
        res.status(404).send({ status: 'error', message: `Cart with ID: ${cid} not found` });
      } else if (!updatedCart.products) {
        res.status(404).send({ status: 'error', message: 'No products in the cart' });
      } else {
        res.status(200).send({ status: 'success', message: `Deleted product with ID: ${pid}`, cart: updatedCart });
      }
    } catch (error) {
      const customError = CustomError.createError(errorMessages.REMOVE_FROM_CART_ERROR);
      logger.error('Error al intentar eliminar un producto del carrito //loggerTest//');
      return res.status(404).json({ error: customError.message });
    }
  }


  emptyCart = async (req, res) => {
    const { cid } = req.params;

    try {
      const updatedCart = await this.service.emptyCart(cid);
      res.status(200).send({
        status: 'success',
        message: `The cart with ID: ${cid} was emptied correctly`,
        cart: updatedCart,
      });
    } catch (error) {
      const customError = CustomError.createError(errorMessages.EMPTY_CART);
      logger.error('Error al intentar vaciar el carrito //loggerTest//');
      return res.status(404).json({ error: customError.message });
    }
  }

  finalizeCartPurchase = async (req, res) => {
    const { cid } = req.params;
  
    try {
      const result = await this.service.finalizeCartPurchase(cid);
      const purchaserEmail = result.ticket.purchaser;
      sendMailWithPurchaser(purchaserEmail,result.ticket);
      res.status(201).json({ message: 'Compra finalizada con éxito', result });
  
    } catch (error) {
      console.error(error);
      if (error.message.includes('Usuario asociado al carrito no encontrado')) {
        res.status(404).json({ status: 'error', message: 'Usuario asociado al carrito no encontrado' });
      } else if (error.message.includes('Carrito no encontrado')) {
        res.status(404).json({ status: 'error', message: `Carrito con ID: ${cid} no encontrado` });
      } else {
        res.status(500).json({ message: 'Error al finalizar la compra' });
      }
    }
  };

}

export default CartsController