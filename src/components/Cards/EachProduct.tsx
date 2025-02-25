import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { shortProduct, storageAttribute } from '@/types/Responses/Products';
import DeleteProduct from '../Modals/products/DeleteProduct';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '../ui/menubar';

const EachProduct: React.FC<{
  product: shortProduct;
  debouncedSearch: string;
}> = (props) => {
  const [selectedStorage, setSelectedStorage] = useState<storageAttribute | null>(() => {
    return props.product.storage_attributes.length > 0
      ? props.product.storage_attributes[0]
      : null;
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    return props.product.color_attributes.length > 0
      ? props.product.color_attributes[0]
      : null;
  });

  // Helper function to find the image based on the selected color
  const findImage = () => {
    if (selectedColor) {
      return selectedColor.image;
    }
    return 'default-image-path.jpg';
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
            <MenubarContent className="" align="end">
              <DeleteProduct
                productSlug={props.product.slug}
                debouncedSearch={props.debouncedSearch}
                productTitle={props.product.title}
              />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* Display Subcategory Name */}
        {props.product.subcategories && props.product.subcategories.length > 0 && (
          <Label className="text-xs text-gray-500 px-3 pt-2">
            {props.product.subcategories[0].name}
          </Label>
        )}

        {/* Product Title */}
        <CardTitle className="mt-2 px-3 pb-2 text-xl font-semibold tracking-tight leading-none">
          {props.product.title}
        </CardTitle>

        <CardDescription className="px-3 pb-2 text-sm line-clamp-3 -pb-1">
          {props.product.short_description}
        </CardDescription>
        {selectedStorage && (
          <CardContent className="px-3 pb-4 h-full">
            <Label className="text-3xl flex justify-start items-center font-bold">
              £{selectedStorage.price}
            </Label>
            <Select
              onValueChange={(value) => {
                const storage = props.product.storage_attributes.find((attr) => attr.storage === value);
                if (storage) setSelectedStorage(storage);
              }}
            >
              <SelectTrigger className="mt-2 shadow-none">
                <SelectValue placeholder={`${selectedStorage.storage} GB`} />
              </SelectTrigger>
              <SelectContent>
                {props.product.storage_attributes.map((storage) => (
                  <SelectItem
                    key={storage.id}
                    value={storage.storage}
                    defaultChecked={storage.storage === selectedStorage.storage}
                  >
                    {`${storage.storage} GB`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                const color = props.product.color_attributes.find((attr) => attr.color === value);
                if (color) setSelectedColor(color);
              }}
            >
              <SelectTrigger className="mt-2 shadow-none">
                <SelectValue placeholder={selectedColor ? selectedColor.color : 'Select Color'} />
              </SelectTrigger>
              <SelectContent>
                {props.product.color_attributes.map((color) => (
                  <SelectItem
                    key={color.id}
                    value={color.color}
                    defaultChecked={color.color === selectedColor?.color}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-5 h-5 rounded-full mr-2"
                        style={{ backgroundColor: color.color }}
                      />
                      <span>{color.color}</span>
                    </div>
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