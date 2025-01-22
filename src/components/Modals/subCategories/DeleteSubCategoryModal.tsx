import React from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useSubCategories } from '@/hooks/useSubCategories';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';

export type DeleteSubCategoryModalProps = {
  name: string;
  title: string;
  slug: string;
};

const DeleteSubCategoryModal = (props: DeleteSubCategoryModalProps) => {
  const { deleteSubCategory } = useSubCategories();
  const query = useQueryClient();
  const [RewriteSubCategory, setRewriteSubCategory] =
    React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false); // Track modal open state

  const handleRewriteSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewriteSubCategory(e.target.value);
  };

  const handleDeleteSubCategory = () => {
    setIsLoading(true);
    deleteSubCategory.mutate(props.slug, {
      onSuccess: () => {
        toast.success('Subcategory deleted successfully!');
        query.invalidateQueries({ queryKey: ['subCategories'] });
        query.refetchQueries({ queryKey: ['subCategories'] });
        setIsLoading(false);
        setIsOpen(false); // Close the modal after successful deletion
      },
      onError: (error) => {
        console.log(error);
        toast.error('Error while deleting this subcategory!');
        setIsLoading(false);
      },
    });
  };

  React.useEffect(() => {
    if (RewriteSubCategory === props.name) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [RewriteSubCategory]);

  return (
    <React.Fragment>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger
          className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground 
         data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        "
          onClick={() => setIsOpen(true)}
        >
          <Trash className="mr-2 h-4 w-4" />
          {props.title}
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
              Are you sure you want to delete {props.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              This action cannot be undone. This will permanently delete this
              subcategory{' '}
              <span className="text-base text-accent-foreground font-semibold underline underline-offset-2">
                {props.name}
              </span>{' '}
              and remove all the associated data from the clients profile.
            </AlertDialogDescription>
            <div className="mt-2 text-start space-y-2">
              <Label
                htmlFor="rewrite-subcategory-name"
                id="rewrite-subcategory-name"
                aria-labelledby="rewrite-subcategory-name"
                aria-describedby="rewrite-subcategory-name"
                aria-required="true"
                className="text-muted-foreground"
              >
                Subcategory Name
              </Label>
              <Input
                value={RewriteSubCategory}
                onChange={handleRewriteSubCategory}
                id="rewrite-subcategory-name-input"
                type="text"
                className="bg-background"
                aria-labelledby="rewrite-subcategory-name-input"
                aria-describedby="rewrite-subcategory-name-input"
                aria-required="true"
                aria-invalid="false"
                aria-autocomplete="list"
                aria-activedescendant="rewrite-subcategory-name-input"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Subcategory Name"
              />
              <Label className="text-muted-foreground/80">
                Rewrite subcategory name to confirm deletion of subcategory.
              </Label>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              disabled={!isValid || isLoading}
              onClick={handleDeleteSubCategory}
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

export default DeleteSubCategoryModal;
