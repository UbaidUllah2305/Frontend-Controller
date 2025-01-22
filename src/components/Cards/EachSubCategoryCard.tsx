import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '../ui/label';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import EditSubCategoryModal from '../Modals/subCategories/EditSubCategoryModal';
import DeleteSubCategoryModal from '../Modals/subCategories/DeleteSubCategoryModal';
import { EllipsisVertical, SquareArrowOutUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useSubCategories } from '@/hooks/useSubCategories';

export type EachSubCategoryCardProps = {
  name: string;
  description: string;
  image: string;
  slug: string;
  index: number;
  serialCode: string;
};

const EachSubCategoryCard = (props: EachSubCategoryCardProps) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate('/catalog/products');
  };

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
                <MenubarContent className="border border-border" align="end">
                  {/* <MenubarItem onClick={handleViewProduct}>
                    <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                    View All Products
                  </MenubarItem> */}
                  <EditSubCategoryModal
                    slug={props.slug}
                    name={props.name}
                    description={props.description}
                    buttonTitle="Edit Category"
                    image={props.image}
                  />
                  <MenubarSeparator />
                  <DeleteSubCategoryModal
                    name={props.name}
                    slug={props.slug}
                    title="Delete"
                  />
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </CardTitle>
          <CardDescription>
            {/* 10 products are linked to this sub category */}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="line-clamp-2">{props.description}</p>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default EachSubCategoryCard;
