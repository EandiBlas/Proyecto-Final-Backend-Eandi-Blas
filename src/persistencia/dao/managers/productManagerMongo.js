import { productsModel } from "../models/products.model.js"

export default class ProductManager {

    categories = async () => {
        try {
            const categories = await productsModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ])

            return categories[0].categories

        }
        catch (err) {
            return err
        }

    }

    getProductsView = async () => {
        try {
            return await productsModel.find().lean();

        } catch (err) {
            return err
        }
    }



    getProducts = async (filter, options) => {
        try {
            return await productsModel.paginate(filter, options);
        } catch (err) {
            return err
        }
    }



    getProductById = async (id) => {
        try {
            return await productsModel.findById(id)
        } catch (error) {
            return error
        }

    }



    getProductByCode = async (code) => {
        try {
            return await productsModel.findOne({ code: code })
        } catch (err) {
            return { error: err.message }
        }

    }


    addProduct = async (product) => {
        try {
            return await productsModel.create(product);
        }
        catch (err) {
            return err
        }

    }



    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product })
        } catch (err) {
            return err
        }

    }



    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err
        }

    }



}