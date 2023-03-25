import IError from '../interfaces/error/error.interfaces';

const errorGuard = (obj: any): obj is IError => {
  return (
    typeof obj === 'object' &&
    typeof obj.status === 'number' &&
    typeof obj.message === 'string'
  );
};

export default errorGuard;
