import { Helmet } from 'react-helmet-async';

import { CreateUser } from '../sections/user/view';

// ----------------------------------------------------------------------

export default function createUser() {
    return (
        <>
            <Helmet>
                <title>Create User</title>
            </Helmet>

            <CreateUser />
        </>
    );
}
