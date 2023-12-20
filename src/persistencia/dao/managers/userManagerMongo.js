import { usersModel } from '../models/users.model.js';

export default class UsersManager {

    async createUser(user) {
        try {
            const newUser = await usersModel.create(user);
            return newUser
        } catch (error) {
            return error
        }

    }

    async findUser(username) {
        try {
            const user = await usersModel.findOne({ username })
            return user
        } catch (error) {
            return error
        }
    }

    async findUserById(id) {
        try {
            const user = await usersModel.findById(id)
            return user
        } catch (error) {
            return error
        }
    }

    async findUserEmail(email) {
        try {
            const user = await usersModel.findOne({ email })
            return user
        } catch (error) {
            return error
        }
    }

    async updateUserResetToken(userId, resetToken, resetTokenExpiration) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, {
                resetToken,
                resetTokenExpiration,
            });
            return updatedUser;
        } catch (error) {
            return error;
        }
    }


    async findUserByResetToken(resetToken) {
        try {
            const user = await usersModel.findOne({ resetToken });
            return user;
        } catch (error) {
            return error;
        }
    }

    async updateUserPassword(userId, newPassword) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, {
                password: newPassword,
                resetToken: null,
                resetTokenExpiration: null,
            });
            return updatedUser;
        } catch (error) {
            return error;
        }
    }

    async clearUserResetToken(userId) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, {
                resetToken: null,
                resetTokenExpiration: null,
            });
            return updatedUser;
        } catch (error) {
            return error;
        }
    }


    async updateUserRoleByUsername(username, newRole) {
        try {
            const updatedUser = await usersModel.findOneAndUpdate(
                { username: username },
                { $set: { role: newRole } },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await usersModel.find();
            return users;
        } catch (error) {
            throw error;
        }
    }


    async deleteUsersInactive() {
        try {
            const users = await usersModel.deleteMany({
                last_connection: { $lte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
                $or: [
                    { role: 'user' },
                    { role: 'premium' }
                ]
            });
            return users;
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    async findInactiveUsers() {
        const inactiveUsers = await usersModel.find({
            last_connection: { $lte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            $or: [
                { role: 'user' },
                { role: 'premium' },
            ]
        })
        return inactiveUsers
    }

    async deleteUserById(id) {
        try {
            const user = await usersModel.findOneAndDelete(id);
            return user;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    async updatedUser(id){
        try {
            const user = await usersModel.findOneAndUpdate(id)
            return user;
        } catch (error) {
            throw error;
        }
    }
    

}