import React from 'react';
import { Label } from '@/components/ui/label';
import EachCategoryCard from '@/components/Cards/EachCategoryCard';
import { useCategories } from '@/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';
import AddCategoryModal from '@/components/Modals/categories/AddCategoryModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Categories = () => {
  const { getAllCategories } = useCategories();
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  return (
    <React.Fragment>
      <Label className="text-xl font-semibold">Categories</Label>
      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription className="">
          All the categories are listed below. You can add new categories by
          clicking on the button below. You can also view all sub categories,
          edit or delete any category by clicking on the ellipsis button.
        </AlertDescription>
      </Alert>
      <div className="flex justify-end items-center ">
        <AddCategoryModal buttonTitle="Add New Category" />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 ">
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <EachCategoryCard
              key={index}
              index={index}
              name={category.name}
              image="/images/category.jpg"
              description={category.description}
              slug={category.slug}
              count={category.subcategoryCount}
            />
          ))}
      </div>
    </React.Fragment>
  );
};

export default Categories;
