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
import { useAppDispatch } from '@/store';
import { logoutUser } from '@/store/features/auth.slice';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const LogoutModal = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = async () => {
    setIsLoading(true);
    const response = await dispatch(logoutUser());

    if (response.meta.requestStatus === 'fulfilled') {
      navigate('/auth/login', {
        replace: true,
        state: {
          redirect: location.pathname,
        },
      });
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          {props.children}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={logout}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default LogoutModal;
