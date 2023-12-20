import ProductManager from "../persistencia/dao/managers/productManagerMongo.js";
import { usersModel } from "../persistencia/dao/models/users.model.js";
import CustomError from "../errors/CustomError.js";
import { errorMessages } from "../errors/error.enum.js";
import { sendMailDeleteUser } from '../nodemailer.js';

class ProductService {

    constructor() {
        this.product = new ProductManager();
    }

    addProduct = async (product) => {
        try {

            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.category || !product.stock || !product.code) {
                const customError = CustomError.createError(errorMessages.MISSING_DATA);
                return { error: customError.message };
            }

            const verifyCode = await this.product.getProductByCode(product.code);
            if (verifyCode) {
                return { error: "El código del producto ya existe" };
            }

            if (product.owner !== 'admin') {
                const user = await usersModel.findOne({ email: product.owner });
                if (!user || (user.role !== 'admin' && user.role !== 'premium')) {
                    return { error: 'El campo "owner" debe ser un usuario premium o "admin"' };
                }
            }
            
            const addedProduct = await this.product.addProduct(product);
            return addedProduct;

        } catch (error) {
            return { error: error.message };
        }
    };


    getProduct = async (id) => {
        const product = await this.product.getProductById(id);
        const newProduct = { id: product._id, title: product.title, description: product.description, price: product.price, stock: product.stock, thumbnail: product.thumbnail, category: product.category, owner: product.owner }
        return newProduct;
    }


    getProducts = async (params) => {
        const options = {
            page: Number(params.query.page) || 1,
            limit: Number(params.query.limit) || 10,
            sort: {}
        };

        if (params.query.sort === 'desc' || params.query.sort === 'asc') {
            options.sort.price = params.query.sort === 'desc' ? -1 : 1;
        } else {
            delete options.sort;
        }

        const categories = await this.product.categories();
        const result = categories.some((categ) => categ === params.category);

        if (result) {
            return await this.product.getProducts({ category: params.category }, options);
        }

        return await this.product.getProducts({}, options);
    };

    updateProduct = async (pid, product) => {
        const updateProduct = await this.product.updateProduct(pid, product);
        return updateProduct;
    };

    deleteProduct = async (pid) => {
        const deleteProduct = await this.product.deleteProduct(pid);
    };

}

export default ProductService