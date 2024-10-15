import { Helmet } from 'react-helmet-async';

import { EditProduct } from '../sections/product/view';

// ----------------------------------------------------------------------

export default function editProduct() {
    return (
        <>
            <Helmet>
                <title>Edit Product</title>
            </Helmet>

            <EditProduct />
        </>
    );
}
