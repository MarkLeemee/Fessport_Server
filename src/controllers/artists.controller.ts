import { NextFunction, Request, Response } from 'express';
import ArtistService from '../services/artists.service';
import { User } from '../interfaces/users.interface';
import { Artist } from '../interfaces/artists.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class ArtistsController {
  public artistService = new ArtistService();

  public getArtistBySearchId = async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;

    try {
      const findArtistBySearchId: Artist = await this.artistService.findOneArtistBySearchId(search);
      res.status(200).json(findArtistBySearchId);
    } catch (error) {
      next(error);
    }
  };

  public getArtists = async (req: Request, res: Response, next: NextFunction) => {
    const { offset, limit } = req.query;

    try {
      const findAllArtistsData: Artist[] = await this.artistService.findAllArtist(offset, limit);
      res.status(200).json(findAllArtistsData);
    } catch (error) {
      next(error);
    }
  };

  public getArtistByGenreId = async (req: Request, res: Response, next: NextFunction) => {
    const { genreId, offset, limit } = req.query;

    try {
      const findArtistsData: Artist[] = await this.artistService.findAritstByGenreId(genreId, offset, limit);
      res.status(200).json(findArtistsData);
    } catch (error) {
      next(error);
    }
  };

  public getArtistDetailById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const artistId: string = req.params.id;
    const userData: User = req.user;

    try {
      const findOneArtistDetailData: Artist = await this.artistService.createArtistDetailData(artistId, userData);
      res.status(200).json(findOneArtistDetailData);
    } catch (error) {
      next(error);
    }
  };
}

export default ArtistsController;
