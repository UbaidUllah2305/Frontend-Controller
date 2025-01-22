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
import { PencilOff } from 'lucide-react';

type EditCategoryModalProps = {
  slug:string;
  name: string;
  description: string;
  image: string;
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

const EditCategoryModal: React.FC<EditCategoryModalProps> = (props) => {
  const query = useQueryClient();
  const { editCategory } = useCategories();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryTypes>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: props.name,
      description: props.description,
      image: props.image,
    },
  });

  const onSubmit: SubmitHandler<CategoryTypes> = (data) => {
    editCategory.mutate(
      {
        ...data,
        slug: props.slug,
        image: data.image || props.image,
      },
      {
        onSuccess: () => {
          toast.success('Category updated successfully!');
          query.invalidateQueries({ queryKey: ['categories'] });
          query.refetchQueries({ queryKey: ['categories'] });
          reset();
        },
        onError: () => {
          toast.error('Failed to update category');
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
        <AlertDialogTrigger
          className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground 
         data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <PencilOff className="mr-2 h-4 w-4" />
          {props.buttonTitle}
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>{props.buttonTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your new category details.
            </AlertDialogDescription>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4 py-3"
            >
              <div className="flex flex-col justify-start items-start gap-1">
                <Label htmlFor="name">
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
                <Label htmlFor="description">
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
                <Label htmlFor="image">Upload Image</Label>
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
                  disabled={editCategory.isPending}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={editCategory.isPending}
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

export default EditCategoryModal;
