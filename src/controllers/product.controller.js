import ProductService from "../services/product.services.js";
import CustomError from "../errors/CustomError.js";
import { errorMessages } from "../errors/error.enum.js";
import { usersModel } from "../persistencia/dao/models/users.model.js";
import { sendMailDeleteProduct } from '../nodemailer.js';
import logger from "../winston.js";

class ProductController {
    constructor() {
        this.service = new ProductService();
    }


    addProduct = async (req, res) => {
        try {

            if (!req.session.username) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const getUserEmail = async (username) => {
                const user = await usersModel.findOne({ username });
                return user ? user.email : null;
            };

            const userEmail = await getUserEmail(req.session.username);
            if (!userEmail) {
                return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
            }

            req.body.owner = userEmail;
            
            const result = await this.service.addProduct(req.body);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            res.status(201).json({ message: "Producto creado", result });

        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    };


    getProduct = async (req, res) => {
        try {
            const product = await this.service.getProduct(req.params.pid);
            res.status(200).json({ message: "Producto obtenido con exito", product });
        } catch (error) {
            const customError = CustomError.createError(errorMessages.PRODUCT_NOT_FOUND);
            logger.error('Error el producto buscado no existe //loggerTest//');
            return res.status(404).json({ error: customError.message });
        }
    }


    getAllProducts = async (req, res) => {
        try {
            const params = {
                query: req.query,
                category: req.query.category
            };

            const products = await this.service.getProducts(params);

            let prevLink;
            let nextLink;

            if (req.originalUrl.includes('page')) {
                prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
            } else if (!req.originalUrl.includes('?')) {
                prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
            } else {
                prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
            }

            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products

            return res.status(200).send({ status: 'Lista de productos obtenida', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
        } catch (error) {
            const customError = CustomError.createError(errorMessages.GET_PRODUCTS_ERROR);
            logger.error('Error al traer todos los productos //loggerTest//');
            return res.status(404).json({ error: customError.message });
        }
    }


    updateProduct = async (req, res) => {
        try {

            const updateProduct = await this.service.updateProduct(req.params.pid, req.body);

            if (!updateProduct) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            res.status(200).json({ message: "Producto actualizado", updatedProduct: updateProduct });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el producto" });
        }
    };


    deleteProduct = async (req, res) => {
        try {
            const product = await this.service.getProduct(req.params.pid);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            const deleteProduct = await this.service.deleteProduct(req.params.pid);

            if (product.owner !== 'admin'){
                const userEmail = product.owner;
                const user = await usersModel.findOne({ email: userEmail });
                if (user && user.role === 'premium') {
                    const sendDeletedProduct = await sendMailDeleteProduct(userEmail);
                }
            }

            return res.status(200).json({ message: "Producto Eliminado", deleteProduct })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al eliminar el producto" });
        }
    }





}

export default ProductController