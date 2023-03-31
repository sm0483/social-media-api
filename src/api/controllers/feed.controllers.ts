import { StatusCodes } from 'http-status-codes';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import CustomError from '../utils/customError.utils';
import { Response } from 'express';
import FeedService from '../services/feed.services';

class FeedController {
  public feedService: FeedService = new FeedService();

  public getFeed = async (req: IRequestWithFileAndUser, res: Response) => {
    const userId: string = req.user.id;
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 10;
    const skip: number = (page - 1) * pageSize;

    if (!userId) throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    const connect = await this.feedService.findConnect(userId);
    const liked = await this.feedService.findLiked(userId);
    
    const posts = await this.feedService.getFeed(
      connect,
      (liked as any).postId,
      skip,
      pageSize
    );
    if (!posts) throw new CustomError('Posts not found', StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(posts);
  };
}

export default FeedController;
