import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'products',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  purchaser:{
    type: String
  }
});
cartSchema.pre('find', function (next) {
  this.populate('products.product');
  next();
});

export const cartModel = mongoose.model(cartCollection, cartSchema);