import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationsList from './notifications-list';

const NotificationsSheet = () => {
  return (
    <React.Fragment>
      <Sheet>
        <SheetTrigger className="h-7 w-7 relative inline-flex rounded-md  items-center justify-center gap-2 whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <div className="absolute inline-flex items-center justify-center text-center text-xs -top-0.5 -end-0.5">
            <span className="relative flex">
              <span className="inline-flex justify-center items-center rounded-full border w-3 h-3 text-center bg-red-500"></span>
            </span>
          </div>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </SheetTitle>
            <SheetDescription>You have 2 unread notifications</SheetDescription>
            <SheetClose asChild>
              <Button size={'sm'} variant={'default'} type="submit">
                <CheckCheck />
                Mark all as read
              </Button>
            </SheetClose>
            <div className="mb-3">
              <NotificationsList />
            </div>
          </SheetHeader>
          <SheetFooter className="mt-2"></SheetFooter>
        </SheetContent>
      </Sheet>
    </React.Fragment>
  );
};

export default NotificationsSheet;
