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
import { AlertCircle, Trash } from 'lucide-react';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { useCategories } from '@/hooks/useCategories';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type DeleteCategoryModalProps = {
  name: string;
  title: string;
  slug: string;
};

const DeleteCategoryModal = (props: DeleteCategoryModalProps) => {
  const { deleteCategory } = useCategories();
  const query = useQueryClient();
  const [RewriteCategory, setRewriteCategory] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleRewriteCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRewriteCategory(e.target.value);
  };

  const handleDeleteCategory = () => {
    setIsLoading(true);
    deleteCategory.mutate(props.slug, {
      onSuccess: () => {
        toast.success('Category deleted successfully!');
        setIsLoading(false);
        query.invalidateQueries({ queryKey: ['categories'] });
        query.refetchQueries({ queryKey: ['categories'] });
      },

      onError: (error) => {
        console.log(error);
        toast.error('Error while deleting this category!');
        setIsLoading(false);
      },
    });
  };

  React.useEffect(() => {
    if (RewriteCategory === props.name) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [RewriteCategory]);

  return (
    <React.Fragment>
      <AlertDialog>
        <AlertDialogTrigger
          className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground 
         data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        "
        >
          <Trash className="mr-2 h-4 w-4" />
          {props.title}
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border ">
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
              category{' '}
              <span className="text-base text-accent-foreground font-semibold underline underline-offset-2">
                {props.name}
              </span>{' '}
              and remove all the associated data from the clients profile.
            </AlertDialogDescription>
            <div className="mt-2 text-start space-y-2">
              <Label
                htmlFor="rewrite-category-name"
                id="rewrite-category-name"
                aria-labelledby="rewrite-category-name"
                aria-describedby="rewrite-category-name"
                aria-required="true"
                className="text-muted-foreground"
              >
                Category Name
              </Label>
              <Input
                value={RewriteCategory}
                onChange={handleRewriteCategory}
                id="rewrite-category-name-input"
                type="text"
                className="bg-background"
                aria-labelledby="rewrite-category-name-input"
                aria-describedby="rewrite-category-name-input"
                aria-required="true"
                aria-invalid="false"
                aria-autocomplete="list"
                aria-activedescendant="rewrite-category-name-input"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Category Name"
              />
              <Label className="text-muted-foreground/80 ">
                Rewrite category name to confirm deletion of category.
              </Label>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              disabled={!isValid || isLoading}
              onClick={handleDeleteCategory}
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

export default DeleteCategoryModal;
