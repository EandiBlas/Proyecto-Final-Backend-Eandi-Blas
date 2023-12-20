import mongoose from 'mongoose';

const messageCollection = 'messages';

const schema = new mongoose.Schema({
    user: String,
    message: String
},
{timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});


const messageModel = mongoose.model(messageCollection,schema);

export default messageModel;