import { Helmet } from 'react-helmet-async';

import { CategoryView } from '../sections/category/view';

// ----------------------------------------------------------------------

export default function CategoryPage() {
    return (
        <>
            <Helmet>
                <title>Categories</title>
            </Helmet>

            <CategoryView />
        </>
    );
}
