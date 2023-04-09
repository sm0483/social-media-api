import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Connect from '../models/connect.models';
import CustomError from '../utils/customError.utils';
import { IConnect } from '../interfaces/models/connect.interface';
import ConnectServices from '../services/connect.services';

class ConnectController {
  private connectServices: ConnectServices = new ConnectServices();
  public followUser = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    const followId: string = req.params.followId;
    if (!followId)
      throw new CustomError('followId not found', StatusCodes.BAD_REQUEST);
    if (!id) throw new CustomError('id not found', StatusCodes.UNAUTHORIZED);
    let connect: IConnect | null = await this.connectServices.findConnect(id);
    if (!connect) connect = await this.connectServices.createConnect(id);
    if (
      await this.connectServices.isFollowed(connect.following, followId as any)
    )
      throw new CustomError('User already following', StatusCodes.BAD_REQUEST);

    const upload = await this.connectServices.updateConnect(
      true,
      id,
      followId as any
    );
    if (!upload[1]) {
      upload[1] = await Connect.create({
        userId: followId,
        followers: [id],
      });
    }
    res.status(StatusCodes.OK).json({
      message: 'Successfully followed',
      status: StatusCodes.OK,
    });
  };

  public removeFollow = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    const followId: string = req.params.followId;
    if (!followId)
      throw new CustomError('follow id not present', StatusCodes.BAD_REQUEST);

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
        followId as any
      ))
    )
      throw new CustomError(
        'User already not following',
        StatusCodes.BAD_REQUEST
      );

    await this.connectServices.updateConnect(false, id, followId as any);

    res.status(StatusCodes.OK).json({
      message: 'Successfully removed',
      status: StatusCodes.OK,
    });
  };
}

export default ConnectController;
