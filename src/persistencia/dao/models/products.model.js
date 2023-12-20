import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
import { usersModel } from "./users.model.js";

const productCollection = 'products';
const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    code: {
        type: String,
        unique: true,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
        default: true
    },

    owner: {
        type: String,
        default: 'admin',
        required: true,
        validate: {
            validator: async function (value) {
                if (value === 'admin' || value === 'premium') {
                    return true;
                }
                const user = await usersModel.findOne({ email: value });
                if (user && (user.role === 'admin' || user.role === 'premium')) {
                    return true;
                }
                return false;
            },
            message: 'El campo "owner" debe premium o "admin"'
        }
    }

})
productSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productCollection, productSchema)