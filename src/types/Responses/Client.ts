export type Client = {
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  serialCode: string;
};

export type ClientAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type Category = {
  name: string;
  image: string;
  slug: string;
  description: string;
};

export type MetaData = {
  title: string;
  description: string;
};

export type FullCompanyProfileAPIResponse = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  image: string;
  companyName: string;
  serialCode: string;
  companyDescription: string;
  companyWebsite: string;
  addresses: ClientAddress[];
  userCategories: {
    category: Category;
    metadata: MetaData;
  }[];
};
