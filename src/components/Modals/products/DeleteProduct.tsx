import { useProducts } from '@/hooks/useProducts';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
const DeleteProduct: React.FC<{
  productSlug: string;
  productTitle: string;
  debouncedSearch: string;
}> = ({ productSlug, productTitle, debouncedSearch }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false); // Track modal open state
  const query = useQueryClient();
  const { deleteProductByProductSlug } = useProducts();
  const handleDeleteProduct = () => {
    setIsLoading(true);
    deleteProductByProductSlug.mutate(productSlug, {
      onSuccess: () => {
        toast.success('Product deleted successfully!');
        query.invalidateQueries({ queryKey: ['products', debouncedSearch] });
        query.refetchQueries({ queryKey: ['products', debouncedSearch] });
        setIsLoading(false);
        setIsOpen(false); // Close the modal after successful deletion
      },
      onError: (error) => {
        console.log(error);
        toast.error('Error while deleting this product!');
        setIsLoading(false);
      },
    });
  };
  return (
    <React.Fragment>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger
          className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground 
     data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:text-red-500
    "
          onClick={() => setIsOpen(true)}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              <Alert className="border-border bg-destructive mb-3">
                <AlertTitle className="text-accent dark:text-destructive-foreground text-start">
                  Warning
                </AlertTitle>
                <AlertDescription className="text-accent dark:text-destructive-foreground text-start">
                  Unexpected bad things will happen if you don’t read this!
                </AlertDescription>
              </Alert>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              This action cannot be undone. This will permanently delete this
              product{' '}
              <span className="text-base text-accent-foreground font-semibold underline underline-offset-2">
                {productTitle}
              </span>{' '}
              and remove all the associated attributes from this product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              disabled={isLoading}
              onClick={handleDeleteProduct}
              variant="destructive"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default DeleteProduct;
