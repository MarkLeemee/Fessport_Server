import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto, KakaoUserDto } from '../dtos/users.dto';
import AuthService from '../services/auth.service';
import { User } from '../interfaces/users.interface';
import { RequestWithUser } from '../interfaces/auth.interface';
import qs from 'qs';
import axios from 'axios';
import userModel from '../models/users.model';

const kakao = {
  clientID: process.env.KAKAO_CLIENTID,
  clientSecret: process.env.KAKAO_CLIENTSECRET,
  redirectUri: 'https://fessport-server.com/auth/kakao/callback',
};

class AuthController {
  public authService = new AuthService();
  public users = userModel;

  public imageUpload = async (req, res: Response, next: NextFunction) => {
    const { location } = req.file;

    try {
      res.status(200).json({ image: location });
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const signUpUserData: User | void = await this.authService.signup(userData);
      res.status(201).json(signUpUserData);
    } catch (error) {
      next(error);
    }
  };

  public kakaoSignup = async (req: Request, res: Response, next: NextFunction) => {
    const userData: KakaoUserDto = req.body;

    try {
      await this.authService.kakaoSignUp(userData);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: LoginUserDto = req.body;

    try {
      const { cookie, findUser } = await this.authService.login(userData); // services의 login 함수를 통해 cookie와 user 정보를 받아온다.
      //res.cookie('Authorization', cookie).sendStatus(200);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  };

  public kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
    const userData: KakaoUserDto = req.body;
    const { kakaoCookie } = req.body;

    try {
      const { cookie } = await this.authService.kakaoLogin(userData); // services의 login 함수를 통해 cookie와 user 정보를 받아온다.
      res.cookie('Set-Cookie', cookie).cookie('Kakao_Token', kakaoCookie).redirect('http://localhost:3000');
    } catch (error) {
      next(error);
    }
  };

  /**
   * @summary 카카오 인증 진행하기
   *
   * @description
   * - '로그인' 클릭 시 '사용자 서비스 동의' 페이지로 리다이렉트 합니다.
   * - redirectUri 는 인증 성공시, 카카오 개발자 콘솔에 기입한 이동할 주소입니다.
   */
  // http://localhost:8000/auth/kakao
  public kakaoAuth = async (req: Request, res: Response, next: NextFunction) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
    try {
      res.redirect(kakaoAuthUrl);
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @summary '사용자 서비스 동의' 완료 후, 이동되는 주소.
   *
   * @description
   * - 사용자로부터 동의를 구한 후, 서비스 내에서 처리할 로직을 구현합니다.
   */
  // http://localhost:8000/auth/kakao/callback
  public kakaoLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;

    let tokenResponse;
    try {
      tokenResponse = await axios({
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          grant_type: 'authorization_code',
          client_id: kakao.clientID,
          client_secret: kakao.clientSecret,
          redirect_uri: kakao.redirectUri,
          code,
        }),
      });
    } catch (error) {
      next(error);
    }
    const { access_token, expires_in } = tokenResponse.data;

    let userResponse;
    try {
      userResponse = await axios({
        method: 'GET',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (error) {
      next(error);
    }
    const { email } = userResponse.data.kakao_account;
    const { nickname } = userResponse.data.properties;
    const kakaoCookie = this.authService.createCookie({ token: access_token, expiresIn: expires_in });

    const findUser: User = await this.users.findOne({ email: email });
    req.body = { email, nickname, kakaoCookie };
    if (!findUser) {
      await this.kakaoSignup(req, res, next);
    }
    await this.kakaoLogin(req, res, next);
  };

  public kakaoUnlinkAndLogout = async (req: Request, res: Response, next: NextFunction) => {
    const kakao_token: string = req.cookies.Kakao_Token;
    const index = kakao_token.indexOf(';');
    const access_token = kakao_token.slice(14, index);

    try {
      await axios({
        method: 'POST',
        url: 'https://kapi.kakao.com/v1/user/unlink',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    } catch (error) {
      next(error);
    }
    res.clearCookie('Kakao_Token').clearCookie('Set-Cookie').status(200).end();
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.cookies.Kakao_Token) {
      this.kakaoUnlinkAndLogout(req, res, next);
      return;
    }
    const userData: User = req.user;

    try {
      const logOutUserData: User = await this.authService.logout(userData);
      //res.clearCookie('Authorization').sendStatus(200);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json(logOutUserData);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
