export type Genders = 'male' | 'female' | 'other';
export type Roles = 'controller' | 'od' | 'md' | 'c' | 'cm' | 'cwu';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  level: 'manufacturer' | 'distributor';
  username: string;
  image: string;
};

export type LoginUserInitialData = {
  user: User;
  exp: number;
};
