import { Request, Response, NextFunction } from 'express';
import { UserUplink } from './../dao/user-uplink';
import { AppError } from '../model/errors';
import { Role } from '../model/user.model';

export function verifyRole(roles: Role[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const paramUserId = req.params.userId;
    const userId = req['userId'];

    if (!userId) next(new AppError(403, `No userId provided.`)); //Error
    try {
      const user = await (<UserUplink>req.app.locals.userRepo).findById(userId)
      if (!user) {
        next(new AppError(404, `User not found.`)); //Error
        return;
      }
      if (roles.some(role => user.roles.some(r => r === role))) { // if the interection between required and actual user roles is not empty
        delete user.password;
        // if everything good, save user to request for use in other routes
        req['user'] = user;
        next();
      } else {
        next({ status: 403, message: `Not enough privilegies for this operation.` }); //Error
      }
    } catch (err) {
      next(err);
    }
  }
}


