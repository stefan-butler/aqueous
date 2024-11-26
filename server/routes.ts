import express, {Request, Response} from 'express'
import {loginUser, signupUser} from './controllers/userController';
import requireAuth from './middleware/requireAuth';
import { createIncident, getAllIncidents, getIncidentsCreatedByUser } from './controllers/incidentController';

const router = express.Router();

//use the requireAuth for the API routes you wish to protect ('path', requireAuth, controllerFuntion)

//login route 
router.post('/auth/login', loginUser)

//signup route 
router.post('/auth/signup', signupUser)


router.get('/get/incidents', getAllIncidents)
router.post('/create/incident', requireAuth, createIncident)
router.get('/get/incidents/:userId', requireAuth, getIncidentsCreatedByUser)

export default router;