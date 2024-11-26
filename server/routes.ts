import express, {Request, Response} from 'express'
import {loginUser, signupUser} from './controllers/userController';
import requireAuth from './middleware/requireAuth';

const router = express.Router();

//use the requireAuth function before you access the routes
router.use(requireAuth)

//login route 
router.post('/login', loginUser)

//signup route 
router.post('/signup', signupUser)

export default router;