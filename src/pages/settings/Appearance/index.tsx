import ThemeSelect from '@/components/Select/Theme-Select';
import { Label } from '@/components/ui/label';

const Appearance = () => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Label className="text-xl">Appearance</Label>
        <Label className="text-secondary-foreground/60 text-base">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </Label>
      </div>
      <div className="pt-10 flex flex-col gap-2">
        <Label className="text-xl font-medium">Theme</Label>
        <div className=" flex justify-between items-center text-base">
          <Label className="text-secondary-foreground/60">
            Select the theme for the dashboard.
          </Label>
          <ThemeSelect />
        </div>
      </div>
    </>
  );
};

export default Appearance;
