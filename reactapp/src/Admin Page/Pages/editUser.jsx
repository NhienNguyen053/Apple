import { Helmet } from 'react-helmet-async';

import { EditUser } from '../sections/user/view';

// ----------------------------------------------------------------------

export default function editUser() {
    return (
        <>
            <Helmet>
                <title>Edit User</title>
            </Helmet>

            <EditUser />
        </>
    );
}
