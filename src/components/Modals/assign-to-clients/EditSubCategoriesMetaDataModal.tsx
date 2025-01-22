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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSubCategories } from '@/hooks/useSubCategories';
import { PencilOff } from 'lucide-react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export type EditSubCategoriesMetaDataModalProps = {
  subcategorySlug: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const MetaDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type MetaDataForm = z.infer<typeof MetaDataSchema>;

const EditSubCategoriesMetaDataModal: React.FC<
  EditSubCategoriesMetaDataModalProps
> = ({
  subcategorySlug,
  title,
  description,
  children,
}) => {
  const { register, handleSubmit, reset } = useForm<MetaDataForm>({
    resolver: zodResolver(MetaDataSchema),
    defaultValues: { title, description },
  });

  const { updateSubCategoryMetadata } = useSubCategories();
  const [IsModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const query = useQueryClient();
  const { serialCode, categorySlug } = useParams();
  const onSubmit = async (data: MetaDataForm) => {
    updateSubCategoryMetadata.mutate(
      {
        serialCode: serialCode as string,
        subcatgrySlug: subcategorySlug as string,
        catgrySlug: categorySlug as string,
        metadata: {
          title: data.title,
          description: data.description,
        },
      },

      {
        onSuccess: () => {
          toast.success('Metadata updated successfully!');
          query.invalidateQueries({
            queryKey: ['subCategories', categorySlug, serialCode],
          });
          query.refetchQueries({
            queryKey: ['subCategories', categorySlug, serialCode],
          });
          reset();
          setIsModalOpen(false);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
              error.response.data.message || 'An error occurred';
            toast.error(`${errorMessage}`);
          } else {
            toast.error('An error occurred');
          }
        },
      },
    );
  };
  const onError: SubmitErrorHandler<MetaDataForm> = async (errors) => {
    for (const error of Object.values(errors)) {
      if (error.message) {
        toast.error('Please fill all the fields');
        break;
      }
    }
  };

  return (
    <AlertDialog open={IsModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <PencilOff className="mr-3 h-4 w-4" />
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit MetaData</AlertDialogTitle>
          <AlertDialogDescription>
            the metadata for this subcategory.
          </AlertDialogDescription>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Meta title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Meta description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <AlertDialogCancel
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="px-4 py-2"
              >
                Cancel
              </AlertDialogCancel>
              <Button type="submit" className="px-4 py-2">
                Save
              </Button>
            </div>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSubCategoriesMetaDataModal;
