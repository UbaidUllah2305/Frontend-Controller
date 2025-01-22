import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { EllipsisVertical, PencilOff, PencilRuler, Plus } from 'lucide-react';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productAttribute, shortProduct } from '@/types/Responses/Products';
import { useNavigate } from 'react-router-dom';
import DeleteProduct from '../Modals/products/DeleteProduct';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../ui/menubar';

const EachProduct: React.FC<{
  product: shortProduct;
  debouncedSearch: string;
}> = (props) => {
  const [selectedAttribute, setSelectedAttribute] = useState<productAttribute | null>(() => {
    return props.product.attributes.length > 0
      ? props.product.attributes[0]
      : null;
  });

  const router = useNavigate();

  // Helper function to find the first available image
  const findImage = () => {
    if (selectedAttribute?.image) {
      return selectedAttribute.image;
    }
    const fallbackAttribute = props.product.attributes.find((attr) => attr.image);
    return fallbackAttribute ? fallbackAttribute.image : 'default-image-path.jpg';
  };

  return (
    <React.Fragment>
      <Card className="relative shadow-none border border-border">
        <img
          className="h-60 w-full rounded-t-lg object-contain p-1"
          src={`${import.meta.env.VITE_UPLOADS_URL}${findImage()}`}
          alt="product image"
        />
        <Menubar className="border-none shadow-none absolute top-0 right-0 translate-y-4 -translate-x-3">
          <MenubarMenu>
            <MenubarTrigger className="border-none">
              <EllipsisVertical className="h-4 w-4" />
            </MenubarTrigger>
            <MenubarContent className="border border-border" align="end">
              <MenubarItem
                onClick={() => {
                  router(`${props.product.slug}/edit-product`);
                }}
              >
                <PencilOff className="mr-2 h-4 w-4" />
                Edit Basic
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  router(`${props.product.slug}/add-new-attributes`);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Attributes
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  router(`${props.product.slug}/edit-attributes`);
                }}
              >
                <PencilRuler className="mr-2 h-4 w-4" />
                Edit Attributes
              </MenubarItem>
              <MenubarSeparator />
              <DeleteProduct
                productSlug={props.product.slug}
                debouncedSearch={props.debouncedSearch}
                productTitle={props.product.name}
              />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <CardTitle className="mt-4 px-3 pb-2 text-xl font-semibold tracking-tight leading-none">
          {props.product.name}
        </CardTitle>
        <CardDescription className="px-3 pb-2 text-sm line-clamp-1">
          {props.product.title}
        </CardDescription>
        {selectedAttribute && (
          <CardContent className="px-3 pb-4 h-full">
            <Label className="text-3xl flex justify-start items-center font-bold">
              ${selectedAttribute.price}
            </Label>
            <Select
              onValueChange={(value) => {
                const attribute = props.product.attributes.find((attr) => attr.sku === value);
                if (attribute) setSelectedAttribute(attribute);
              }}
            >
              <SelectTrigger className="mt-2 shadow-none">
                <SelectValue placeholder={`${selectedAttribute.sku}`} />
              </SelectTrigger>
              <SelectContent>
                {props.product.attributes.map((attribute) => (
                  <SelectItem
                    key={attribute.sku}
                    value={attribute.sku}
                    defaultChecked={attribute.sku === selectedAttribute.sku}
                  >
                    {`${attribute.sku}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        )}
        <CardFooter className="flex justify-between items-center px-3 pb-3"></CardFooter>
      </Card>
    </React.Fragment>
  );
};

export default EachProduct;
