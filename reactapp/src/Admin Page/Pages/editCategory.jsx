import { Helmet } from 'react-helmet-async';

import { EditCategory } from '../sections/category/view';

// ----------------------------------------------------------------------

export default function editCategory() {
    return (
        <>
            <Helmet>
                <title>Edit Category</title>
            </Helmet>

            <EditCategory />
        </>
    );
}
