import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AuthRouteCategories = ({ children }) => {
    const API_BASE_URL = process.env.REACT_APP_API_HOST;
    const [categories, setCategories] = useState();
    const [done, setDone] = useState(false);
    const { category } = useParams();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Category/getCategoryByName?name=${category}`);
                if (response.status !== 204) {
                    const data = await response.json();
                    setCategories(data);
                    setDone(true);
                } else {
                    setDone(true);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [category]);

    if (done) {
        return categories ? React.cloneElement(children, { categories }) : <Navigate to="/notfound" replace />;
    }
};

export default AuthRouteCategories;
