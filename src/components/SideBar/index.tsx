import { Outlet } from 'react-router-dom';
import ThemeSelect from '../Select/Theme-Select';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Inbox } from 'lucide-react';
import { Label } from '../ui/label';
import NotificationsSheet from '../Sheet/Notifications';
import { useLocation } from 'react-router-dom';

const SideBar = () => {
  const { pathname } = useLocation();
  let firstIndex = pathname.split('/')[1] || 'dashboard';
  firstIndex = firstIndex.charAt(0).toUpperCase() + firstIndex.slice(1);
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background z-40">
            <div className="flex flex-1 justify-between items-center gap-2 px-3">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Label className="line-clamp-1">{firstIndex}</Label>
              </div>
              <div className="flex items-center gap-3">
                <Separator orientation="vertical" className="ml-2 h-4" />
                <NotificationsSheet />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 relative inline-flex"
                >
                  <Inbox />
                  <span className="sr-only">Inbox</span>
                </Button>
                <ThemeSelect />
              </div>
            </div>
          </header>
          <div className="p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default SideBar;
