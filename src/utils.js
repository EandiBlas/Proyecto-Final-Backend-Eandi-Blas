import { dirname } from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import multer from "multer"
export const __dirname = dirname(fileURLToPath(import.meta.url))

export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
}

export const compareData = async (data, hash) => {
    return bcrypt.compare(data, hash)
}

export const generateResetToken = () => {
    const tokenLength = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }

    return token;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.query.type == 'documents'){
            cb(null, __dirname + '/public/documents')
        }
        if(req.query.type == 'profile'){
            cb(null, __dirname + '/public/profile');
        }
        if(req.query.type == 'products'){
            cb(null, __dirname + '/public/products');
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const uploader = multer({ storage });
