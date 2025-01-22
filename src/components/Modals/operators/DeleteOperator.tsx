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
import { Button } from '@/components/ui/button';
import { useOperators } from '@/hooks/useOperators';
const DeleteOperator: React.FC<{
  FirstName: string;
  email: string;
}> = ({ FirstName, email }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false); // Track modal open state
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const query = useQueryClient();
  const { deleteOperator } = useOperators();
  const handleDeleteOperator = () => {
    deleteOperator.mutate(email, {
      onSuccess: () => {
        toast.success('Operator deleted successfully!');
        query.invalidateQueries({ queryKey: ['operators'] });
        query.refetchQueries({ queryKey: ['operators'] });
        setIsLoading(false);
        setIsOpen(false); // Close the modal after successful deletion
      },
      onError: () => {
        toast.error('Error while deleting this operator!');
        setIsLoading(false);
        setIsOpen(false);
      },
    });
  };
  return (
    <React.Fragment>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger onClick={() => setIsOpen(true)}>
          <Trash className="mr-2 h-4 w-4" />
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              Are you sure you want to delete {FirstName} Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              This action cannot be undone. This will permanently delete this
              Account{' '}
              <span className="text-base text-accent-foreground font-semibold underline underline-offset-2"></span>{' '}
              and remove all the associated data from this operator profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              disabled={isLoading}
              onClick={handleDeleteOperator}
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

export default DeleteOperator;
