import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'



const createToken = (id:string) => {
  return jwt.sign({_id:id}, "ghfgfhdfjfgfhfbsbkidsfrehrthrt", {expiresIn: '2d'})
}

//login user
const loginUser =async (req: Request , res: Response) => {
  try {
    const {email, password} = req.body;

    const validUser = await User.findOne({email});

    if (!validUser) {
    res.status(404).json({ error: "User not found" });
    return;
    }

    const validPass = await bcrypt.compare(password, validUser.password);

    if (!validPass) {
      res.status(400).json({ message: "Invalid credentials"});
      return;
    }

    //create token 
    const token = createToken(validUser._id);

    res.status(200).json({message: 'Login Successful', validUser, token})
    console.log(res)
  } catch (error) {
    console.error('Error login user:', error);
    res.status(500).json({message: `Internal server issue ${error}`})
  }
}

//signup user 
const signupUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const {password} = req.body;

    if (!validator.isEmail(user.email)) {
      res.status(400).json({ error: 'Email is not valid' });
      return;
    }

    // default rules{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    if (!validator.isStrongPassword(password)) {
       res.status(400).json({ error: 'Password not strong enough' });
       return;
    }

    const existingUser = await User.findOne({email : user.email})
    if (existingUser) {
       res.status(400).json({ error: "A user already exists with this email" });
       return;
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({firstName: user.firstName, lastName: user.lastName, email: user.email, password: hash, responder: user.responder, responderType: user.responderType})

    //create a token
    const token = createToken(newUser._id);

    res.status(200).json({message: 'New user signedup', newUser, token})
  } catch (error) {
    console.error('Error signingup a new user:', error);
    res.status(500).json({message: `Internal server issue: ${error}`})
  }
}

export {loginUser, signupUser}