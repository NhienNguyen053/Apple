import { Helmet } from 'react-helmet-async';

import { CreateProduct } from '../sections/products/view';

// ----------------------------------------------------------------------

export default function createProduct() {
    return (
        <>
            <Helmet>
                <title>Create Product</title>
            </Helmet>

            <CreateProduct />
        </>
    );
}
