import { Router } from 'express';
import UsersManager from '../persistencia/dao/managers/userManagerMongo.js';
import UserDTO from '../persistencia/dto/reformeduser.dto.js'
import { sendMailDeleteUser } from '../nodemailer.js';
import { uploader } from '../utils.js';

const userManager = new UsersManager();

const router = Router();

router.get('/', async (req, res) => {
    const users = await userManager.getAllUsers();
    const usersDTO = users.map(user => new UserDTO(user));
    res.status(200).json(usersDTO);
})

router.delete('/', async (req, res) => {
    const inactiveUsers = await userManager.findInactiveUsers()
    await userManager.deleteUsersInactive()
    for (const user of inactiveUsers) {
        await sendMailDeleteUser(user.email)
    }
    res.status(200).json('Usuarios Eliminados correctamente');
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await userManager.deleteUserById(id);
    res.status(200).json('Usuario Eliminado correctamente');
})

router.post('/:uid/documents', uploader.single('file'), async (req, res) => {
    const uid = req.params.uid;
    const file = req.file;
    console.log(req.file)
    console.log(req.file.originalname)
    const user = await userManager.findUser(uid);
    user.documents.push({ name: req.file.originalname, reference: req.file.path })
    user.status = 'actualizado'
    await userManager.updatedUser(user)
    res.json('OK')
})

export default router