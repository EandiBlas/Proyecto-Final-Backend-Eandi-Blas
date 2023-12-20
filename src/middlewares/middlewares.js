import UsersManager from "../persistencia/dao/managers/userManagerMongo.js";
import { usersModel } from "../persistencia/dao/models/users.model.js";
import { productsModel } from "../persistencia/dao/models/products.model.js";

const um = new UsersManager();

    export const publicAcces = (req,res,next) =>{
        if(req.session.username) return res.redirect('/current');
        next();
    }

    export const privateAcces = (req,res,next)=>{
        if(!req.session.username) return res.redirect('/login');
        next();
    }

    export const userAccess = async (req, res, next) => {

        if (!req.session.username) return res.redirect('/login');


        const user = await um.findUser(req.session.username);


        if (user.role !== 'user') return res.status(403).send('Forbidden');

        next();
    };

    export const premiumOrAdminAccess = async (req, res, next) => {
        
        if (!req.session.username) return res.redirect('/login');

        const user = await um.findUser(req.session.username);
    
        if (user.role !== 'admin' && user.role !== 'premium') return res.status(403).send('Acceso no autorizado');
    
        next();
    };

    export const adminAccess = async (req, res, next) => {
        
        if (!req.session.username) return res.redirect('/login');

        const user = await um.findUser(req.session.username);
    
        if (user.role !== 'admin') return res.status(403).send('Acceso no autorizado');
    
        next();
    }


    export const adminOrPremiumDeleteAccess = async (req, res, next) => {
        try {

            if (!req.session.username) return res.redirect('/login');
            
            const currentUsername = req.session.username;
            const productId = req.params.pid;

            const currentUser = await usersModel.findOne({ username: currentUsername });
            const product = await productsModel.findOne({ _id: productId });

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            if (currentUser.role === 'admin' || (currentUser.role === 'premium' && currentUser.email === product.owner)) {
                next();
            } else {
                return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error en la verificación de permisos' });
        }
    };
    
    