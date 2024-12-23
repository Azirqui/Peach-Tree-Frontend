import AdminHome from './pages/AdminHome';
import ProductPage from './pages/ProductPage';
import SettingPage from './pages/SettingPage';
import ReportsPage from './pages/Reports'; 

const routes = [
  {
    path: '/admin-home',
    component: AdminHome,
    label: 'Admin Dashboard',
  },
  {
    path: '/product-page',
    component: ProductPage,
    label: 'Products',
  },
  {
    path: '/settings',
    component: SettingPage,
    label: 'Settings',
  },
  {
    path: '/reports',
    component: ReportsPage, 
    label: 'Reports',
  },
];

export default routes;
