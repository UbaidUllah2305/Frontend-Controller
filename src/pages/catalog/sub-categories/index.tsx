import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { CirclePlus, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddSubCategoryModal from '@/components/Modals/subCategories/AddSubCategoryModal';
import { useSubCategories } from '@/hooks/useSubCategories';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EachSubCategoryCard from '@/components/Cards/EachSubCategoryCard';

const SubCategories: React.FC = () => {
  const { getAllSubCategories } = useSubCategories();
  const { data: allSubCategories } = useQuery({
    queryKey: ['subCategories'],
    queryFn: getAllSubCategories,
  });

  return (
    <>
      <Label className="text-xl font-semibold">Sub Categories</Label>

      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className=" h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription className="">
          All the sub categories are listed below. You can add new sub
          categories by clicking on the button below. You can also edit, delete
          or view all products whose have this sub category by clicking on the
          ellipsis button.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col sm:flex-row justify-end items-center">
        <AddSubCategoryModal buttonTitle="Add New SubCategory" />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 ">
        {allSubCategories &&
          allSubCategories.map((sub, index) => (
            <EachSubCategoryCard
              name={sub.name}
              description={sub.description}
              image={sub.image}
              slug={sub.slug}
              key={index}
              index={index}
              serialCode=""
            />
          ))}
      </div>
    </>
  );
};
export default SubCategories;
