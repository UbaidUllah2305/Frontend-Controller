export type productAttribute = {
  size: string;
  sku: string;
  price: number;
  image: string;
};

export type shortProduct = {
  slug: string;
  name: string;
  title: string;
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
