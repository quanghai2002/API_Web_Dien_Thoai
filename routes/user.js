import express from 'express';
import { body, validationResult } from 'express-validator';

import { userController } from '../controllers/index.js'
import checkToken, { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();


// get all users
router.get('/', userController.getAllUser);

// delete users => admin Authorization
router.delete('/delete/:id', verifyTokenAndAdmin, userController.deleteUser);

// login user
router.post('/login',
    body('email')
        .isEmail(),

    body('password').isLength({ min: 5 }),
    userController.login

)

// LOGIN- Google
router.post('/logingoogle', userController.loginGoogle);


// user register
router.post('/register', userController.register);


// forget password
router.post('/forget_password', userController.forget_password);

// reset password
router.get('/reset_password', userController.reset_password);

// refresh Token => khi access Token => hết hạn
router.post('/refreshToken', userController.refreshToken)



// log out

router.post('/logout', checkToken, userController.logout)

// ...
export default router;