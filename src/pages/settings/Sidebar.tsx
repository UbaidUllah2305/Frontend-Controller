import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link, Outlet, useLocation } from 'react-router-dom';

const TabPages = [
  {
    title: 'Appearance',
    query: '',
    href: '/settings',
  },
  {
    title: 'Profile Changes',
    query: 'profile-changes',
    href: '/settings/profile-changes',
  },
];

const SettingsSidebar = () => {
  const { pathname } = useLocation();
  const split = pathname?.split('/');
  let lastIndex = split?.[split?.length - 1];
  if (lastIndex == 'settings') {
    lastIndex = '';
  }
  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-3 ">
        <div className=" grid w-full max-w-6xl gap-2">
          <Label className="text-2xl font-semibold">Settings</Label>
          <Label className="text-md text-secondary-foreground/60">
            Setting Portal Configuration
          </Label>
          <Separator className="text-secondary/80" />
        </div>
        <div className=" grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground border-r-[3px] border-secondary/80 px-1 lg:px-3">
            {TabPages.map((tab) => {
              return (
                <Link
                  to={tab.href}
                  key={tab.title}
                  className={` flex items-center group h-8 px-4 p-3 rounded-md text-sm font-medium ${
                    lastIndex == tab.query
                      ? 'border border-primary/20 bg-primary rounded-md text-primary-foreground'
                      : 'text-accent-accent dark:text-foreground/50'
                  }`}
                >
                  <Label
                    className={`p-3 ${
                      lastIndex == tab.query
                        ? ''
                        : 'group-hover:underline group-hover:underline-offset-2 hover:cursor-pointer '
                    }`}
                  >
                    {tab.title}
                  </Label>
                </Link>
              );
            })}
          </nav>
          <div className="grid gap-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsSidebar;
