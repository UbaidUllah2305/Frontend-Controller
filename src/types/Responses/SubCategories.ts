import { Category } from './Categories';

export type SubCategory = {
  name: string;
  description: string;
  image: string;
  slug: string;
  categories: Category[];
};

export type SubCategoryBySerialCode =  | {
  name: string;
  slug: string;
  description: string;
  image: string | null;
  added: true;
  metadata: {
    title: string;
    description: string;
  };
}
| {
  name: string;
  slug: string;
  description: string;
  image: string | null;
  added: false;
};
