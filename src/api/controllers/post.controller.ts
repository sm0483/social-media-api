import { StatusCodes } from 'http-status-codes';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import { Response } from 'express';
import validations from '../validations/post.validations';
import CustomError from '../utils/customError.utils';
import PostServices from '../services/post.services';
import { v4 as uid } from 'uuid';
import keyConfig from '../../config/key.config';
import FeedServices from '../services/feed.services';
class PostController {
  private postServices = new PostServices();
  private feedServices = new FeedServices();

  public createPost = async (req: IRequestWithFileAndUser, res: Response) => {
    const data = req.body.data && JSON.parse(req.body.data);
    if (!req.user.id)
      throw new CustomError('Token not valid', StatusCodes.UNAUTHORIZED);
    const { error } = validations.validatePost(data);
    if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
    const operations = [];
    if (!req.file || !req.file.mimetype.includes('image'))
      throw new CustomError(
        'No image found on request',
        StatusCodes.BAD_REQUEST
      );
    if (req.file && req.file.mimetype.includes('image')) {
      const key: string = uid();
      this.postServices.storeImage(operations, req.file.path, key);
      data.postImage = `${keyConfig.SERVER_DOMAIN}/images/${key}`;
      data.userId = req.user.id;
    }

    this.postServices.createPost(data, operations);
    const response: any[] = await Promise.all(operations);
    const post = response[response.length - 1];
    return res.status(StatusCodes.CREATED).json(post);
  };

  public getPosts = async (req: IRequestWithFileAndUser, res: Response) => {
    const userId = req.user.id;
    if (!userId)
      throw new CustomError('Token not valid', StatusCodes.UNAUTHORIZED);
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 10;
    const skip: number = (page - 1) * pageSize;

    if (!userId) throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    const connect = await this.feedServices.findConnect(userId);
    const liked = await this.feedServices.findLiked(userId);
    const posts = await this.postServices.getPosts(
      userId,
      connect,
      (liked as any).postId,
      skip,
      pageSize
    );
    res.status(StatusCodes.OK).json(posts);
  };
  public deletePost = async (req: IRequestWithFileAndUser, res: Response) => {
    const postId = req.params.postId;
    if (!req.user.id)
      throw new CustomError('Token not valid', StatusCodes.UNAUTHORIZED);
    if (!postId)
      throw new CustomError('post id not present', StatusCodes.BAD_REQUEST);
    const posts = await this.postServices.deletePost(postId, req.user.id);
    res.status(StatusCodes.OK).json(posts);
  };
}

export default PostController;
