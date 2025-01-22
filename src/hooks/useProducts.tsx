import { axiosInstance } from '@/lib/axios';
import { ProductFormValues } from '@/pages/catalog/products/add-new-product';
import {
  productAttribute,
  productMetaData,
  shortProduct,
  SingleProduct,
} from '@/types/Responses/Products';
import ApiWrapper from '@/utils/ApiWrapper';
import { useMutation } from '@tanstack/react-query';

export function useProducts() {
  // Function to get all Products
  const getAllProducts = ApiWrapper<shortProduct[]>(
    async ({
      search = '',
      page = 1,
    }: {
      search: string;
      page: number;
    }): Promise<shortProduct[]> => {
      const encodedSearch = encodeURIComponent(search);
      const { data } = await axiosInstance.get(
        `/products?search=${encodedSearch}&page=${page}`,
      );
      return data.data;
    },
  );
  

  // Function to add a new product
  const addNewProduct = useMutation({
    mutationFn: async (product: ProductFormValues): Promise<shortProduct> => {
      const { data } = await axiosInstance.post(
        '/products/add-product',
        product,
      );
      return data.data;
    },
  });

  // Function to get a product by its slug
  const getProductBySlug = ApiWrapper<SingleProduct>(
    async (slug: string): Promise<SingleProduct> => {
      const { data } = await axiosInstance.get(
        `/products/get-single-product/${slug}`,
      );
      return data.data;
    },
  );

  // Function to delete the product by product slug
  const deleteProductByProductSlug = useMutation({
    mutationFn: async (productSlug: string): Promise<void> => {
      const { data } = await axiosInstance.delete(
        `/products/delete/${productSlug}`,
      );
      return data.data;
    },
  });

  // Function to get all the products by subcategory slug and company serial code
  // For the Meta data view
  const getProductsBySubCategorySlugBySerialCode = ApiWrapper<
    productMetaData[]
  >(
    async ({
      isMetaAdded,
      serialCode,
      subCategorySlug,
      search,
      page,
    }: {
      subCategorySlug: string;
      serialCode: string;
      search: string;
      isMetaAdded: boolean;
      page: number;
    }): Promise<productMetaData[]> => {
      const s = search.length > 0 ? `&search=${search}` : '';
      const { data } = await axiosInstance.get(
        `sub-categories/client-products/${subCategorySlug}/${serialCode}?limit20=&page=${page}&assigned=${isMetaAdded}${s}`,
      );
      return data.data;
    },
  );

  // Assign metadata to the product
  const assignMetaDataToProduct = useMutation({
    mutationFn: async ({
      productSlug,
      metadata,
      serialCode,
    }: {
      productSlug: string;
      serialCode: string;
      metadata: {
        title: string;
        description: string;
      };
    }): Promise<void> => {
      const { data } = await axiosInstance.post(
        `/products/add-product-metdata`,
        {
          slug: productSlug,
          serialCode: serialCode,
          metadata,
        },
      );
      return data.data;
    },
  });

  // Edit Assigned metadata to the product
  const EditMetaDataToProduct = useMutation({
    mutationFn: async ({
      productSlug,
      metadata,
      serialCode,
    }: {
      productSlug: string;
      serialCode: string;
      metadata: {
        title: string;
        description: string;
      };
    }): Promise<void> => {
      const { data } = await axiosInstance.put(
        `/products/edit-product-metdata`,
        {
          slug: productSlug,
          serialCode: serialCode,
          metadata,
        },
      );
      return data.data;
    },
  });

  // Function to update the product basic data
  const updateProductBasicData = useMutation({
    mutationFn: async ({
      productSlug,
      productData,
    }: {
      productSlug: string;
      productData: {
        name: string;
        title: string;
        description: string;
        subCategorySlugs: string[];
        attributes: productAttribute[];
      };
    }): Promise<void> => {
      const { data } = await axiosInstance.put(
        `/products/product/${productSlug}`,
        productData,
      );
      return data.data;
    },
  });

  // Delete particular attribute from the product
  const deleteAttributeFromProduct = useMutation({
    mutationFn: async ({
      productSlug,
      sku,
    }: {
      productSlug: string;
      sku: string;
    }): Promise<void> => {
      const { data } = await axiosInstance.delete(
        `/products/delete-attribute`,
        {
          data: {
            slug: productSlug,
            sku: sku,
          },
        },
      );
      return data.data;
    },
  });

  // Add new attribute to the product
  const addNewAttributeToProduct = useMutation({
    mutationFn: async ({
      productSlug,
      attribute,
    }: {
      productSlug: string;
      attribute: {
        sku: string;
        size: string;
        price: number;
        image: string;
      }[];
    }): Promise<void> => {
      const { data } = await axiosInstance.post(`/products/add-product-attribute`, {
        title: productSlug,
        attributes: attribute,
      });
      return data.data;
    },
  });

  return {
    getAllProducts,
    deleteProductByProductSlug,
    addNewProduct,
    getProductBySlug,
    updateProductBasicData,
    getProductsBySubCategorySlugBySerialCode,
    assignMetaDataToProduct,
    EditMetaDataToProduct,
    deleteAttributeFromProduct,
    addNewAttributeToProduct,
  };
}
