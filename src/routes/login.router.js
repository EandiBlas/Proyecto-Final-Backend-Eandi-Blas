import { Router } from 'express';
import LoginController from '../controllers/login.controller.js';
import passport from 'passport';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})
  
const upload = multer({ storage: storage })

const router = Router()

const lc = new LoginController();

router.get('/'), async (req, res) => {
    res.redirect('/register');
}

router.get(
    "/githubSignup",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
    "/github",
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {

        req.session['username'] = req.user.username
        res.redirect('/current');
});

router.post('/register', lc.createUser)

router.post('/login', lc.loginUser)

router.get('/logout', lc.LogoutUser)

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.get('/reset-success', (req, res) => {
    res.render('reset-success');
});

router.post('/forgot-password', lc.startPasswordReset);

router.get('/reset-password/:token', lc.findUserByResetToken);

router.post('/reset-password/:token', lc.resetPassword);

router.post('/premium/:uid', lc.changeUserRole);

router.post('/changerole/:uid', lc.adminchangerole)


export default router