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
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../../ui/textarea';
import { useCategories } from '@/hooks/useCategories';
import { useQueryClient } from '@tanstack/react-query';

type AddCategoryModalProps = {
  buttonTitle: string;
};

// Schema for form validation
const CategorySchema = z.object({
  name: z.string().min(1, 'Category Name is required'),
  description: z.string().min(1, 'Category Description is required'),
  image: z.any().optional(),
});

// TypeScript type inferred from the schema
type CategoryTypes = z.infer<typeof CategorySchema>;

const AddCategoryModal: React.FC<AddCategoryModalProps> = (props) => {
  const { addCategory } = useCategories();
  const query = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryTypes>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: null,
    },
  });

  const onSubmit: SubmitHandler<CategoryTypes> = (data) => {
    addCategory.mutate(
      {
        name: data.name.trim(),
        description: data.description.trim(),
        // image: data.image,
      },
      {
        onSuccess: () => {
          toast.success('Category added successfully!');
          query.invalidateQueries({ queryKey: ['categories'] });
          query.refetchQueries({ queryKey: ['categories'] });
          reset();
        },
        onError: (error) => {
          console.log('error', error);
          toast.error('Failed to add category');
        },
      },
    );
  };

  const onError: SubmitErrorHandler<CategoryTypes> = async (errors) => {
    for (const error of Object.values(errors)) {
      if (error.message) {
        toast.error('Please fill all the fields');
        break;
      }
    }
  };
  return (
    <React.Fragment>
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
          {props.buttonTitle}
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Category</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your new category details.
            </AlertDialogDescription>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4 py-3"
            >
              <div className="flex flex-col justify-start items-start gap-1">
                <Label htmlFor="name" className="text-base">
                  Category Name
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
                  Category Description
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
              {/* <div className="mt-3 flex flex-col justify-start items-start gap-1">
                <Label className="text-base" htmlFor="image">
                  Upload Image
                </Label>
                <Input
                  type="file"
                  id="image"
                  {...register('image')}
                  accept="image/*"
                  className="mt-1"
                />
                {errors.image && (
                  <span className="text-destructive">
                    {errors.image.message as React.ReactNode}
                  </span>
                )}
              </div> */}

              <div className=" flex space-y-2 md:space-y-0 items-center justify-end">
                <AlertDialogCancel
                  type="reset"
                  className="mr-2 h-9 rounded-md px-3"
                  disabled={addCategory.isPending}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={addCategory.isPending}
                  className="mr-2 h-9 rounded-md px-3"
                >
                  Create Category
                </Button>
              </div>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};
export default AddCategoryModal;
