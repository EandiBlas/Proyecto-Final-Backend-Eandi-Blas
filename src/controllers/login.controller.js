import LoginService from "../services/login.services.js";
import UsersManager from "../persistencia/dao/managers/userManagerMongo.js";


class LoginController {
  constructor() {
    this.service = new LoginService();
    this.login = new UsersManager();
  }

  createUser = async (req, res) => {
    try {
      const newUser = await this.service.createUser(req.body);
      req.session['username'] = newUser.username;
      res.status(201).json({ message: "Usuario creado", user: newUser });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  loginUser = async (req, res) => {
    try {
      const userDB = await this.service.loginUser(req.body);
      req.session['username'] = userDB.username;
      res.status(200).json({ message: 'Session created', user: userDB });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  LogoutUser = async (req, res) => {
    try {

      const username = req.session.username;

      const user = await this.login.findUser(username);

      await user.updateLastConnectionOnLogout();

      req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "No pudo cerrar sesion" })
        res.redirect('/login');
      })

    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }



  startPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      await this.service.startPasswordReset(email);
      res.status(200).json({ message: 'Contraseña restablecida con exito, Verifique su email para seguir las instrucciones' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
      await this.service.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateUserResetToken = async (req, res) => {
    try {
      const { userId, resetToken, resetTokenExpiration } = req.body;
      const updatedUser = await this.service.updateUserResetToken(userId, resetToken, resetTokenExpiration);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  findUserByResetToken = async (req, res) => {
    try {
      const { token } = req.params;
      const user = await this.service.findUserByResetToken(token);
      res.render('reset-password', { user });
    } catch (error) {
      if (error.message === 'Token de recuperación inválido o expirado') {
        res.status(302).set('Location', '/api/auth/forgot-password').end();
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  updateUserPassword = async (req, res) => {
    try {
      const { userId, newPassword } = req.body;
      const updatedUser = await this.service.updateUserPassword(userId, newPassword);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  clearUserResetToken = async (req, res) => {
    try {
      const userId = req.body.userId;
      const updatedUser = await this.service.clearUserResetToken(userId);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  changeUserRole = async (req, res) => {
    const userId = req.params.uid;
    try {
      const user = await this.service.changeUserRole(userId);

      res.status(200).json({ message: 'Rol del usuario cambiado con éxito', user });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  adminchangerole = async (req, res) => {
    const userId = req.params.uid;
    try {
      const user = await this.service.adminChangeRoles(userId);
      res.status(200).json({ message: 'Rol del usuario cambiado con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

}

export default LoginController