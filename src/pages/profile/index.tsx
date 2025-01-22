import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useLoggedUser } from '@/hooks/useLoggedUser';
import { UserAvatars } from '@/constants/Avatars';
const Profile = () => {
  const { UserProfile } = useLoggedUser();
  const { data } = useQuery({
    queryKey: ['LoggedUserProfile'],
    queryFn: UserProfile,
    refetchOnWindowFocus: false,
  });
  if (!data) return <div></div>;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex-none">
          <div className="h-32 lg:h-36 2xl:h-44 bg-primary rounded-lg" />
          <div className="relative -mt-16 flex justify-center">
            <div className="w-36 h-36 border-8 border-white bg-primary dark:border-background rounded-full overflow-hidden">
              <img
                className="object-cover object-center h-full w-full"
                src={UserAvatars.male[0]} 
                alt={data.name.firstName}
              />
            </div>
          </div>
        </div>
        <div className="text-center grid">
          <Label className="text-xl lg:text-2xl">
            {data.name.firstName} {data.name.lastName}
          </Label>
          <Label className="text-xl font-light">{data.email}</Label>
        </div>
      </div>
    </>
  );
};

export default Profile;
