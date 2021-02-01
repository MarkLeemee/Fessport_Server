import { NextFunction, Request, Response } from 'express';
import festivalService from '../services/festivals.service';
import { User } from '../interfaces/users.interface';
import { Festival } from '../interfaces/festivals.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class FestivalsController {
  public festivalService = new festivalService();

  public getFestivalBySearchId = async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;

    try {
      const findFestivalBySearchId = await this.festivalService.findOneFestivalBySearchId(search);
      res.status(200).json(findFestivalBySearchId);
    } catch (error) {
      next(error);
    }
  };

  public getFestivalByCountryGenreID = async (req: Request, res: Response, next: NextFunction) => {
    const { countryId, genreId, offset, limit } = req.query;

    try {
      const findFestivalsData: Festival[] = await this.festivalService.findFestivalByCountryGenreId(
        genreId,
        countryId,
        offset,
        limit,
      );
      res.status(200).json(findFestivalsData);
    } catch (error) {
      next(error);
    }
  };

  public getFestivals = async (req: Request, res: Response, next: NextFunction) => {
    const { offset, limit } = req.query;

    try {
      const findAllFestivalsData: Festival[] = await this.festivalService.findAllFestival(offset, limit);
      res.status(200).json(findAllFestivalsData);
    } catch (error) {
      next(error);
    }
  };

  public getFestivalByCountryId = async (req: Request, res: Response, next: NextFunction) => {
    const { countryId, offset, limit } = req.query;

    try {
      const findFestivalsData: Festival[] = await this.festivalService.findFestivalByCountryId(
        countryId,
        offset,
        limit,
      );
      res.status(200).json(findFestivalsData);
    } catch (error) {
      next(error);
    }
  };

  public getFestivalByGenreId = async (req: Request, res: Response, next: NextFunction) => {
    const { genreId, offset, limit } = req.query;

    try {
      const findFestivalsData: Festival[] = await this.festivalService.findFestivalByGenreId(genreId, offset, limit);
      res.status(200).json(findFestivalsData);
    } catch (error) {
      next(error);
    }
  };

  public getFestivalDetailById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const festivalId: string = req.params.id;
    const userData: User = req.user;

    try {
      const findOneFestivalDetailData: Festival = await this.festivalService.createFestivalDetailData(
        festivalId,
        userData,
      );
      res.status(200).json(findOneFestivalDetailData);
    } catch (error) {
      next(error);
    }
  };
}

export default FestivalsController;
