export type colorAttribute = {
  id: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  image: string;
};

export type productAttribute = {
  size: string;
  sku: string;
  price: number;
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
  subcategories: any;
  id: string;
  slug: string;
  title: string;
  long_description: string;
  short_description: string;
  gridImages: string[];
  color_attributes: colorAttribute[];
  storage_attributes: storageAttribute[];
  name: string;
  attributes: productAttribute[];
};

export type productMetaData = {
  slug: string;
  name: string;
  title: string;
  description: string;
  attributes: productAttribute[];
  metadata?: {
    title: string;
    description: string;
  };
};

export type SingleProduct = {
  name: string;
  slug: string;
  title: string;
  description: string;
  subcategories: {
    name: string;
    slug: string;
  }[];
  attributes: productAttribute[];
};
