import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    resetToken: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'premium']
    },
    fromGithub: {
        type: Boolean,
        default: false
    },
    cart: {
        _id: {
            type: mongoose.Types.ObjectId,
            ref: 'carts',
            default: null
        }
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                },
                reference: {
                    type: String,
                },
            },
        ],
        default: [],
    },
    status: {
        type: String,
        default: 'Activo',
    },
    last_connection: {
        type: Date,
        default: null,
    },
});
usersSchema.pre('update', function (next) {
    this.update({}, { $set: { last_connection: new Date() } });
    next();
});

usersSchema.methods.updateLastConnectionOnLogout = function () {
    this.last_connection = new Date();
    return this.save();
};

usersSchema.pre('find', function (next) {
    this.populate('cart._id');
    next();
});

export const usersModel = mongoose.model('Users', usersSchema)