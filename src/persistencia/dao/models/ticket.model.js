import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => {
            return Math.random().toString(36).substring(7);
        },
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});
export const ticketModel = mongoose.model('Ticket', ticketSchema);

