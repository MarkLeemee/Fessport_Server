import artistModel from '../models/artists.model';
import { Artist } from '../interfaces/artists.interface';
import { User } from '../interfaces/users.interface';
import { isEmpty } from '../utils/util';
import HttpException from '../exceptions/HttpException';

class ArtistService {
  public artists = artistModel;

  public async findOneArtistBySearchId(searchId): Promise<Artist> {
    if (isEmpty(searchId)) throw new HttpException(400, 'error');

    const artist: Artist = await this.artists
      .findById(searchId, 'name image description genre')
      .populate('genre', 'name');
    if (!artist) throw new HttpException(409, 'error');
    return artist;
  }

  public async findAllArtist(offset?, limit?): Promise<Artist[]> {
    const artists: Artist[] = await this.artists.find({}, 'name image description genre').populate('genre', 'name');
    if (isEmpty(artists)) throw new HttpException(400, 'error');
    const total = artists.length;

    if (offset && limit) {
      const skip = Number(offset);
      const findLimitArtists: Artist[] = await this.artists
        .find({}, 'name image description genre')
        .populate('genre', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

      return findLimitArtists.map(artist => {
        const { _id, name, image, description, genre } = artist;
        return { _id, name, image, description, genre, total };
      });
    } else
      return artists.map(artist => {
        const { _id, name, image, description, genre } = artist;
        return { _id, name, image, description, genre, total };
      });
  }

  public async findAritstByGenreId(genreId, offset?, limit?): Promise<Artist[]> {
    if (isEmpty(genreId)) throw new HttpException(400, 'error');

    const findArtists: Artist[] = await this.artists
      .find({ genre: genreId }, 'name image description genre')
      .populate('genre', 'name');
    if (isEmpty(findArtists)) throw new HttpException(400, 'error');
    const total = findArtists.length;

    if (offset && limit) {
      const skip = Number(offset);
      const findLimitArtists: Artist[] = await this.artists
        .find({ genre: genreId }, 'name image description genre')
        .populate('genre', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit));

      return findLimitArtists.map(artist => {
        const { _id, name, image, description, genre } = artist;
        return { _id, name, image, description, genre, total };
      });
    } else
      return findArtists.map(artist => {
        const { _id, name, image, description, genre } = artist;
        return { _id, name, image, description, genre, total };
      });
  }

  public async findOneArtistById(artistId: string): Promise<Artist> {
    if (isEmpty(artistId)) throw new HttpException(400, 'error');

    const artist: Artist = await this.artists
      .findById(artistId, 'name image description video genre festivals')
      .populate('genre', 'name')
      .populate('festivals', 'name poster');
    if (!artist) throw new HttpException(409, 'error');
    return artist;
  }

  public async createArtistDetailData(artistId: string, userData: User): Promise<Artist> {
    if (!artistId) throw new HttpException(400, 'error');

    const artistDetail: Artist = await this.findOneArtistById(artistId);
    if (!artistDetail) throw new HttpException(409, 'error');

    let isLiked = false;
    // userData가 없다는 것은 로그인 및 인증을 거치지 않은 사용자
    if (isEmpty(userData))
      return {
        ...artistDetail._doc,
        isLiked,
      };

    if (userData.wishArtists.length) {
      for (let i = 0; i < userData.wishArtists.length; i++) {
        if (String(artistId) === String(userData.wishArtists[i])) {
          isLiked = true;
          break;
        }
      }
    }
    return {
      ...artistDetail._doc,
      isLiked,
    };
  }
}

export default ArtistService;
