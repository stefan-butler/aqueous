import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt'
import validator from 'validator'


//login user
const loginUser =async (req: Request , res: Response) => {
  res.send({message: 'login user'}) //just to test connection
}

//signup user 
const signupUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const {password} = req.body;

    if (!validator.isEmail(user.email)) {
      throw Error('Email is not valid')
    }

    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough')
    }

    //need to fix the typescript bug
    // const existingUser = await User.findOne({email : user.email})
    // if (existingUser) {
    //   return res.status(400).json({ error: "A user already exists with this email" });
    // }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({firstName: user.firstName, lastName: user.lastName, email: user.email, password: hash, responder: user.responder, responderType: user.responderType})
    res.status(200).json(newUser)
  } catch (error) {
    console.error('Error signingup a new user:', error);
    res.status(500).json({message: 'Internal server issue: ${error}'})
  }
}

export {loginUser, signupUser}