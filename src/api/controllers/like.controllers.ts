import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/customError.utils';
import LikeService from '../services/like.services';
import mongoose from 'mongoose';

class LikeController {
  private likeService: LikeService = new LikeService();

  public likePost = async (req: IRequestWithFileAndUser, res: Response) => {
    const userId: string = req.user.id;
    const postId: string = req.params.postId;
    if (!userId) throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    if (!postId) throw new CustomError('Post not found', StatusCodes.NOT_FOUND);
    const post = await this.likeService.checkPost(postId);
    if (!post) throw new CustomError('Post not found', StatusCodes.NOT_FOUND);
    const like = await this.likeService.checkLike(userId);
    if (like && like.postId.includes(postId as any))
      throw new CustomError('Post already liked', StatusCodes.BAD_REQUEST);
    if (!like) {
      await this.likeService.createLike(userId);
    }
    const response = await this.likeService.addLike(userId, postId);
    const id = new mongoose.Types.ObjectId(postId);
    if (!response[0].postId.includes(id as any))
      throw new CustomError('Post not liked', StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
      message: 'Post liked successfully',
      status: StatusCodes.OK,
    });
  };

  public removeLike = async (req: IRequestWithFileAndUser, res: Response) => {
    const userId: string = req.user.id;
    const postId: string = req.params.postId;
    if (!userId) throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    if (!postId) throw new CustomError('Post not found', StatusCodes.NOT_FOUND);
    const post = await this.likeService.checkPost(postId);
    if (!post) throw new CustomError('Post not found', StatusCodes.NOT_FOUND);
    const like = await this.likeService.checkLike(userId);
    if (!like) {
      await this.likeService.createLike(userId);
      throw new CustomError('Like not found', StatusCodes.NOT_FOUND);
    }
    if (like && !like.postId.includes(postId as any)) {
      throw new CustomError('Post not liked', StatusCodes.BAD_REQUEST);
    }
    const response = await this.likeService.removeLike(userId, postId);
    const id = new mongoose.Types.ObjectId(postId);
    if (response[0].postId.includes(id as any))
      throw new CustomError('Post not liked', StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
      message: 'Like removed successfully',
      status: StatusCodes.OK,
    });
  };
}

export default LikeController;
