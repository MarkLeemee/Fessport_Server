import { Router, NextFunction, Request, Response } from 'express';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import ArtistsController from '../controllers/artists.controller';

class ArtistsRoute implements Route {
  public path = '/artist';
  public router = Router();
  public artistsController = new ArtistsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/list`, (req: Request, res: Response, next: NextFunction) => {
      if (req.query.search) this.artistsController.getArtistBySearchId(req, res, next);
      else if (req.query.genreId) this.artistsController.getArtistByGenreId(req, res, next);
      else this.artistsController.getArtists(req, res, next);
    });
    this.router.get(`${this.path}/detail/:id`, authMiddleware, this.artistsController.getArtistDetailById);
  }
}

export default ArtistsRoute;
