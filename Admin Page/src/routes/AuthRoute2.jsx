import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const AuthRoute2 = ({ children }) => {
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;

    const userRole = decodedToken?.['Role'];

    if (userRole === 'Product Manager') {
        return children;
    }

    return <Navigate to="/notfound" replace/>;
};

export default AuthRoute2;
