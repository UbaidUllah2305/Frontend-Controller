import AssignCategoriesModal from '@/components/Modals/assign-to-clients/AssignCategoriesModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/useClients';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EllipsisVertical,
  Eye,
  PencilOff,
  Settings,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DeleteCategoriesModal from '@/components/Modals/assign-to-clients/DeleteCategoriesModal';
import EditAssignCategoriesModal from '@/components/Modals/assign-to-clients/EditAssignCategoriesModal';
import { Badge } from '@/components/ui/badge';

const CompanyProfile = () => {
  const { serialCode } = useParams();
  const { getCompanyProfile } = useClients();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['company', serialCode],
    queryFn: () => getCompanyProfile(serialCode),
  });

  if (isLoading) return <div></div>;
  if (isError) return <div>Error Occurred</div>;

  if (profile) {
    return (
      <main className="space-y-5">
        <div className="flex flex-col-reverse md:flex-row gap-4 justify-between items-start md:items-center">
          <Label className="text-lg md:text-xl font-semibold">
            {profile.firstName} {profile.lastName}
          </Label>
          <div className="flex gap-2">
            <AssignCategoriesModal buttonTitle="Assign Categories" />
            <Link to={'edit/profile'}>
              <Button
                variant={'default'}
                size={'sm'}
                className="w-full md:w-fit"
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <Label className="text-lg">Company Categories</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 mt-4 ">
            {profile.userCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Label className="text-lg">{category.category.name}</Label>
                    <DropdownMenu key={categoryIndex}>
                      <DropdownMenuTrigger className="">
                        <Settings className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>MetaData Setting</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <EditAssignCategoriesModal
                            categorySlug={category.category.slug}
                          >
                            Edit Data
                          </EditAssignCategoriesModal>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate(
                              `client-sub-categories/${category.category.slug}`,
                            );
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Sub Categories
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <DeleteCategoriesModal
                            buttonTitle="Delete Relation"
                            serialCode={profile.serialCode}
                            categorySlug={category.category.slug}
                          >
                            Delete Relation
                          </DeleteCategoriesModal>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription className="line-clamp-7">
                    <p className="text-base">{category.category.description}</p>
                    <div className="py-3">
                      <Badge variant="secondary" className="mb-1">
                        Title
                      </Badge>
                      <p className="text-base">{category.metadata.title}</p>
                    </div>
                    <div className="py-3">
                      <Badge variant="secondary" className="mb-1">
                        Description
                      </Badge>
                      <p className="text-base">
                        {category.metadata.description}
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }
};

export default CompanyProfile;
