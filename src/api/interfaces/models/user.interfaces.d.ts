interface IUser {
  name: string;
  email: string;
  password: string;
  followerCount: number;
  place: string;
  jobDescription: string;
  profileImage: string;
}

interface IUserResponse extends IUser {
  _id: string;
  _v: number;
}

interface IAuthUser {
  id: number;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export { IAuthUser, IUser, IUserResponse };
