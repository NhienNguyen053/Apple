import SvgColor from '../../Components/svg-color';
// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'dashboard',
    path: ['/dashboard', '/dashboard/info'],
    icon: 'fa-solid fa-chart-line',
  },
  {
    title: 'user',
    path: ['/dashboard/users', '/dashboard/users/createUser'],
    icon: 'fa-solid fa-user',
  },
  {
      title: 'category',
      path: ['/dashboard/categories', '/dashboard/categories/createCategory'],
      icon: 'fa-solid fa-sitemap',
  },
  {
    title: 'product',
    path: ['/dashboard/products', '/dashboard/products/createProduct'],
    icon: 'fa-solid fa-box',
    },
  {
    title: 'order',
    path: ['/dashboard/orders'],
    icon: 'fa-solid fa-receipt'
  }
];

export default navConfig;
