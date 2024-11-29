import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/user';

export interface ExtendedRequest extends Request {
  user?: { _id: string };
}

interface JwtPayloadWithId {
  _id: string;
}

const requireAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) : Promise<void> => {
  // console.log('request headers: ', req.headers)
  //verify authentication 
  const {authorization} = req.headers
  // console.log('authorisation:  ', authorization)
  if (!authorization) {
     res.status(401).json({message: 'Authorization token required'})
     return;
  }

  // authorization has the following form 'Bearer kajgsfkhag.fakgfakfgakjfgakfg.hjahja' and we need only the decrypted part
  const token = authorization.split(' ')[1]
  // console.log('toke!!', token)
  try {
    //try to verify the token 
    const {_id} = jwt.verify(token, "ghfgfhdfjfgfhfbsbkidsfrehrthrt"!) as JwtPayloadWithId;
    // console.log('id!!!!', _id)
    //then we find the user and pass its _id at the request object as a user property(you can use another name if you wish)
    const user = await User.findById(_id).select('_id') 
  
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    // console.log('tes!!!!', user._id)
    req.user = { _id: user._id.toString() };
    // console.log(req.user._id)
    next() // the next function will have access to the req.user
  } catch (error) {
    console.log(error)
    res.status(401).json({message: 'Request in not authorized'})
  }
} 

export default requireAuth