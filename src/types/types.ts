export type TDecoded = {
  data: {
    userEmail: string;
    role: string;
  };
  iat: number;
  exp: number;
};

export type IUserInfo = {
  userEmail: string;
  role: 'tutor' | 'student' | 'admin';
  iat: number;
  exp: number;
};


export type IUser = {
  _id?: string;
  firstName?:string;
  lastName?:string;
  name: string;
  email: string;
  phone:string;
  country:string;
  role: 'Admin' | 'Administrator' | 'User';
  password: string;
  introduction?:string;
  address?:string;
  profileImage?:string;
  createdAt: string;
  updatedAt: string;
}