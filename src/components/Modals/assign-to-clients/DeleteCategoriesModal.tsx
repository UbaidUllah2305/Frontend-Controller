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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { useCategories } from '@/hooks/useCategories';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

export type DeleteCategoriesModalProps = {
  buttonTitle: string;
  serialCode: string; // this is a serial code to refetch the data of the user company profile
  categorySlug: string;
  children: React.ReactNode;
};

const DeleteCategoriesModal: React.FC<DeleteCategoriesModalProps> = ({
  children,
  ...props
}) => {
  const { UnAssignCategoryFromClient } = useCategories();
  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const query = useQueryClient();
  const handleDeleteCategoryMetaData = () => {
    setisLoading(true);
    UnAssignCategoryFromClient.mutate(
      {
        categorySlug: props.categorySlug,
        serialCode: props.serialCode,
      },
      {
        onSuccess: () => {
          toast.success('Category deleted successfully!');
          query.invalidateQueries({ queryKey: ['company', props.serialCode] });
          query.refetchQueries({ queryKey: ['company', props.serialCode] });
          setisLoading(false);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
              error.response.data.message || 'An error occurred';
            toast.error(`${errorMessage}`);
          } else {
            toast.error(`${error.message}`);
          }
          setisLoading(false);
        },
      },
    );
  };
  return (
    <React.Fragment>
      <AlertDialog>
        <AlertDialogTrigger className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground  ">
          <Trash2 className=" mr-2 h-4 w-4 " />
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border ">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              <Alert className="border-border bg-destructive mb-3">
                <AlertTitle className="text-destructive-foreground text-start">
                  Warning
                </AlertTitle>
                <AlertDescription className="text-destructive-foreground text-start">
                  Unexpected bad things will happen if you don&apos;t read this!
                </AlertDescription>
              </Alert>
              Are you sure you want to delete this metadata of this category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              This action cannot be undone. This will permanently delete this
              category metadata and remove all the associated data from the
              clients category relation so they no longer get this metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDeleteCategoryMetaData}
              variant="destructive"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default DeleteCategoriesModal;
