import React from 'react';
import { z } from 'zod';
import { SubmitErrorHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import ImageUploading from 'react-images-uploading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

/* ---------------- SCHEMAS ---------------- */

const variantSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number({ required_error: 'Price is required' }),
  image: z.string(),
});

// The main schema for an array of attributes
const attributesSchema = z.object({
  attributes: z
    .array(variantSchema)
    .min(1, 'At least one attribute is required')
    // 1) First attribute must have a base64-encoded image
    .refine(
      (attributes) => {
        if (!attributes.length) return false;
        const firstImage = attributes[0].image;
        return (
          typeof firstImage === 'string' &&
          firstImage.trim() !== '' &&
          firstImage.startsWith('data:image/')
        );
      },
      {
        message: 'The first attribute must have a valid base64 image.',
        path: ['attributes', 0, 'image'],
      },
    )
    // 2) All SKUs must be unique across the array
    .refine(
      (attributes) => {
        const skus = attributes.map((attr) => attr.sku.trim().toLowerCase());
        return new Set(skus).size === skus.length;
      },
      {
        message: 'All SKUs must be unique.',
        path: ['attributes'], // applies to the entire attributes array
      },
    ),
});

type AttributesFormValues = z.infer<typeof attributesSchema>;

const AddNewAttributesInProduct: React.FC = () => {
  const { addNewAttributeToProduct } = useProducts();
  const { productSlug } = useParams();
  const query = useQueryClient();
  const {
    control,
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AttributesFormValues>({
    resolver: zodResolver(attributesSchema),
    defaultValues: {
      attributes: [
        { size: '', sku: '', price: 0, image: '' }, // one default attribute
      ],
    },
  });

  // Field array setup for "attributes"
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  // Store images for each attribute index
  const [attributeImages, setAttributeImages] = React.useState<{
    [key: number]: any[];
  }>({});

  // Convert the File to base64 and store it in RHF state
  const handleImageUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue(`attributes.${index}.image`, base64String);
    };
  };

  // React-Images-Uploading change handler
  const handleImagesChange = (imageList: any[], index: number) => {
    setAttributeImages((prev) => ({
      ...prev,
      [index]: imageList,
    }));

    if (imageList.length > 0 && imageList[0].file) {
      handleImageUpload(imageList[0].file, index);
    } else {
      // If no image is chosen and it's not the first attribute, clear the image
      if (index !== 0) {
        setValue(`attributes.${index}.image`, '');
      }
    }
  };

  const gatherErrors = (errObj: any, result: string[] = []): string[] => {
    for (const key in errObj) {
      if (errObj[key]?.message) {
        result.push(errObj[key].message);
      } else if (typeof errObj[key] === 'object') {
        gatherErrors(errObj[key], result);
      }
    }
    return result;
  };

  const onSubmit = (data: AttributesFormValues) => {
    addNewAttributeToProduct.mutate(
      {
        attribute: data.attributes,
        productSlug: productSlug as string,
      },
      {
        onSuccess: () => {
          toast.success('Product updated successfully!');
          reset();
          
        },
        onError: (error) => {
          console.error('Error adding product:', error);
          toast.error('Error adding product');
        },
      },
    );
    toast.success('Form data logged in console!');
  };

  const onError: SubmitErrorHandler<AttributesFormValues> = (formErrors) => {
    const allMessages = gatherErrors(formErrors);
    console.error('Validation Errors:', allMessages);
    allMessages.forEach((msg) => toast.error(msg));
  };

  const maxImages = 1; // Only 1 image per attribute

  /* ---------------- RENDER ---------------- */
  return (
    <div className="">
      <Label className="text-xl font-semibold">Add New Attributes</Label>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-5">
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg px-2 mt-2">
            <div className="pt-1 flex justify-end items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-3 grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 px-1">
              <div className="col-span-1">
                <Label>Image</Label>
                <div className="mt-2">
                  <ImageUploading
                    multiple={false}
                    value={attributeImages[index] || []}
                    onChange={(imageList) =>
                      handleImagesChange(imageList, index)
                    }
                    maxNumber={maxImages}
                    dataURLKey="data_url"
                  >
                    {({ imageList, onImageUpload, isDragging, dragProps }) => (
                      <div className="upload__image-wrapper">
                        <Button
                          style={isDragging ? { color: 'red' } : undefined}
                          onClick={onImageUpload}
                          type="button"
                          variant="outline"
                          className="w-full"
                          {...dragProps}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Click or Drop here
                        </Button>
                        {imageList.map((image, idx) => (
                          <div key={idx} className="image-item">
                            <img
                              src={image['data_url']}
                              alt=""
                              width="100"
                              className="rounded-lg object-cover mt-2 h-20 w-fit"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </ImageUploading>
                </div>
              </div>

              <div className="col-span-1">
                <Label>SKU</Label>
                <div className="mt-2">
                  <Input
                    placeholder="sku"
                    type="text"
                    autoComplete="sku"
                    {...register(`attributes.${index}.sku` as const)}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <Label>Size</Label>
                <div className="mt-2">
                  <Input
                    placeholder="size"
                    type="text"
                    autoComplete="size"
                    {...register(`attributes.${index}.size` as const)}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <Label>Price</Label>
                <div className="mt-2">
                  <Input
                    placeholder="price"
                    type="number"
                    step="0.01"
                    autoComplete="price"
                    {...register(`attributes.${index}.price` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Attribute Button */}
        <div className="mt-3 flex justify-center items-center">
          <Button
            variant="secondary"
            size="icon"
            type="button"
            onClick={() => append({ size: '', sku: '', price: 0, image: '' })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Submit Button */}
        <div className="mt-5 flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAttributesInProduct;
