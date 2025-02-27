import React from 'react';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeSelect = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState<boolean>(false);
  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  if (theme && theme == 'dark') {
    return (
      <React.Fragment>
        <Button variant="ghost" onClick={() => setTheme('light')} size="icon" className="h-4 w-4">
          <Moon />
          <span className="sr-only">Light mode</span>
        </Button>
      </React.Fragment>
    );
  }
  if (theme && theme == 'light') {
    return (
      <React.Fragment>
        <Button variant="ghost" onClick={() => setTheme('dark')} size="icon" className="h-4 w-4">
          <Sun />
          <span className="sr-only">Dark mode</span>
        </Button>
      </React.Fragment>
    );
  }
};

export default ThemeSelect;
