import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const AuthRoute = ({ children }) => {
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;

    const userRole = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (userRole === 'Admin') {
        return children;
    }

    return <Navigate to="/notfound" />;
};

export default AuthRoute;
