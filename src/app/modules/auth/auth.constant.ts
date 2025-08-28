export const USER_ROLE = {
  Admin: 'Admin',
  Administrator: 'Administrator',
  User: 'User',
} as const;


export interface  IChangePassword{
  currentPassword:string;
  newPassword:string;
}

export const userSearchableFields = [
  'name',
  'email',
  'firstName',
  'lastName',
  'address',
  'country',
];
