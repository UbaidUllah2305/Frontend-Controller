import React from 'react';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useSubCategories } from '@/hooks/useSubCategories';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ArrowRight, EllipsisVertical, Info, MoveUpRight, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import AssignSubCategoryMetaDataModal from '@/components/Modals/assign-to-clients/AssignSubCategoriesMetaDataModal';
import EditSubCategoryMetaDataModal from '@/components/Modals/assign-to-clients/EditSubCategoriesMetaDataModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
const ClientSubCategoryBySlug = () => {
  const { serialCode, categorySlug } = useParams();
  const { getSubCategoryBySlugBySerialCode } = useSubCategories();

  // Fetch subcategories for the given slug
  const {
    data: subCategories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['subCategories', categorySlug, serialCode],
    queryFn: () => getSubCategoryBySlugBySerialCode(categorySlug, serialCode),
    enabled: !!categorySlug && !!serialCode,
  });

  if (isLoading) {
    return <div></div>;
  }
  if (isError) {
    return <div></div>;
  }
  if (serialCode && categorySlug && subCategories) {
    return (
      <React.Fragment>
        <div className="flex justify-between items-center">
          <Label className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-0">
            Related Sub Categories
          </Label>
        </div>
        <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
          <Info className=" h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription className="">
            All the subcategories are assigned to the client from this category.
            Here you can see the details of the subcategories and also you can
            edit the metadata of the subcategories.
          </AlertDescription>
        </Alert>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {subCategories &&
            subCategories.length > 0 &&
            subCategories.map((subCategory, index) => (
              <Card key={index}>
                <CardHeader className="py-3">
                  <CardTitle className="">
                    <Badge
                      className="mb-2"
                      variant={subCategory.added ? 'outline' : 'destructive'}
                    >
                      {subCategory.added ? 'Added' : 'Not Added'}
                    </Badge>
                    <div className="flex items-center justify-between">
                      <Label>{subCategory.name}</Label>
                      <DropdownMenu key={index}>
                        <DropdownMenuTrigger>
                          <Settings className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Metadata Setting
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            {subCategory.added ? (
                              <EditSubCategoryMetaDataModal
                                title={subCategory.metadata.title}
                                description={subCategory.metadata.description}
                                subcategorySlug={subCategory.slug}
                              >
                                Edit Data
                              </EditSubCategoryMetaDataModal>
                            ) : (
                              <AssignSubCategoryMetaDataModal
                                categorySlug={categorySlug}
                                serialCode={serialCode}
                                subcategorySlug={subCategory.slug}
                              >
                                Assign Data
                              </AssignSubCategoryMetaDataModal>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              to={`${subCategory.slug}/products`}
                              className="flex items-center"
                            >
                              <MoveUpRight className="mr-3 h-4 w-4" />
                              View Products
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardTitle>
                  <CardDescription className="">
                    {subCategory.added && (
                      <>
                        <p className="text-base">{subCategory.description}</p>
                        <div className="py-3">
                          <Badge variant="secondary" className="mb-1">
                            Title
                          </Badge>
                          <p className="text-base">
                            {subCategory.metadata.title}
                          </p>
                        </div>
                        <div className="py-3">
                          <Badge variant="secondary" className="mb-1">
                            Description
                          </Badge>
                          <p className="text-base">
                            {subCategory.metadata.description}
                          </p>
                        </div>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      </React.Fragment>
    );
  }
};
export default ClientSubCategoryBySlug;
