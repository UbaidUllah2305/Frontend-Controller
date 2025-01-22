import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Props type definition
type EditSubCategoryModalProps = {
  name: string;
  description: string;
  image: string;
  slug: string;
  buttonTitle: string;
};

const DialogDemo: React.FC<EditSubCategoryModalProps> = (props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            console.log(props);
          }}
          variant="outline"
        >
          {props.buttonTitle || 'Edit Profile'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subcategory</DialogTitle>
          <DialogDescription>
            Make changes to your subcategory here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={props.name}
              className="col-span-3"
              placeholder="Enter subcategory name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={props.description}
              className="col-span-3"
              placeholder="Enter subcategory description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDemo;
