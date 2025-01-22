import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  Controller,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../../ui/textarea';
import { useCategories } from '@/hooks/useCategories';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSubCategories } from '@/hooks/useSubCategories';
import ImageUploading from 'react-images-uploading';

type AddSubCategoryModalProps = {
  buttonTitle: string;
};

const CategorySchema = z.object({
  name: z.string().min(1, 'Category Name is required'),
  description: z.string().min(1, 'Category Description is required'),
  image: z.any().optional(),
  categories: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, 'At least one category is required'),
});

type CategoryTypes = z.infer<typeof CategorySchema>;

const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = (props) => {
  const { getAllCategories } = useCategories();
  const { addSubCategory } = useSubCategories();
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  const OPTIONS: Option[] =
    categories?.map((category) => ({
      label: category.name,
      value: category.slug,
    })) || [];

  const query = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CategoryTypes>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: null,
      categories: [],
    },
  });

  const onSubmit: SubmitHandler<CategoryTypes> = (data) => {
    const transformedData = {
      name: data.name,
      description: data.description,
      image: data.image,
      categorySlugs: data.categories.map((category) => category.value),
    };

    // console.log(transformedData);

    addSubCategory.mutate(transformedData, {
      onSuccess: () => {
        toast.success('Subcategory added successfully!');
        query.invalidateQueries({ queryKey: ['subCategories'] });
        query.refetchQueries({ queryKey: ['subCategories'] });
        reset();
      },
      onError: (error) => {
        console.log('error', error);
        toast.error('Failed to add subcategory');
      },
    });
  };

  const onError: SubmitErrorHandler<CategoryTypes> = (errors) => {
    console.error('Form Errors:', errors);
    toast.error('Please correct the errors in the form.');
  };

  return (
    <React.Fragment>
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
          {props.buttonTitle}
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Subcategory</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your new Subcategory details.
            </AlertDialogDescription>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4 py-3"
            >
              <div>
                <Label htmlFor="category" className="text-base">
                  Category Name
                  <span className="text-destructive">*</span>
                </Label>

                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <MultipleSelector
                      {...field}
                      defaultOptions={OPTIONS}
                      placeholder="Select categories..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  )}
                />
                {errors.categories && (
                  <span className="text-destructive text-sm">
                    {errors.categories.message as React.ReactNode}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-start items-start gap-1">
                <Label htmlFor="name" className="text-base">
                  SubCategory Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Type Category Name"
                  className="mt-1"
                />
                {errors.name && (
                  <span className="text-destructive text-sm">
                    {errors.name.message as React.ReactNode}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col justify-start items-start gap-1">
                <Label htmlFor="description" className="text-base">
                  SubCategory Description
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Type Product Description"
                  className="mt-1"
                  rows={3}
                />
                {errors.description && (
                  <span className="text-destructive">
                    {errors.description.message as React.ReactNode}
                  </span>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="mt-3 flex flex-col justify-start items-start gap-1">
                <Label className="text-base" htmlFor="image">
                  Upload Image
                </Label>
                <ImageUploading
                  multiple={false}
                  value={watch('image') ? [{ data_url: watch('image') }] : []}
                  onChange={(imageList) => {
                    const image = imageList[0]?.data_url;
                    setValue('image', image); // Set the image to the form state
                  }}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload, isDragging, dragProps }) => (
                    <div className="upload__image-wrapper w-full">
                      <Button
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        type="button"
                        variant="outline"
                        className="w-full"
                        {...dragProps}
                      >
                        Click or Drop here
                      </Button>
                      {imageList.map((image, idx) => (
                        <div key={idx} className="image-item">
                          <img
                            src={image['data_url']}
                            alt="uploaded"
                            width="100"
                            className="rounded-lg object-cover mt-2 h-20 w-fit"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
                {errors.image && (
                  <span className="text-destructive">
                    {errors.image.message as React.ReactNode}
                  </span>
                )}
              </div>

              <div className="flex space-y-2 md:space-y-0 items-center justify-end">
                <AlertDialogCancel
                  type="reset"
                  onClick={() => {
                    reset();
                  }}
                  className="mr-2 h-9 rounded-md px-3"
                >
                  Cancel
                </AlertDialogCancel>
                <Button type="submit" className="mr-2 h-9 rounded-md px-3">
                  Create Subcategory
                </Button>
              </div>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default AddSubCategoryModal;
