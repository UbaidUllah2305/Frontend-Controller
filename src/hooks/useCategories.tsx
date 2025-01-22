import { axiosInstance } from '@/lib/axios';
import { Category } from '@/types/Responses/Categories';
import ApiWrapper from '@/utils/ApiWrapper';
import { useMutation } from '@tanstack/react-query';

export function useCategories() {
  // Function to get all categories
  const getAllCategories = ApiWrapper<Category[]>(
    async (): Promise<Category[]> => {
      const { data } = await axiosInstance.get('/categories');
      return data.data;
    },
  );
  // Function to add a new category
  const addCategory = useMutation({
    mutationFn: async (category: {
      name: string;
      description: string;
      // image: File | null;
    }) => {
      const { data } = await axiosInstance.post(
        '/categories/add-category',
        category,
      );
      return data.data;
    },
  });

  // Function to delete a category with a category slug
  const deleteCategory = useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await axiosInstance.delete(
        `/categories/delete-category/${slug}`,
      );
      return data.data;
    },
  });
  // Functions to Edit a category
  const editCategory = useMutation({
    mutationFn: async (category: {
      name: string;
      description: string;
      slug: string;
      image: string;
    }) => {
      const { data } = await axiosInstance.put(
        `/categories/edit-category/${category.slug}`,
        category,
      );
      return data.data;
    },
  });
  // Function to assign the category to a client with the metadata
  const assignCategoryToClient = useMutation({
    mutationFn: async (payload: {
      categorySlug: string;
      description: string;
      title: string;
      serialCode: string;
    }) => {
      const { data } = await axiosInstance.post(
        '/usrCategory/assign-category',
        {
          catgrySlug: payload.categorySlug,
          serialCode: payload.serialCode,
          metadata: {
            title: payload.title,
            description: payload.description,
          },
        },
      );
      return data;
    },
  });
  // Function to delete the relation of the metadata from the category and the delete the metadata
  const UnAssignCategoryFromClient = useMutation({
    mutationFn: async (props: { serialCode: string; categorySlug: string }) => {
      const { data } = await axiosInstance.delete(
        `/usrCategory/delete/${props.serialCode}/${props.categorySlug}`,
      );
      return data.data;
    },
  });
  // Function to Edit the metadata of the category
  const editCategoryMetadata = useMutation({
    mutationFn: async (payload: {
      serialCode: string;
      categorySlug: string;
      metadata: {
        title: string;
        description: string;
      };
    }) => {
      const { data } = await axiosInstance.put(`/usrCategory/edit`, {
        ...payload,
        catgrySlug: payload.categorySlug,
      });
      return data.data;
    },
  });

  

  return {
    getAllCategories,
    deleteCategory,
    addCategory,
    editCategory,
    assignCategoryToClient,
    UnAssignCategoryFromClient,
    editCategoryMetadata,
  };
}
