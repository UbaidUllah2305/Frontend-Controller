import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CirclePlus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useClients } from '@/hooks/useClients';
import React from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useInView } from 'react-intersection-observer';

const Clients = () => {
  const { getClients } = useClients();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState<string>('');

  // Debounce the search input
  const [debouncedSearch] = useDebouncedValue(search, 200);
  // const { data: clients, isLoading } = useQuery({
  //   queryKey: ['clients', debouncedSearch],
  //   queryFn: getClients,
  // });

  const {
    data: clients,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['clients', debouncedSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getClients({
        page: pageParam,
        search: debouncedSearch,
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

  return (
    <div>
      <div>
        <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-3 md:space-y-0 justify-between md:items-center">
          <SearchInput
            search={search}
            setSearch={setSearch}
            isLoading={isLoading}
          />
          <div className="flex space-x-2">
            <Link to={'company/add-new-company'}>
              <Button
                variant={'expandIcon'}
                Icon={CirclePlus}
                className="w-full md:w-fit"
                iconPlacement="left"
                size={'sm'}
              >
                Add New Client
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <section className="mt-5 p-3">
        <Table>
          <TableHeader>
            <TableRow className=" ">
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Serial Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients &&
              clients.pages.flatMap((page) =>
                page.map((client) => (
                  <TableRow
                    key={client.serialCode}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      navigate(`company/profile/${client.serialCode}`);
                    }}
                  >
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={`/src/assets/avatars/${client.image}.png`}
                          alt={`${client.firstName} ${client.lastName}`}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.companyName}</TableCell>
                    <TableCell>{client.serialCode}</TableCell>
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
              <div role="status " className="flex justify-center items-center">
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
    </div>
  );
};

const SearchInput = ({
  search,
  setSearch,
  isLoading,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}) => {
  return (
    <div className="relative w-full md:w-[50%] lg:w-[30%] ">
      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
      <Input
        type="text"
        placeholder="Search Client..."
        className="pl-10 shadow-none"
        disabled={isLoading}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default Clients;
