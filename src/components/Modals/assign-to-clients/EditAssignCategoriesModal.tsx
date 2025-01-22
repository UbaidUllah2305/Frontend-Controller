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
import { useParams } from 'react-router-dom';
import axios from 'axios';

export type EditAssignCategoriesModalProps = {
  categorySlug: string;
  children: React.ReactNode;
};

// Schema for form validation
const CategoryMeteDataSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  title: z.string().min(1, 'Title is required'),
});

// TypeScript type inferred from the schema
type CategoryMetaDataTypes = z.infer<typeof CategoryMeteDataSchema>;

const EditAssignCategoriesModal: React.FC<EditAssignCategoriesModalProps> = ({
  categorySlug,
  children,
}) => {
  const { editCategoryMetadata } = useCategories();
  const { serialCode } = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<CategoryMetaDataTypes>({
    resolver: zodResolver(CategoryMeteDataSchema),
  });

  const onSubmit: SubmitHandler<CategoryMetaDataTypes> = (data) => {
    editCategoryMetadata.mutate(
      {
        serialCode: serialCode as string,
        categorySlug,
        metadata: {
          title: data.title.trim(),
          description: data.description.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success('Category assigned successfully!');
          queryClient.invalidateQueries({
            queryKey: ['company', serialCode],
          });
          queryClient.refetchQueries({
            queryKey: ['company', serialCode],
          });
          reset();
          // Close the modal after successful submission
          setOpen(false);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            // Extract the message from the response
            const errorMessage =
              error.response.data.message || 'An error occurred';
            toast.error(`${errorMessage}`);
          } else {
            // Handle non-Axios errors
            toast.error(`${error.message}`);
          }
        },
      },
    );
  };

  const onError: SubmitErrorHandler<CategoryMetaDataTypes> = async (errors) => {
    for (const error of Object.values(errors)) {
      if (error.message) {
        toast.error('Please fill all the fields');
        break;
      }
    }
  };

  return (
    <React.Fragment>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <div
            onClick={() => setOpen(true)}
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <PencilOff className="mr-2 h-4 w-4" />
            {children}
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              Edit Assign Category Data
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              Edit the metadata for the category. This will be used to display on the 
              website. This data will help in SEO and other purposes.
            </AlertDialogDescription>
            <form
              className="space-y-4 py-3"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className="flex flex-col justify-start items-start gap-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter a meta title for the category here ..."
                  className="mt-1"
                />
              </div>
              <div className="mt-3 flex flex-col justify-start items-start gap-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter a meta description for the category here ..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className=" flex space-y-2 md:space-y-0 items-center justify-end">
                <AlertDialogCancel
                  type="reset"
                  onClick={() => {
                    reset();
                    setOpen(false);
                  }}
                  className="mr-2 h-9 rounded-md px-3"
                  disabled={editCategoryMetadata.isPending}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="mr-2 h-9 rounded-md px-3"
                  disabled={editCategoryMetadata.isPending}
                >
                  Submit
                </Button>
              </div>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};
export default EditAssignCategoriesModal;
