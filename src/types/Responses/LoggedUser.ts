export type LoggedUserResponse = {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  gender: string;
  username: string;
  image: string;
};
