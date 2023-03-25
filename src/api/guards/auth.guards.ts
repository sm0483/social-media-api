import { IAuthUser, IUserResponse } from '../interfaces/models/user.interfaces';

const hasValidAuth = (obj: any): obj is IAuthUser => {
  return typeof obj === 'object' && typeof obj.email === 'string';
};

const hasValidUserResponse = (obj: any): obj is IUserResponse => {
  return typeof obj === 'object' && typeof typeof obj._id === 'string';
};

export default { hasValidAuth, hasValidUserResponse };
