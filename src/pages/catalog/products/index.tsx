import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { CirclePlus, Info, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import EachProduct from '@/components/Cards/EachProduct';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@mantine/hooks';
import { useProducts } from '@/hooks/useProducts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { shortProduct } from '@/types/Responses/Products';

type PaginatedResponse = shortProduct[];

const Products: React.FC = () => {
  const [search, setSearch] = React.useState<string>('');
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const { getAllProducts } = useProducts();

  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ['products', debouncedSearch],
    queryFn: async ({ pageParam = 1 }) =>
      getAllProducts({
        page: pageParam,
        search: debouncedSearch,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam: any) =>
      lastPage.length === 0 ? undefined : lastPageParam + 1,
    staleTime: 0,
    initialPageParam: 1,
  });

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (hasNextPage && inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <Label className="text-xl font-semibold">Products</Label>
      <Alert className="my-5 bg-blue-200 dark:bg-blue-800">
        <Info className=" h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          All the products are listed below. You can add a new product by
          clicking the add product button. You can also search or filter
          products by name or price.
        </AlertDescription>
      </Alert>
      <div className="bg-background sticky top-0 z-50 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-full flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
            <Input
              type="text"
              placeholder="Search Client..."
              className="pl-10 shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Link to="/catalog/products/add-new-product">
          <Button
            variant="expandIcon"
            Icon={CirclePlus}
            className="mt-10 sm:mt-0 w-full sm:w-auto md:w-fit"
            iconPlacement="left"
            size="sm"
          >
            Add Product
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
        {products?.pages.map((page) =>
          page.map((product: shortProduct) => (
            <EachProduct
              key={product.slug}
              product={product}
              debouncedSearch={debouncedSearch}
            />
          )),
        )}
      </div>
      <div className="flex justify-center items-center mt-5">
        <button
          ref={ref}
          disabled={!hasNextPage || isFetchingNextPage}
          className="flex justify-center items-center"
        >
          {isFetchingNextPage ? (
            <div role="status" className="flex justify-center items-center">
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
    </>
  );
};

export default Products;
