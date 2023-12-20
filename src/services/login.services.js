import UsersManager from "../persistencia/dao/managers/userManagerMongo.js";
import { hashData, compareData, generateResetToken } from "../utils.js";
import { sendPasswordResetEmail } from "../nodemailer.js";
import UserReformed from "../persistencia/dto/reformeduser.dto.js";

class LoginService {

    constructor() {
        this.login = new UsersManager();
    }

    createUser = async (userData) => {
        const { first_name, last_name, username, email, age, password } = userData;

        if (!first_name || !last_name || !username || !email || !age || !password) {
            throw new Error("Faltan datos");
        }

        const userDB = await this.login.findUser(username);

        if (userDB) {
            throw new Error("El usuario ya esta registrado");
        }

        const hashPassword = await hashData(password);

        userData.last_connection = new Date();

        const newUser = await this.login.createUser({ ...userData, password: hashPassword });
        
        const userWithChanges = new UserReformed(newUser);

        return userWithChanges;
    }

    loginUser = async (userData) => {
        const { username, password } = userData;
        if (!username || !password) {
            throw new Error("Faltan datos");
        }
        const userDB = await this.login.findUser(username);
        if (!userDB) {
            throw new Error('Registrate primero');
        }
        const passwordIncorrect = await compareData(password, userDB.password);
        if (!passwordIncorrect) {
            throw new Error('El usuario o la contraseña no son correctas');
        }

        userDB.last_connection = new Date();
        await userDB.save();

        return userDB;
    }

    startPasswordReset = async (email) => {
        const userDB = await this.login.findUserEmail(email);
        if (!userDB) {
            throw new Error('No se encontró un usuario con ese correo electrónico');
        }
        const resetToken = generateResetToken();
        const resetTokenExpiration = new Date(Date.now() + 3600000);
        await this.login.updateUserResetToken(userDB._id, resetToken, resetTokenExpiration);
        await sendPasswordResetEmail(userDB.email, resetToken);
    }

    resetPassword = async (token, newPassword) => {
        const userDB = await this.login.findUserByResetToken(token);
        if (!userDB) {
            throw new Error('Token de recuperación inválido o expirado');
        }

        const isSamePassword = await compareData(newPassword, userDB.password);

        if (isSamePassword) {
            throw new Error('La nueva contraseña no puede ser igual a la contraseña actual');
        }
        const hashPassword = await hashData(newPassword);
        await this.login.updateUserPassword(userDB._id, hashPassword);
        await this.login.clearUserResetToken(userDB._id);
    }

    updateUserResetToken = async (userId, resetToken, resetTokenExpiration) => {
        const updatedUser = await this.login.updateUserResetToken(userId, resetToken, resetTokenExpiration);
        if (!updatedUser) {
            throw new Error('Error al actualizar el token de reinicio.');
        }
        return updatedUser;
    }

    findUserByResetToken = async (resetToken) => {
        const user = await this.login.findUserByResetToken(resetToken);
        if (!user) {
            throw new Error('Token de recuperación inválido o expirado');
        }
        return user;
    }

    updateUserPassword = async (userId, newPassword) => {
        const updatedUser = await this.login.updateUserPassword(userId, newPassword);
        if (!updatedUser) {
            throw new Error('Error al actualizar la contraseña del usuario.');
        }
        return updatedUser;
    }

    clearUserResetToken = async (userId) => {
        const updatedUser = await this.login.clearUserResetToken(userId);
        if (!updatedUser) {
            throw new Error('Error al limpiar el token de reinicio del usuario.');
        }
        return updatedUser;
    }

    changeUserRole = async (username) => {
        try {
            const user = await this.login.findUser(username);


            user.role = user.role === 'user' ? 'premium' : 'user';


            const updatedUser = await this.login.updateUserRoleByUsername(username, user.role);

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    adminChangeRoles = async (username) => {
        try {
            const user = await this.login.findUser(username);

            user.role = user.role === 'user' ? 'premium' : 'user';

            const updatedUser = await this.login.updateUserRoleByUsername(username, user.role);

            return updatedUser;
            
        } catch (error) {
            throw error;
        }
    };

}

export default LoginService