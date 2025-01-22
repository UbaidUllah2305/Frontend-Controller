import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultipleSelector from '@/components/ui/multiple-selector';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/hooks/useProducts';
import { useSubCategories } from '@/hooks/useSubCategories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image, Info, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { SubmitErrorHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ImageUploading from 'react-images-uploading';

const variantSchema = z.object({
  size: z.string({ required_error: 'Size is required' }),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number({ required_error: 'Price is required' }),
  image: z.string(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  title: z.string().min(1, 'Product title is required'),
  description: z.string().min(1, 'Description is required'),
  subCategorySlugs: z
    .array(z.string())
    .nonempty('At least one subcategory is required'),
  attributes: z
    .array(variantSchema)
    .min(1, 'At least one variant is required')
    .refine(
      (data) => {
        // Ensure the first attribute has a valid base64 image
        const firstImage = data[0]?.image;
        return (
          typeof firstImage === 'string' &&
          firstImage.trim() !== '' &&
          firstImage.startsWith('data:image/')
        );
      },
      {
        message: 'The first attribute must have a valid image.',
        path: ['attributes', 0, 'image'],
      },
    ),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const AddNewProduct = () => {
  const { getAllSubCategories } = useSubCategories();
  const { data: subCategories, isLoading: isSubCategoriesLoading } = useQuery({
    queryKey: ['subCategories'],
    queryFn: getAllSubCategories,
  });
  const { addNewProduct } = useProducts();
  const { control, register, setValue, handleSubmit, reset } =
    useForm<ProductFormValues>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: '',
        title: '',
        description: '',
        subCategorySlugs: [],
        attributes: [{ size: '', sku: '', price: 0, image: '' }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  const handleImageUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue(`attributes.${index}.image`, base64String);
    };
  };

  const onSubmit = async (data: ProductFormValues) => {
    // Trim the string fields
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      title: data.title.trim(),
      description: data.description.trim(),
      attributes: data.attributes.map((attr, idx) => ({
        ...attr,
        image: idx === 0 ? attr.image : attr.image || '',
      })),
    };
    console.log(trimmedData);
    addNewProduct.mutate(trimmedData, {
      onSuccess: () => {
        toast.success('Product added successfully');
        reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage =
            error.response.data.message || 'An error occurred';
          toast.error(`${errorMessage}`);
        } else {
          // Handle non-Axios errors
          toast.error(`${error.message}`);
        }
      },
    });
  };

  const onError: SubmitErrorHandler<ProductFormValues> = (errors) => {
    const displayErrors = (errObj: any) => {
      for (const key in errObj) {
        const value = errObj[key];
        if (value && value.message) {
          toast.error(value.message);
        } else if (value && typeof value === 'object') {
          displayErrors(value);
        }
      }
    };
    displayErrors(errors);
  };

  // Store images per attribute index
  const [attributeImages, setAttributeImages] = React.useState<{
    [key: number]: any[];
  }>({});

  const maxNumber = 69;

  const handleImagesChange = (imageList: any[], index: number) => {
    setAttributeImages((prev) => ({
      ...prev,
      [index]: imageList,
    }));

    if (imageList.length > 0 && imageList[0].file) {
      handleImageUpload(imageList[0].file, index);
    } else {
      // If no image is selected, set image field to empty string for non-first attributes
      setValue(`attributes.${index}.image`, '');
    }
  };

  return (
    <React.Fragment>
      <Label className="text-xl font-semibold">Products</Label>
      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className=" h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription className="">
          Product addition fields are listed below. The first attribute requires
          an image, but subsequent attributes can omit it.
        </AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <section className="mt-10">
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
                <MultipleSelector
                  disabled={isSubCategoriesLoading}
                  options={
                    subCategories?.map((subCategory) => ({
                      label: subCategory.name,
                      value: subCategory.slug,
                    })) || []
                  }
                  onChange={(selected) => {
                    const selectedSlugs = selected.map((option) => option.value);
                    if (selectedSlugs.length > 0) {
                      setValue(
                        'subCategorySlugs',
                        selectedSlugs as [string, ...string[]],
                      );
                    }
                  }}
                  placeholder="Select sub categories you like..."
                  emptyIndicator={
                    <Label className="text-center text-sm leading-10 dark:text-muted-foreground text-muted">
                      no results found.
                    </Label>
                  }
                />
              </div>
            </div>
            <div className="sm:col-span-full">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium"
              >
                Product Description
              </label>
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
        </section>
        <section className="mt-5">
          <Label className="text-base font-medium ">Product Variants</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg px-2 mt-2">
              <div className="pt-1 flex justify-end items-center gap-2">
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-3 grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 px-1">
                <div className="col-span-1">
                  <Label>Image</Label>
                  <div className="mt-2">
                    <ImageUploading
                      multiple={false}
                      value={attributeImages[index] || []}
                      onChange={(imageList) => handleImagesChange(imageList, index)}
                      maxNumber={maxNumber}
                      dataURLKey="data_url"
                    >
                      {({ imageList, onImageUpload, isDragging, dragProps }) => (
                        <div className="upload__image-wrapper">
                          <Button
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            type="button"
                            variant="outline"
                            className="w-full"
                            {...dragProps}
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Click or Drop here
                          </Button>
                          {imageList.map((image, idx) => (
                            <div key={idx} className="image-item">
                              <img
                                src={image['data_url']}
                                alt=""
                                width="100"
                                className="rounded-lg object-cover mt-2 h-20 w-fit"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                </div>
                <div className="col-span-1">
                  <Label>SKU</Label>
                  <div className="mt-2">
                    <Input
                      id="sku"
                      {...register(`attributes.${index}.sku` as const)}
                      placeholder="sku"
                      type="text"
                      autoComplete="sku"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Label>Size</Label>
                  <div className="mt-2">
                    <Input
                      id="size"
                      placeholder="size"
                      {...register(`attributes.${index}.size`)}
                      type="text"
                      autoComplete="size"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Label>Price</Label>
                  <div className="mt-2">
                    <Input
                      id="price"
                      placeholder="price"
                      {...register(`attributes.${index}.price` as const, {
                        valueAsNumber: true,
                      })}
                      type="text"
                      autoComplete="price"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-3 flex justify-center items-center">
            <Button
              variant="secondary"
              size="icon"
              type="button"
              onClick={() => append({ size: '', sku: '', price: 0, image: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>
        <div className="mt-5 flex justify-end">
          <Button>Submit</Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default AddNewProduct;
