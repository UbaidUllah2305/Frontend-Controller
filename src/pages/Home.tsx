// src\pages\Home.tsx
// This is a Home page where all the types of user interact on first time.
// We have a two types of levels of users who can login on this Software both have a different type of access level.

import { useAppSelector } from '@/store';
import { User } from '@/types/user';
import ManufacturerDashboard from './dashboard/ManufacturerDashboard';
import DistributorDashboard from './dashboard/DistributorDashboard';

// So in that case we have to create a different Home page for different levels of users.
const Home = () => {
  const user = useAppSelector((state) => state.auth.user) as User;
  return user.level === 'manufacturer' ? (
    <ManufacturerDashboard />
  ) : (
    <DistributorDashboard />
  );
};

export default Home;
