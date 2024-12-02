import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const navConfig = () => {
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;

    const baseConfig = [];

    if (decodedToken["Role"] === 'Order Manager') {
        baseConfig.push(
            {
                title: 'dashboard',
                path: ['/dashboard', '/dashboard/info'],
                icon: 'fa-solid fa-chart-line',
            },
            {
                title: 'order',
                path: ['/dashboard/orders'],
                icon: 'fa-solid fa-box',
            },
        );
    } else if (decodedToken["Role"] === 'User Manager') {
        baseConfig.push(
            {
                title: 'user',
                path: ['/dashboard/users', '/dashboard/users/createUser'],
                icon: 'fa-solid fa-user',
            },
        );
    } else if (decodedToken["Role"] === 'Product Manager') {
        baseConfig.push(
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
        );
    } else {
        baseConfig.push(
            {
                title: 'order',
                path: ['/dashboard/orders'],
                icon: 'fa-solid fa-box',
            },
        );
    }

    return baseConfig;
};

export default navConfig;
