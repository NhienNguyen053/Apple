import { Helmet } from 'react-helmet-async';

import { CreateCategory } from '../sections/category/view';

// ----------------------------------------------------------------------

export default function createCategory() {
    return (
        <>
            <Helmet>
                <title>Create Category</title>
            </Helmet>

            <CreateCategory />
        </>
    );
}
