import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import userModel from '../models/users.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies; // request user의 cookie
    // cookie 인증
    if (cookies && cookies.Authorization) {
      const secret = process.env.JWT_SECRET;
      const verificationResponse = (await jwt.verify(cookies.Authorization, secret)) as DataStoredInToken;
      const userId = verificationResponse._id; // token 정보를 통해 userId 추출
      const findUser = await userModel.findById(userId); // userId로 user를 찾는다.

      if (findUser) {
        req.user = findUser; // req.user에 user 정보를 넣어준다.
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      if (req.url.includes('/festival/detail') || req.url.includes('/artist/detail')) next();
      else if (req.url.includes('/logout')) next();
      else next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
