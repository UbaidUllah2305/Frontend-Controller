import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EllipsisVertical, FlipVertical, Search } from 'lucide-react';
import React from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import AssignMetaDataToProduct from '@/components/Modals/assign-to-clients/products/AssignMetaDataToProduct';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useProducts } from '@/hooks/useProducts';
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import EditMetaDataToProduct from '@/components/Modals/assign-to-clients/products/EditMetaDataToProduct';

type SearchFilterType = {
  search: string;
  isMetaAdded: boolean;
};

const SubCategoryMetaProducts = () => {
  const { serialCode, categorySlug, subcategorySlug } = useParams();
  const [SearchFilters, setSearchFilters] = React.useState<SearchFilterType>({
    search: '',
    isMetaAdded: false,
  });
  const [debouncedSearch] = useDebouncedValue(SearchFilters.search, 200);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters({ ...SearchFilters, search: e.target.value });
  };

  const { getProductsBySubCategorySlugBySerialCode } = useProducts();

  const {
    data: AllProducts,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'products',
      debouncedSearch,
      serialCode,
      subcategorySlug,
      SearchFilters.isMetaAdded,
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getProductsBySubCategorySlugBySerialCode({
        subCategorySlug: subcategorySlug,
        serialCode: serialCode,
        search: debouncedSearch,
        isMetaAdded: SearchFilters.isMetaAdded,
        page: pageParam,
      }),

    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      // console.log(pages.length);
      return pages.length + 1;
    },
  });

  // Intersection observer to detect when a component comes into view
  const { ref, inView } = useInView();

  const loadMore = () => {
    if (hasNextPage && inView && !isFetching) {
      // console.log("load more");
      fetchNextPage();
    }
  };

  React.useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (!isError) {
    return (
      <React.Fragment>
        <div>
          <Label className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-0">
            Meta Products
          </Label>
          <p className="font-normal text-secondary-foreground dark:text-muted-foreground mb-4 sm:mb-0">
            All the products of this sub category are shown here. You can assign
            the metadata of the products here.
          </p>
        </div>
        <section className="mt-5">
          <div className="flex gap-3">
            <div className="relative w-4/5 lg:w-2/4 2xl:w-1/3 mb-3">
              <Search className="w-5 h-8 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              <Input
                type="text"
                onChange={handleSearch}
                value={SearchFilters.search}
                placeholder="Search Product..."
                className="pl-10 h-10"
              />
            </div>
            <Select
              defaultValue="unassigned"
              onValueChange={(value) => {
                if (value === 'assigned') {
                  setSearchFilters({ ...SearchFilters, isMetaAdded: true });
                } else {
                  setSearchFilters({ ...SearchFilters, isMetaAdded: false });
                }
              }}
            >
              <SelectTrigger className="w-fit gap-5 h-10">
                <SelectValue placeholder="unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader className="">
              <TableRow className="bg-secondary">
                <TableHead className="text-start w-[100px] ">Image</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="gap-2 hover:bg-none focus:bg-none">
              {AllProducts &&
                AllProducts.pages.flatMap((page) =>
                  page.map((product) => (
                    <TableRow className="" key={product.slug}>
                      <TableCell>
                        <img
                          className="h-16 rounded-sm object-cover"
                          src={
                            'https://medinven.api.artemamed.com/medinven/uploads/Product/Universal_Handle_for_laryngeal_forceps_acc_to_Huber/026-0581-01.jpeg'
                          }
                          alt="product image"
                        />
                      </TableCell>
                      <TableCell className="text-center text-secondary-foreground dark:text-muted-foreground">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-center text-secondary-foreground dark:text-muted-foreground">
                        {product.title}
                      </TableCell>
                      <TableCell className="text-center text-secondary-foreground dark:text-muted-foreground">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Metadata Setting
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              {product.metadata ? (
                                <EditMetaDataToProduct
                                  productSlug={product.slug}
                                  debouncedSearch={debouncedSearch}
                                  isMetaAdded={SearchFilters.isMetaAdded}
                                  title={product.metadata.title}
                                  description={product.metadata.description}
                                >
                                  Edit
                                </EditMetaDataToProduct>
                              ) : (
                                <AssignMetaDataToProduct
                                  productSlug={product.slug}
                                  debouncedSearch={debouncedSearch}
                                  isMetaAdded={SearchFilters.isMetaAdded}
                                >
                                  Assign
                                </AssignMetaDataToProduct>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )),
                )}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center mt-5">
            <button
              ref={ref}
              disabled={!hasNextPage || isFetchingNextPage}
              className="flex justify-center items-center"
            >
              {isFetchingNextPage ? (
                <div
                  role="status "
                  className="flex justify-center items-center"
                >
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : hasNextPage ? (
                ''
              ) : (
                ''
              )}
            </button>
          </div>
        </section>
      </React.Fragment>
    );
  }
};

export default SubCategoryMetaProducts;
