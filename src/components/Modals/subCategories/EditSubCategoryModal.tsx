import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  Controller,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubCategories } from '@/hooks/useSubCategories';
import { useCategories } from '@/hooks/useCategories';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { PencilOff } from 'lucide-react';
import ImageUploading from 'react-images-uploading';

type EditSubCategoryModalProps = {
  name: string;
  description: string;
  image: string; // Current image URL from the backend
  slug: string;
  buttonTitle: string;
  // Initial categories associated with the subcategory
};

// Schema for form validation
const SubCategorySchema = z.object({
  name: z.string().min(1, 'Subcategory Name is required'),
  description: z.string().min(1, 'Subcategory Description is required'),
  image: z.any().optional(),
  categories: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, 'At least one category is required'),
});

// TypeScript type inferred from the schema
type SubCategoryTypes = z.infer<typeof SubCategorySchema>;

const EditSubCategoryModal: React.FC<EditSubCategoryModalProps> = (props) => {
  const { editSubCategory, getAssociatedCategories } = useSubCategories();
  const { getAllCategories } = useCategories();
  const query = useQueryClient();
  const [IsModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  // Fetch all categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  const { data: associatedCategories } = useQuery({
    queryKey: ['associatedCategories', props.slug],
    queryFn: () => getAssociatedCategories(props.slug),
  });

  const OPTIONS: Option[] =
    categories?.map((category) => ({
      label: category.name,
      value: category.slug,
    })) || [];

  const defaultAssociatedCategories: Option[] =
    (associatedCategories &&
      associatedCategories.categories.map((category) => ({
        label: category.name,
        value: category.slug,
      }))) ||
    [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<SubCategoryTypes>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: {
      name: props.name,
      description: props.description,
      categories: defaultAssociatedCategories,
    },
  });

  const onSubmit: SubmitHandler<SubCategoryTypes> = async (data) => {
    // Log the data to check what is being submitted

    // Check if the image is updated
    const transformedData = {
      slug: props.slug,
      name: data.name,
      description: data.description,
      // If the image is new, it will be included, otherwise use "old-image"
      image:
        data.image && data.image.includes('data:image')
          ? data.image
          : 'old-image',
      categorySlugs: data.categories.map((category) => category.value),
    };


    // Uncomment this to perform the mutation to update the subcategory
    editSubCategory.mutate(
      {
        ...transformedData,
        slug: props.slug,
      },
      {
        onSuccess: () => {
          toast.success('Subcategory updated successfully!');
          query.refetchQueries({ queryKey: ['subCategories'] });
          query.invalidateQueries({ queryKey: ['subCategories'] });
          reset();
          setIsModalOpen(false);
        },
        onError: () => {
          toast.error('Failed to update subcategory');
        },
      }
    );
  };

  const onError: SubmitErrorHandler<SubCategoryTypes> = async (errors) => {
    for (const error of Object.values(errors)) {
      if (error.message) {
        console.log(error.message);
        break;
      }
    }
  };

  return (
    <React.Fragment>
      <AlertDialog open={IsModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogTrigger
          className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground 
         data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <PencilOff className="mr-2 h-4 w-4" />
          {props.buttonTitle}
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Subcategory</AlertDialogTitle>
            <AlertDialogDescription>
              Edit the subcategory details below.
            </AlertDialogDescription>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4 py-3"
            >
              {/* Multiple Selector for Categories */}
              <div className="flex flex-col justify-start items-start gap-1">
                <Label htmlFor="categories">
                  Associated Categories
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <MultipleSelector
                      {...field}
                      defaultOptions={OPTIONS}
                      value={defaultAssociatedCategories}
                      placeholder="Select categories..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No results found.
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

              {/* Subcategory Name */}
              <div className="flex flex-col justify-start items-start gap-1">
                <Label htmlFor="name">
                  Subcategory Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Type Subcategory Name"
                  className="mt-1"
                />
                {errors.name && (
                  <span className="text-destructive text-sm">
                    {errors.name.message as React.ReactNode}
                  </span>
                )}
              </div>

              {/* Subcategory Description */}
              <div className="mt-3 flex flex-col justify-start items-start gap-1">
                <Label htmlFor="description">
                  Subcategory Description
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Type Subcategory Description"
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
                  <span className="text-destructive text-sm">
                    {errors.image.message as React.ReactNode}
                  </span>
                )}
                {props.image && (
                  <>
                    <Label className="text-base">Previous image</Label>
                    <img
                      src={`https://api.thefonehouse.com${props.image}`}
                      alt="uploaded"
                      width="100"
                      className="rounded-lg object-cover h-20 w-fit"
                    />
                  </>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end space-y-2 md:space-y-0">
                <AlertDialogCancel
                  type="reset"
                  className="mr-2 h-9 rounded-md px-3"
                  disabled={editSubCategory.isPending}
                  onClick={() => {
                    reset();
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={editSubCategory.isPending}
                  className="mr-2 h-9 rounded-md px-3"
                >
                  Update
                </Button>
              </div>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default EditSubCategoryModal;
