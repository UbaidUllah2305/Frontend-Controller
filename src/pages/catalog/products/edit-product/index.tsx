import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/hooks/useProducts';
import { useSubCategories } from '@/hooks/useSubCategories';
import { productAttribute } from '@/types/Responses/Products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Info } from 'lucide-react';
import React from 'react';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const productBasicSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  title: z.string().min(1, 'Product title is required'),
  description: z.string().min(1, 'Description is required'),
  subCategorySlugs: z
    .array(z.string())
    .nonempty('At least one subcategory is required'),
});

export type ProductFormBasicValues = z.infer<typeof productBasicSchema>;

const EditProduct = () => {
  const { getAllSubCategories } = useSubCategories();
  const { getProductBySlug, updateProductBasicData } = useProducts();
  const { productSlug } = useParams();

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['singleProduct', productSlug],
    queryFn: () => getProductBySlug(productSlug as string),
    enabled: !!productSlug,
  });

  const { data: subCategories, isLoading: isSubCategoriesLoading } = useQuery({
    queryKey: ['subCategories'],
    queryFn: getAllSubCategories,
  });

  const query = useQueryClient();

  const { control, register, setValue, handleSubmit, reset } =
    useForm<ProductFormBasicValues>({
      resolver: zodResolver(productBasicSchema),
      defaultValues: {
        name: '',
        title: '',
        description: '',
        subCategorySlugs: [],
      },
    });

  React.useEffect(() => {
    // Once product and subCategories are loaded, reset form with the correct defaults
    if (product && subCategories) {
      const defaultAssociatedSubCategories = product.subcategories.map(
        (category) => category.slug,
      );

      reset({
        description: product.description,
        name: product.name,
        title: product.title,
        subCategorySlugs: defaultAssociatedSubCategories,
      });
    }
  }, [product, subCategories, reset]);

  const OPTIONS: Option[] =
    subCategories?.map((subCategory) => ({
      label: subCategory.name,
      value: subCategory.slug,
    })) || [];

  const onBasicFormSubmit = async (data: ProductFormBasicValues) => {
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      title: data.title.trim(),
      description: data.description.trim(),
      subCategorySlugs: data.subCategorySlugs.map((slug) => slug.trim()),
      attributes: product?.attributes as productAttribute[],
    };

    updateProductBasicData.mutate(
      {
        productSlug: productSlug as string,
        productData: trimmedData,
      },
      {
        onSuccess: () => {
          query.invalidateQueries({ queryKey: ['singleProduct', productSlug] });
          toast.success('Product Updated successfully');
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
              error.response.data.message || 'An error occurred';
            toast.error(`${errorMessage}`);
          } else {
            // Handle non-Axios errors
            toast.error(`${(error as Error).message}`);
          }
        },
      },
    );
  };

  const onBasicFormError: SubmitErrorHandler<ProductFormBasicValues> = (
    errors,
  ) => {
    console.log('Errors:', errors);
    for (const error of Object.values(errors)) {
      if (error?.message) {
        toast.error(error.message);
        break; // Show only the first error message
      }
    }
  };


  if (!product || !subCategories) {
    return <div></div>;
  }

  return (
    <React.Fragment>
      <Label className="text-xl font-semibold">Edit Product Details</Label>
      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className=" h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription className="">
          You can edit the product details here. You can edit the product basic
          details in the first section and the variants in the second section.
        </AlertDescription>
      </Alert>
      <section>
        <form onSubmit={handleSubmit(onBasicFormSubmit, onBasicFormError)}>
          <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="product-name"
                className="block text-sm/6 font-medium"
              >
                Product Name
              </label>
              <div className="mt-2">
                <Input
                  id="product-name"
                  {...register('name')}
                  placeholder="Product name"
                  type="text"
                  autoComplete="product-name"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="product-title"
                className="block text-sm/6 font-medium"
              >
                Product Title
              </label>
              <div className="mt-2">
                <Input
                  id="product-title"
                  placeholder="Product title"
                  {...register('title')}
                  type="text"
                  autoComplete="product-title"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium"
              >
                Assign Sub Categories
              </label>
              <div className="mt-2">
                <Controller
                  name="subCategorySlugs"
                  control={control}
                  render={({ field }) => {
                    const selectedOptions = OPTIONS.filter((option) =>
                      field.value.includes(option.value),
                    );

                    return (
                      <MultipleSelector
                        {...field}
                        options={OPTIONS}
                        value={selectedOptions}
                        onChange={(selected) => {
                          const selectedSlugs = selected.map(
                            (option) => option.value,
                          );
                          // Update field value directly
                          field.onChange(selectedSlugs);
                        }}
                        placeholder="Select sub categories..."
                        emptyIndicator={
                          <Label className="text-center text-sm leading-10 dark:text-muted-foreground text-muted">
                            no results found.
                          </Label>
                        }
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-full">
              <Label
                htmlFor="first-name"
                className="block text-sm/6 font-medium"
              >
                Product Description
              </Label>
              <div className="mt-2">
                <Textarea
                  id="product-description"
                  {...register('description')}
                  autoComplete="product-description"
                  rows={4}
                  placeholder="Write a short description about the product..."
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-x-4">
            <Button variant="default" type="submit" size={'default'}>
              Update
            </Button>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
};

export default EditProduct;
