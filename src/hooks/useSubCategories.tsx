import { axiosInstance } from '@/lib/axios';
import { Category } from '@/types/Responses/Categories';
import { SubCategory, SubCategoryBySerialCode } from '@/types/Responses/SubCategories';
import ApiWrapper from '@/utils/ApiWrapper';
import { useMutation } from '@tanstack/react-query';

export function useSubCategories() {
  // Function to get all subcategories
  const getAllSubCategories = ApiWrapper<SubCategory[]>(
    async (): Promise<SubCategory[]> => {
      const { data } = await axiosInstance.get('/sub-categories/get-all');
      return data.data;
    },
  );

  //Function to get  Associated Categories of a SubCategory By slug
  const getAssociatedCategories = ApiWrapper<SubCategory>(
    async (subCategorySlug: string): Promise<SubCategory> => {
      const { data } = await axiosInstance.get(
        `/sub-categories/get-assign-categories/${subCategorySlug}`,
      );
      return data.data;
    },
  );

  // Function to add a new subcategory to a category
  const addSubCategory = useMutation({
    mutationFn: async (subCategory: {
      name: string;
      description: string;
      image: string;
      categorySlugs: string[];
    }) => {
      const { data } = await axiosInstance.post(
        '/sub-categories/add',
        subCategory,
      );
      return data.data;
    },
  });

  // Function to delete a subcategory using its slug
  const deleteSubCategory = useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await axiosInstance.delete(
        `/sub-categories/delete-subcategory/${slug}`,
      );
      return data.data;
    },
  });

  // Function to edit a subcategory
  const editSubCategory = useMutation({
    mutationFn: async (subCategory: {
      name: string;
      description: string;
      slug: string;
      image: string;
      categorySlugs: string[];
    }) => {
      console.log('The subCategory is : ', subCategory);

      const { data } = await axiosInstance.put(
        'sub-categories/edit-subcategory',
        subCategory,
      );

      return data.data;
    },
  });

  const assignSubCategoryMetadata = useMutation({
    mutationFn: async (payload: {
      serialCode: string;
      subcatgrySlug: string;
      catgrySlug: string;
      metadata: {
        title: string;
        description: string;
      };
    }) => {
      const { data } = await axiosInstance.post(
        `user-sub-categories/assign-client-subcategory-metadata`,
        {
          ...payload,
        },
      );
      return data.data;
    },
  });

  // Function to assign a subcategory to a category
  // const assignSubCategoryToCategory = useMutation({
  //   mutationFn: async (payload: {
  //     subCategorySlug: string;
  //     categorySlug: string;
  //   }) => {
  //     const { data } = await axiosInstance.post(
  //       `user-sub-categories/assign-client-subcategory-metadata`,
  //       {
  //         subCategorySlug: payload.subCategorySlug,
  //         categorySlug: payload.categorySlug,
  //       },
  //     );
  //     return data.data;
  //   },
  // });

  //Function to Update SubCategory MetaData
  const updateSubCategoryMetadata = useMutation({
    mutationFn: async (payload: {
      serialCode: string;
      subcatgrySlug: string;
      catgrySlug: string;
      metadata: {
        title: string;
        description: string;
      };
    }) => {
      const { data } = await axiosInstance.put(
        `user-sub-categories/update-client-subcategory-metadata`,
        {
          ...payload,
        },
      );
      return data.data;
    },
  });

  // Function to unassign a subcategory from a category
  const unassignSubCategoryFromCategory = useMutation({
    mutationFn: async (payload: {
      subCategorySlug: string;
      categorySlug: string;
    }) => {
      const { data } = await axiosInstance.delete(
        `/subcategories/unassign-from-category/${payload.categorySlug}/${payload.subCategorySlug}`,
      );
      return data.data;
    },
  });

  //Function to get a subcategory by its slug
  const getSubCategoryBySlug = ApiWrapper<SubCategory[]>(
    async (slug: string): Promise<SubCategory[]> => {
      const { data } = await axiosInstance.get(
        `/sub-categories/get-subcategories/${slug}`,
      );
      return data.data;
    },
  );

  // function to get subcategories by category slug and company serial code to be used to add metadata
  // to the subcategories
  const getSubCategoryBySlugBySerialCode = ApiWrapper<SubCategoryBySerialCode[]>(
    async (categorySlug: string, serialCode: string): Promise<SubCategoryBySerialCode[]> => {
      const { data } = await axiosInstance.get(
        `/sub-categories/get-subcategories/${categorySlug}/${serialCode}`,
      );
      return data.data;
    },
  )

  return {
    getAllSubCategories,
    addSubCategory,
    deleteSubCategory,
    editSubCategory,
    // assignSubCategoryToCategory,
    unassignSubCategoryFromCategory,
    getSubCategoryBySlug,
    getAssociatedCategories,
    assignSubCategoryMetadata,
    updateSubCategoryMetadata,
    getSubCategoryBySlugBySerialCode,
  };
}
