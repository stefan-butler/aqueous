declare namespace Express {
  export interface Request {
     user?: {_id: string}
  }
}

// import { Request } from 'express';

// // Declare a module augmentation for the express module
// declare global {
//   namespace Express {
//     export interface Request {
//       user?: { _id: string };
//     }
//   }
// }
