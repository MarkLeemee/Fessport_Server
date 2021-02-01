import genreModel from '../models/genres.model';
import festivalModel from '../models/festivals.model';
import { Festival } from '../interfaces/festivals.interface';
import { User } from '../interfaces/users.interface';
import { isEmpty } from '../utils/util';
import HttpException from '../exceptions/HttpException';
import boardModel from '../models/boards.model';
import { Board } from '../interfaces/boards.interface';
import { BoardCategory } from '../interfaces/boardCategories.interface';

class FestivalService {
  public genres = genreModel;
  public boards = boardModel;
  public festivals = festivalModel;

  public async findAllFestival(offset?, limit?): Promise<Festival[]> {
    const festivals: Festival[] = await this.festivals
      .find({}, 'name poster genre country')
      .populate('genre', 'name')
      .populate('country', 'name flagImage');
    if (isEmpty(festivals)) throw new HttpException(400, 'error');
    const total = festivals.length;

    if (offset && limit) {
      const skip = Number(offset);
      const findLimitFestivals: Festival[] = await this.festivals
        .find({}, 'name poster genre country')
        .populate('genre', 'name')
        .populate('country', 'name flagImage')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

      return findLimitFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
    } else
      return festivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
  }

  public async findFestivalByCountryGenreId(genreId, countryId, offset?, limit?): Promise<Festival[]> {
    if (isEmpty(countryId) || isEmpty(genreId)) throw new HttpException(400, 'error');

    const findFestivals: Festival[] = await this.festivals
      .find({ country: countryId, genre: genreId }, 'name poster genre country')
      .populate('genre', 'name')
      .populate('country', 'name flagImage');
    if (!findFestivals) throw new HttpException(400, 'error');
    const total = findFestivals.length;

    if (offset && limit) {
      const skip = Number(offset);
      const findLimitFestivals: Festival[] = await this.festivals
        .find({ country: countryId, genre: genreId }, 'name poster genre country')
        .populate('genre', 'name')
        .populate('country', 'name flagImage')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

      return findLimitFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
    } else
      return findFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
  }

  public async findFestivalByCountryId(countryId, offset?, limit?): Promise<Festival[]> {
    if (isEmpty(countryId)) throw new HttpException(400, 'error');

    const findFestivals: Festival[] = await this.festivals
      .find({ country: countryId }, 'name poster genre country')
      .populate('genre', 'name')
      .populate('country', 'name flagImage');
    if (!findFestivals) throw new HttpException(400, 'error');
    const total = findFestivals.length;

    if (offset && limit) {
      const skip = Number(offset);
      const findLimitFestivals: Festival[] = await this.festivals
        .find({ country: countryId }, 'name poster genre country')
        .populate('genre', 'name')
        .populate('country', 'name flagImage')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

      return findLimitFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
    } else
      return findFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
  }

  public async findFestivalByGenreId(genreId, offset?, limit?): Promise<Festival[]> {
    if (isEmpty(genreId)) throw new HttpException(400, 'error');

    const findFestivals: Festival[] = await this.festivals
      .find({ genre: genreId }, 'name poster genre country')
      .populate('genre', 'name')
      .populate('country', 'name flagImage');
    if (!findFestivals) throw new HttpException(400, 'error');
    const total = findFestivals.length;

    if (offset && limit) {
      const skip = Number(offset);
      const findLimitFestivals: Festival[] = await this.festivals
        .find({ genre: genreId }, 'name poster genre country')
        .populate('genre', 'name')
        .populate('country', 'name flagImage')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

      return findLimitFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
    } else
      return findFestivals.map(festival => {
        const { _id, name, poster, genre, country } = festival;
        return { _id, name, poster, genre, country, total };
      });
  }

  public async findOneFestivalBySearchId(searchId): Promise<Festival> {
    if (isEmpty(searchId)) throw new HttpException(400, 'error');

    const festival: Festival = await this.festivals
      .findById(searchId, 'name poster genre country')
      .populate('genre', 'name')
      .populate('country', 'name flagImage');
    if (!festival) throw new HttpException(409, 'error');
    return festival;
  }

  public async findOneFestivalById(festivalId: string): Promise<Festival> {
    if (isEmpty(festivalId)) throw new HttpException(400, 'error');

    const festival: Festival = await this.festivals
      .findById(festivalId, 'name description artists startDate endDate video poster homepage genre country')
      .populate('genre', 'name')
      .populate('country', 'name flagImage')
      .populate('artists', 'name image');
    if (!festival) throw new HttpException(409, 'error');
    return festival;
  }

  public async createFestivalDetailData(festivalId, userData: User): Promise<Festival> {
    if (!festivalId) throw new HttpException(400, 'error');

    const festivalDetail: Festival = await this.findOneFestivalById(festivalId);
    if (!festivalDetail) throw new HttpException(409, 'error');

    const boards: Board[] = await this.boards
      .find({ festival: festivalId }, 'title boardCategory user image')
      .populate('boardCategory', 'name')
      .populate('user', 'nickname');

    const findPostsRelatedToFestivals = { companions: [], reviews: [], resells: [] };
    for (const board of boards) {
      const { _id, title, boardCategory, user, image } = board;
      const categoryName = (<BoardCategory>boardCategory).name;
      findPostsRelatedToFestivals[categoryName].push({ _id, title, user, image });
    }

    // userData가 없다는 것은 로그인 및 인증을 거치지 않은 사용자
    if (isEmpty(userData))
      return { ...festivalDetail._doc, ...findPostsRelatedToFestivals, isLiked: false, visited: false };

    let isLiked = false;
    if (userData.wishFestivals.length) {
      for (let i = 0; i < userData.wishFestivals.length; i++) {
        if (String(festivalId) === String(userData.wishFestivals[i])) {
          isLiked = true;
          break;
        }
      }
    }
    let visited = false;
    for (let i = 0; i < userData.visits.length; i++) {
      if (String(festivalId) === String(userData.visits[i])) {
        visited = true;
        break;
      }
    }
    return { ...festivalDetail._doc, visited, isLiked, ...findPostsRelatedToFestivals };
  }
}

export default FestivalService;
