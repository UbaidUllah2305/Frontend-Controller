import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Info, Trash2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function EditAttributes() {
  const { getProductBySlug, deleteAttributeFromProduct } = useProducts();
  const queryClient = useQueryClient();
  const { productSlug } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['singleProduct', productSlug],
    queryFn: () => getProductBySlug(productSlug as string),
    enabled: !!productSlug,
  });

  const [attributes, setAttributes] = useState<any[]>([]);

  useEffect(() => {
    if (product && Array.isArray(product.attributes)) {
      setAttributes(product.attributes);
    }
  }, [product]);

  if (isLoading) return <div>Loading product...</div>;
  if (isError || !product) return <div>No product found.</div>;

  const handleDelete = async (sku: string) => {
    if (!sku) return;

    try {
      deleteAttributeFromProduct.mutate(
        {
          sku,
          productSlug: productSlug as string,
        },
        {
          onSuccess: () => {
            toast.success('Attribute deleted successfully');
            queryClient.invalidateQueries({
              queryKey: ['singleProduct', productSlug],
            });
            queryClient.refetchQueries({
              queryKey: ['singleProduct', productSlug],
            });
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || 'Failed to delete attribute',
            );
          },
        },
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to delete attribute',
      );
    }
  };

  return (
    <>
      <Label className="text-xl font-semibold">Product Variants</Label>
      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          You can only delete attributes here, except for the first attribute.
        </AlertDescription>
      </Alert>

      {attributes.map((attr, index) => (
        <div key={attr.id} className="border rounded-lg px-2 mt-2">
          <div className="pt-1 flex justify-end items-center gap-2">
            {/* Only show delete button if this is not the first attribute */}
            {index !== 0 && (
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => handleDelete(attr.sku)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="mb-3 grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 px-1">
            <div className="col-span-1">
              <Label>Image</Label>
              <div className="mt-2">
                {attr.image && (
                  <img
                    src={`${import.meta.env.VITE_UPLOADS_URL}${attr.image}`}
                    alt="Attribute"
                    className="w-24 h-24 object-cover mt-2 rounded"
                  />
                )}
              </div>
            </div>
            <div className="col-span-1">
              <Label>SKU</Label>
              <div className="mt-2">{attr.sku}</div>
            </div>
            <div className="col-span-1">
              <Label>Size</Label>
              <div className="mt-2">{attr.size}</div>
            </div>
            <div className="col-span-1">
              <Label>Price</Label>
              <div className="mt-2">{attr.price}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
