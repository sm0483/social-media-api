import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Connect from '../models/connect.models';
import CustomError from '../utils/customError.utils';
import { IConnect } from '../interfaces/models/connect.interface';
import mongoose from 'mongoose';
import validate from '../validations/follow.validations';
import ConnectServices from '../services/connect.services';

class ConnectController {
  private connectServices: ConnectServices = new ConnectServices();
  public followUser = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    const { error } = validate.validateFollow(req.body);
    if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
    const followData: { follow: mongoose.Schema.Types.ObjectId } = req.body;
    if (!id) throw new CustomError('id not found', StatusCodes.UNAUTHORIZED);
    const connect: IConnect | null = await this.connectServices.findConnect(id);
    if (!connect)
      throw new CustomError(
        'Internal server issue try to login',
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    if (
      await this.connectServices.isFollowed(
        connect.following,
        followData.follow
      )
    )
      throw new CustomError('User already following', StatusCodes.BAD_REQUEST);

    const upload = await this.connectServices.updateConnect(
      true,
      id,
      followData
    );
    if (!upload[1]) {
      upload[1] = await Connect.create({
        userId: followData.follow,
        followers: [id],
      });
    }
    res.status(StatusCodes.OK).json(upload[0]);
  };

  public removeFollow = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    const { error } = validate.validateFollow(req.body);
    if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
    const followData: { follow: mongoose.Schema.Types.ObjectId } = req.body;
    if (!id) throw new CustomError('id not found', StatusCodes.UNAUTHORIZED);
    const connect: IConnect | null = await this.connectServices.findConnect(id);
    if (!connect)
      throw new CustomError(
        'Internal server issue try to login',
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    if (
      !(await this.connectServices.isFollowed(
        connect.following,
        followData.follow
      ))
    )
      throw new CustomError(
        'User already not following',
        StatusCodes.BAD_REQUEST
      );

    const upload = await this.connectServices.updateConnect(
      false,
      id,
      followData
    );
    res.status(StatusCodes.OK).json(upload[0]);
  };
}

export default ConnectController;
