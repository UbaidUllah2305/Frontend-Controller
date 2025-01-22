import AddNewOperatorModal from '@/components/Modals/operators/AddNewOperatorModal';
import DeleteOperator from '@/components/Modals/operators/DeleteOperator';
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
import { useOperators } from '@/hooks/useOperators';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const OperatorUsers = () => {
  const { getOperators } = useOperators();
  const { data: allOperators } = useQuery({
    queryKey: ['operators'],
    queryFn: getOperators,
  });
  return (
    <React.Fragment>
      <div className="flex justify-between items-center">
        <Label className="text-xl font-semibold">Operators</Label>
        <AddNewOperatorModal />
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
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOperators &&
              allOperators.map((operator, operatorKey) => {
                return (
                  <TableRow key={operatorKey}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={operator.image}
                          alt={operator.firstName}
                        />
                        <AvatarFallback>Image</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{operator.firstName}</TableCell>
                    <TableCell>{operator.lastName}</TableCell>
                    <TableCell>{operator.gender}</TableCell>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell className=''>
                      <DeleteOperator
                        FirstName={operator.firstName}
                        email={operator.email}
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

export default OperatorUsers;
