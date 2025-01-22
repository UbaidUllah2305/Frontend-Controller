import React from 'react';
import { Label } from '@/components/ui/label';
import { useSubCategories } from '@/hooks/useSubCategories';
import { useQuery } from '@tanstack/react-query';
import AddSubCategoryModal from '@/components/Modals/subCategories/AddSubCategoryModal';
import { useParams } from 'react-router-dom';
import EachSubCategoryCard from '@/components/Cards/EachSubCategoryCard';
import { SubCategory } from '@/types/Responses/SubCategories';
const SubCategoryBySlug = () => {
  const { slug } = useParams();
  const { getSubCategoryBySlug } = useSubCategories();
  // Fetch subcategories for the given slug
  const {
    data: subCategories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['subCategories', slug],
    queryFn: () => getSubCategoryBySlug(slug),
    enabled: !!slug,
  });
  if (isLoading) {
    return <div>Loading subcategories...</div>;
  }
  if (isError) {
    return <div>Error fetching subcategories!</div>;
  }
  return (
    <React.Fragment>
      <div className="flex justify-between items-center">
        <Label className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-0">
          Subcategories of "{slug}"
        </Label>
        <AddSubCategoryModal buttonTitle="Add Subcategory" />
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {subCategories &&
          Array.isArray(subCategories) &&
          subCategories.map((subCategory: any, index: any) => (
            <EachSubCategoryCard
              key={index}
              index={index}
              name={subCategory.name}
              image={subCategory.image || '/images/category.jpg'}
              description={subCategory.description}
              slug={subCategory.slug}
              serialCode={subCategory.serialCode}
            />
          ))}
      </div>
    </React.Fragment>
  );
};
export default SubCategoryBySlug;
