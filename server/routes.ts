import express, {Request, Response} from 'express'
import {loginUser, signupUser} from './controllers/userController';
import requireAuth from './middleware/requireAuth';

const router = express.Router();

//use the requireAuth for the API routes you wish to protect ('path', requireAuth, controllerFuntion)


//login route 
router.post('/auth/login', loginUser)

//signup route 
router.post('/auth/signup', signupUser)

export default router;