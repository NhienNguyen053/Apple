import SvgColor from '../../Components/svg-color';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
// ----------------------------------------------------------------------

const jwtToken = Cookies.get('jwtToken');
const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
const userRole = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

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
