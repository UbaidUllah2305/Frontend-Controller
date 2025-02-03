import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Label } from '../ui/label';
import {
  EllipsisVertical,
} from 'lucide-react';
import DeleteCategoryModal from '../Modals/categories/DeleteCategoryModal';
import EditCategoryModal from '../Modals/categories/EditCategoryModal';

export type EachCategoryCardProps = {
  name: string;
  description: string;
  image: string;
  slug: string;
  index: number;
  count: number;
};
const EachCategoryCard = (props: EachCategoryCardProps) => {

  return (
    <React.Fragment>
      <Card className="shadow-none border border-border">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <Label className="text-base">{props.name}</Label>
            <Menubar className="border-none shadow-none -p-10">
              <MenubarMenu>
                <MenubarTrigger className="border-none ">
                  <EllipsisVertical className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent className="border border-border flex flex-col gap-1">
                  {/* Edit Category */}
                  <EditCategoryModal
                    slug={props.slug}
                    name={props.name}
                    description={props.description}
                    buttonTitle="Edit Category"
                    image={props.image}
                  />

                  {/* Delete Category */}
                  <DeleteCategoryModal
                    name={props.name}
                    slug={props.slug}
                    title="Delete"
                  />
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </CardTitle>
          <CardDescription>
            {props.count} Subcategories available
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="line-clamp-2">{props.description}</p>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default EachCategoryCard;
