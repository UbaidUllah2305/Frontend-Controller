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
import { useMarketers } from '@/hooks/useMarketers';
const DeleteMarketer: React.FC<{
  FirstName: string;
  email: string;
}> = ({ FirstName, email }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false); // Track modal open state
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const query = useQueryClient();
  const { deleteMarketer } = useMarketers();

  const handleDeleteMarketer = () => {
    deleteMarketer.mutate(email, {
      onSuccess: () => {
        toast.success('Marketer deleted successfully!');
        query.invalidateQueries({ queryKey: ['marketers'] });
        query.refetchQueries({ queryKey: ['marketers'] });
        setIsLoading(false);
        setIsOpen(false); // Close the modal after successful deletion
      },
      onError: () => {
        toast.error('Error while deleting this marketer!');
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
              and remove all the associated data from this marketer profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              disabled={isLoading}
              onClick={handleDeleteMarketer}
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

export default DeleteMarketer;
