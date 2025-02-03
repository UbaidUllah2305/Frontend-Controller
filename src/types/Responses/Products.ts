export type colorAttribute = {
  id: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  image: string;
};

export type storageAttribute = {
  [x: string]: any;
  id: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  storage: string;
};

export type shortProduct = {
  id: string;
  slug: string;
  title: string;
  long_description: string;
  short_description: string;
  gridImages: string[];
  color_attributes: colorAttribute[];
  storage_attributes: storageAttribute[];
};