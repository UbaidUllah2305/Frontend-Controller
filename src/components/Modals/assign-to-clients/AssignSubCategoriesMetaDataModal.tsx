import React, { useState } from 'react';
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
import { FlipVertical } from 'lucide-react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

export type AssignSubCategoriesMetaDataModalProps = {
  categorySlug: string;
  subcategorySlug: string;
  serialCode: string | null;
  children: React.ReactNode;
};

const MetaDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type MetaDataForm = z.infer<typeof MetaDataSchema>;

const AssignSubCategoriesMetaDataModal: React.FC<
  AssignSubCategoriesMetaDataModalProps
> = ({ subcategorySlug, categorySlug, serialCode, children }) => {
  const { register, handleSubmit, reset } = useForm<MetaDataForm>({
    resolver: zodResolver(MetaDataSchema),
  });

  const { assignSubCategoryMetadata } = useSubCategories();
  const query = useQueryClient();

  const [ModalOpen, setModalOpen] = useState<boolean>(false);

  const onSubmit = async (data: MetaDataForm) => {
    assignSubCategoryMetadata.mutate(
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
          query.invalidateQueries({ queryKey: ['subCategories', categorySlug, serialCode], });
          query.refetchQueries({ queryKey: ['subCategories', categorySlug, serialCode], });
          reset({
            title: data.title,
            description: data.description,
          });
          setModalOpen(false);
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
    <AlertDialog open={ModalOpen} onOpenChange={setModalOpen}>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <FlipVertical className="mr-2 h-4 w-4" />
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Assign Metadata to this Sub Category
          </AlertDialogTitle>
          <AlertDialogDescription>
            Assign metadata to this subcategory. This metadata will be used for
            SEO purposes and will be displayed on the subcategory page.
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
                type="button"
                className="px-4 py-2"
                onClick={() => {
                  setModalOpen(false);
                }}
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

export default AssignSubCategoriesMetaDataModal;
