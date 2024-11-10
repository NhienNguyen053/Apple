import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AuthRouteProducts = ({ children }) => {
    const [categories, setCategories] = useState();
    const [products, setProducts] = useState();
    const [done, setDone] = useState(false);
    const { category, product } = useParams();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`https://localhost:7061/api/Category/getCategoryByName?name=${category}`);
                if (response.status !== 204) {
                    const data = await response.json();
                    setCategories(data);
                }
                const response2 = await fetch(`https://localhost:7061/api/Product/getProductByName?category=${category}&name=${product}`);
                if (response2.status !== 204) {
                    const data2 = await response2.json();
                    setProducts(data2);
                    setDone(true);
                } else {
                    setDone(true);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [category, product]);

    if (done) {
        return categories && products ? React.cloneElement(children, { categories, products }) : <Navigate to="/notfound" replace />;
    }
};

export default AuthRouteProducts;
