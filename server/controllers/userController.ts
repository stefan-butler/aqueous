import { Request, Response } from 'express';
import User from '../models/user';


//login user
const loginUser =async (req: Request , res: Response) => {
  res.send({message: 'login user'}) //just to test connection
}

//signup user 
const signupUser = async (req: Request, res: Response) => {
  res.send({message: 'signup user'}) // just to test connection
}

export {loginUser, signupUser}