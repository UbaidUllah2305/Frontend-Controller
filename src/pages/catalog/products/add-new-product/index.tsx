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
import React, { useState } from 'react';
import { SubmitErrorHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ImageUploading from 'react-images-uploading';
import { SketchPicker } from 'react-color';

// Define schema for storage attributes
const storageAttributeSchema = z.object({
  storage: z.string({ required_error: 'Storage is required' }),
  price: z.number({ required_error: 'Price is required' }),
});

// Define schema for color attributes
const colorAttributeSchema = z.object({
  color: z.string({ required_error: 'Color is required' }),
  image: z.string().optional(),
});

// Define schema for the product form
const productSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  long_description: z.string().min(1, 'Long description is required'),
  short_description: z.string().min(1, 'Short description is required'),
  subCategorySlugs: z
    .array(z.string())
    .nonempty('At least one subcategory is required'),
  color_attributes: z
    .array(colorAttributeSchema)
    .min(1, 'At least one color attribute is required'),
  storage_attributes: z
    .array(storageAttributeSchema)
    .min(1, 'At least one storage attribute is required'),
  gridImages: z.array(z.string()).max(6, 'Maximum of 6 images allowed'), // New field
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
        title: '',
        long_description: '',
        short_description: '',
        subCategorySlugs: [],
        color_attributes: [{ color: '', image: '' }],
        storage_attributes: [{ storage: '', price: 0 }],
        gridImages: [], // Default value for grid images
      },
    });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: 'color_attributes',
  });

  const {
    fields: storageFields,
    append: appendStorage,
    remove: removeStorage,
  } = useFieldArray({
    control,
    name: 'storage_attributes',
  });

  const [gridImages, setGridImages] = useState<any[]>([]);

  const handleImageUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue(`color_attributes.${index}.image`, base64String);
    };
  };

  const onSubmit = async (data: ProductFormValues) => {
    // Trim the string fields
    const trimmedData = {
      ...data,
      title: data.title.trim(),
      long_description: data.long_description.trim(),
      short_description: data.short_description.trim(),
      gridImages: gridImages.map((image) => image.data_url),
    };

    console.log(trimmedData);
    addNewProduct.mutate(trimmedData, {
      onSuccess: () => {
        toast.success('Product added successfully');
        reset();
        setGridImages([]); // Reset grid images
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage =
            error.response.data.message || 'An error occurred';
          toast.error(`${errorMessage}`);
        } else {
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

  const [attributeImages, setAttributeImages] = useState<{
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
      setValue(`color_attributes.${index}.image`, '');
    }
  };

  return (
    <React.Fragment>
      <Label className="text-xl font-semibold">Products</Label>
      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className=" h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription className="">
          Add product details, color attributes, and storage attributes.
        </AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <section className="mt-10">
          <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                  {...register('title')}
                  placeholder="Product title"
                  type="text"
                  autoComplete="product-title"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="sub-categories"
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
                      setValue('subCategorySlugs', [selectedSlugs[0], ...selectedSlugs.slice(1)]);
                    }
                  }}
                  placeholder="Select sub categories..."
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="short-description"
                className="block text-sm/6 font-medium"
              >
                Short Description
              </label>
              <div className="mt-2">
                <Textarea
                  id="short-description"
                  {...register('short_description')}
                  placeholder="Short description"
                  rows={4}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="long-description"
                className="block text-sm/6 font-medium"
              >
                Long Description
              </label>
              <div className="mt-2">
                <Textarea
                  id="long-description"
                  {...register('long_description')}
                  placeholder="Long description"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Color Attributes Section */}
        <section className="mt-5">
          <Label className="text-base font-medium">Color Attributes</Label>
          {colorFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg px-2 mt-2">
              <div className="pt-1 flex justify-end items-center gap-2">
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => removeColor(index)}
                  disabled={colorFields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-3 grid md:grid-cols-2 gap-3 px-1">
                <div className="col-span-1">
                  <Label>Color</Label>
                  <div className="mt-2">
                    <SketchPicker
                      color={field.color}
                      onChangeComplete={(color) => {
                        setValue(`color_attributes.${index}.color`, color.hex);
                      }}
                    />
                  </div>
                </div>
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
              </div>
            </div>
          ))}
          <div className="mt-3 flex justify-center items-center">
            <Button
              variant="secondary"
              size="icon"
              type="button"
              onClick={() => appendColor({ color: '', image: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Storage Attributes Section */}
        <section className="mt-5">
          <Label className="text-base font-medium">Storage Attributes</Label>
          {storageFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg px-2 mt-2">
              <div className="pt-1 flex justify-end items-center gap-2">
                <Button
                  size="sm"
                  variant={'ghost'}
                  onClick={() => removeStorage(index)}
                  disabled={storageFields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-3 grid md:grid-cols-2 gap-3 px-1">
                <div className="col-span-1">
                  <Label>Storage</Label>
                  <div className="mt-2">
                    <Input
                      id="storage"
                      {...register(`storage_attributes.${index}.storage`)}
                      placeholder="Storage"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Label>Price</Label>
                  <div className="mt-2">
                    <Input
                      id="price"
                      {...register(`storage_attributes.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Price"
                      type="text"
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
              onClick={() => appendStorage({ storage: '', price: 0 })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Grid Images Section */}
        <section className="mt-5">
          <Label className="text-base font-medium">Grid Images</Label>
          <div className="mt-2">
            <ImageUploading
              multiple
              value={gridImages}
              onChange={(imageList) => {
                setGridImages(imageList);
                console.log(imageList);
              }}
              maxNumber={6}
              dataURLKey="data_url"
            >
              {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
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
                  &nbsp;
                  <Button
                    variant="destructive"
                    onClick={onImageRemoveAll}
                    type="button"
                    className='mt-2'
                  >
                    Remove all images
                  </Button>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <img
                          src={image['data_url']}
                          alt=""
                          width="100"
                          className="rounded-lg object-cover h-20 w-full"
                        />
                        <div className="flex justify-center mt-2">
                          <Button
                            variant="ghost"
                            onClick={() => onImageUpdate(index)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => onImageRemove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ImageUploading>
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