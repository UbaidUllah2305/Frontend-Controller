import AddNewMarketerModal from '@/components/Modals/marketer/AddNewMarketerModal';
import DeleteMarketer from '@/components/Modals/marketer/DeleteMarketer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMarketers } from '@/hooks/useMarketers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const MarketingUsers = () => {
  const { getMarketers } = useMarketers();
  const { data: allMarketers } = useQuery({
    queryKey: ['marketers'],
    queryFn: getMarketers,
  });
  return (
    <React.Fragment>
      <div className="flex justify-between items-center">
        <Label className="text-xl font-semibold">Marketers</Label>
        <AddNewMarketerModal />
      </div>
      <section className="mt-8 p-2">
        <Table>
          <TableHeader>
            <TableRow className=" ">
              <TableHead>Avatar</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allMarketers &&
              allMarketers.map((marketer, marketerKey) => {
                return (
                  <TableRow key={marketerKey}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={marketer.image}
                          alt={marketer.firstName}
                        />
                        <AvatarFallback>Image</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{marketer.firstName}</TableCell>
                    <TableCell>{marketer.lastName}</TableCell>
                    <TableCell>{marketer.gender}</TableCell>
                    <TableCell>{marketer.email}</TableCell>
                    <TableCell className="">
                      <DeleteMarketer
                        FirstName={marketer.firstName}
                        email={marketer.email}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </section>
    </React.Fragment>
  );
};

export default MarketingUsers;
