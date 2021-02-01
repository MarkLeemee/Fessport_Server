import { RequestWithUser } from '../interfaces/auth.interface';
import { NextFunction, Request, Response } from 'express';
import { Board } from '../interfaces/boards.interface';
// import { Festival } from '../interfaces/festivals.interface';
import { User } from '../interfaces/users.interface';
import boardService from '../services/boards.service';

class BoardsController {
  public boardService = new boardService();

  public getBoardList = async (req: Request, res: Response, next: NextFunction) => {
    const { boardCategoryId } = req.query;

    try {
      const findBoardData: Board[] = await this.boardService.findBoardList(boardCategoryId);
      res.status(200).json(findBoardData);
    } catch (error) {
      next(error);
    }
  };

  public createBoard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const boardData = req.body;
    const userData: User = req.user;

    try {
      const createBoardData: Board = await this.boardService.createBoard(boardData, userData);
      res.status(201).json(createBoardData);
    } catch (error) {
      next(error);
    }
  };

  public updateBoard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const boardData = req.body;
    const userData: User = req.user;

    try {
      const updateBoardData: Board = await this.boardService.updateBoard(boardData, userData);
      res.status(201).json(updateBoardData);
    } catch (error) {
      next(error);
    }
  };

  public deleteBoard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { boardId } = req.query;
    const userData: User = req.user;

    try {
      const deleteBoardData: Board = await this.boardService.deleteBoard(boardId, userData);
      res.status(201).json(deleteBoardData);
    } catch (error) {
      next(error);
    }
  };
}

export default BoardsController;
