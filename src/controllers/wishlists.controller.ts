import { NextFunction, Request, Response } from 'express';
//import { Wishlist } from '../interfaces/wishlists.interface';
import { User } from '../interfaces/users.interface';
import wishlistService from '../services/wishlists.service';

class WishlistsController {
  public wishlistService = new wishlistService();

  public getWishlistById = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;

    try {
      const findWishlist: User = await this.wishlistService.findAllWishlist(userId);
      res.status(200).json({ data: findWishlist, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default WishlistsController;