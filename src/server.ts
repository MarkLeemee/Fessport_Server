import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import IndexRoute from './routes/index.route';
import AuthRoute from './routes/auth.route';
import MainRoute from './routes/main.route';
import FestivalsRoute from './routes/festivals.route';
import CategoryRoute from './routes/category.route';
import ArtistsRoute from './routes/artists.route';
import UsersRoute from './routes/users.route';
import FakeDataRoute from './routes/fakeData.route';
import BoardsRoute from './routes/boards.route';
import CommentsRoute from './routes/comments.route';
import LikesRoute from './routes/likes.route';
import DislikesRoute from './routes/dislikes.route';
import VisitsRoute from './routes/visits.route';
import ParticipantsRoute from './routes/participants.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new FakeDataRoute(),
  new BoardsRoute(),
  new CommentsRoute(),
  new AuthRoute(),
  new MainRoute(),
  new FestivalsRoute(),
  new CategoryRoute(),
  new ArtistsRoute(),
  new UsersRoute(),
  new LikesRoute(),
  new DislikesRoute(),
  new VisitsRoute(),
  new ParticipantsRoute(),
]);

app.listen();
