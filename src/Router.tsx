import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';
import SideBar from './components/SideBar';
import Login from './pages/auth/Login';
import Register from './pages/auth_register/Register';
import PublicRoute from './PublicRoute';
import Home from './pages/Home';
import ProtectedRoute from './ProtectedRoute';
import SettingsSidebar from './pages/settings/Sidebar';
import ProfileChanges from './pages/settings/profile-changes';
import Appearance from './pages/settings/Appearance';
import Profile from './pages/profile';
import Clients from './pages/clients';
import OperatorUsers from './pages/teams/Operators';
import MarketingUsers from './pages/teams/marketing';
import Products from './pages/catalog/products';
import SubCategories from './pages/catalog/sub-categories';
import Categories from './pages/catalog/categories';
import CompanyProfile from './pages/clients/company/profile';
import AddNewCompany from './pages/clients/company/add-new-company';
import EditCompanyProfile from './pages/clients/company/profile/edit/profile';
import SubCategoryBySlug from './pages/catalog/sub-categories/sub-category-by-slug/inde';
import ClientSubCategoryBySlug from './pages/clients/company/profile/client-subcategories';
import AddNewProduct from './pages/catalog/products/add-new-product';
import EditProduct from './pages/catalog/products/edit-product';
import SubCategoryMetaProducts from './pages/clients/company/profile/client-subcategories/products';
import EditAttributes from './pages/catalog/products/edit-attributes';
import AddNewAttributesInProduct from './pages/catalog/products/add-new-attributes/page';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute to={'/auth/login'} replace={true} />,
    children: [
      {
        path: '/',
        element: <SideBar />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: 'dashboard',
            element: <Home />,
          },
          {
            path: 'clients',
            element: <Clients />,
          },
          {
            path: 'clients/company/profile/:serialCode',
            element: <CompanyProfile />,
          },
          {
            path: 'clients/company/profile/:serialCode/edit/profile',
            element: <EditCompanyProfile />,
          },
          {
            path: 'clients/company/profile/:serialCode/client-sub-categories/:categorySlug',
            element: <ClientSubCategoryBySlug />,
          },
          {
            path: 'clients/company/profile/:serialCode/client-sub-categories/:categorySlug/:subcategorySlug/products',
            element: <SubCategoryMetaProducts />,
          },
          {
            path: 'clients/company/add-new-company',
            element: <AddNewCompany />,
          },
          {
            path: 'teams/operators',
            element: <OperatorUsers />,
          },
          {
            path: 'teams/marketing',
            element: <MarketingUsers />,
          },
          {
            path: 'catalog/categories',
            element: <Categories />,
          },
          {
            path: 'catalog/sub-categories',
            element: <SubCategories />,
          },
          {
            path: 'catalog/:slug/sub-categories',
            element: <SubCategoryBySlug />,
          },
          {
            path: 'catalog/products',
            element: <Products />,
          },
          {
            path: 'catalog/products/add-new-product',
            element: <AddNewProduct />,
          },
          {
            path: 'catalog/products/:productSlug/edit-product',
            element: <EditProduct />,
          },
          {
            path: 'catalog/products/:productSlug/edit-attributes',
            element: <EditAttributes />,
          },
          {
            path: 'catalog/products/:productSlug/add-new-attributes',
            element: <AddNewAttributesInProduct />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: '/settings',
            element: <SettingsSidebar />,
            children: [
              {
                path: '',
                element: <Appearance />,
              },
              {
                path: 'profile-changes',
                element: <ProfileChanges />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute to={'/auth/login'} replace={true} />,
    children: [
      {
        path: '/auth/login',
        element: <Login />,
      },
    ],
  },
  {
    element: <PublicRoute to={'register'} replace={true} />,
    children: [
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
]);
export default router;
