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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useParams } from 'react-router-dom';
import axios from 'axios';

type AssignCategoriesModalTypes = {
  buttonTitle: string;
};

// Schema for form validation
const CategoryMeteDataSchema = z.object({
  categorySlug: z.string().min(1, 'Category Name is required'),
  description: z.string().min(1, 'Description is required'),
  title: z.string().min(1, 'Title is required'),
});

// TypeScript type inferred from the schema
type CategoryMetaDataTypes = z.infer<typeof CategoryMeteDataSchema>;

const AssignCategoriesModal: React.FC<AssignCategoriesModalTypes> = (props) => {
  const { getAllCategories, assignCategoryToClient } = useCategories();
  const { serialCode } = useParams();
  const queryClient = useQueryClient();
  const { data: Categories } = useQuery({
    queryKey: ['categories', serialCode],
    queryFn: getAllCategories,
  });
  const [open, setOpen] = React.useState<boolean>(false);
  const [ModalOpen, setModalOpen] = React.useState<boolean>(false);
  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<CategoryMetaDataTypes>({
      resolver: zodResolver(CategoryMeteDataSchema),
    });

  const onSubmit: SubmitHandler<CategoryMetaDataTypes> = (data) => {
    assignCategoryToClient.mutate(
      {
        serialCode: serialCode as string,
        categorySlug: data.categorySlug,
        title: data.title.trim(),
        description: data.description.trim(),
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
          setModalOpen(false);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            console.log(error);
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
  if (Categories && serialCode) {
    return (
      <React.Fragment>
        <AlertDialog open={ModalOpen} onOpenChange={setModalOpen}>
          <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3">
            <div onClick={() => setModalOpen(true)}>{props.buttonTitle}</div>
          </AlertDialogTrigger>
          <AlertDialogContent className="border border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-start">
                Assign Category
              </AlertDialogTitle>
              <AlertDialogDescription className="text-start">
                Here you have to select the categories you want to assign to
                this company. Once the categories are selected, you can set the
                metadata for the categories. It takes a few hours to reflect the
                changes on their sites.
              </AlertDialogDescription>
              <form
                className="space-y-4 py-3"
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="flex flex-col justify-start items-start gap-1">
                  <Label htmlFor="name">Category</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="mt-1">
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full h-9 justify-between text-muted-foreground"
                      >
                        {getValues('categorySlug')
                          ? Categories.find(
                              (category) =>
                                category.slug === getValues('categorySlug'),
                            )?.name
                          : 'Select a category...'}
                        <ChevronsUpDown className="opacity-50 w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[380px] p-0 border border-border"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search Category..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {Categories.map((category) => (
                              <CommandItem
                                key={category.slug}
                                value={category.slug}
                                onSelect={(currentValue) => {
                                  setValue('categorySlug', currentValue);
                                  setOpen(false);
                                }}
                              >
                                {category.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    getValues('categorySlug') === category.slug
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col justify-start items-start gap-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Type Meta Title"
                    className="mt-1"
                  />
                </div>
                <div className="mt-3 flex flex-col justify-start items-start gap-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Type Meta Description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className=" flex space-y-2 md:space-y-0 items-center justify-end">
                  <AlertDialogCancel
                    type="reset"
                    onClick={() => {
                      reset();
                      setModalOpen(false);
                    }}
                    className="mr-2 h-9 rounded-md px-3"
                    disabled={assignCategoryToClient.isPending}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    type="submit"
                    className="mr-2 h-9 rounded-md px-3"
                    disabled={assignCategoryToClient.isPending}
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
  }
};

export default AssignCategoriesModal;
