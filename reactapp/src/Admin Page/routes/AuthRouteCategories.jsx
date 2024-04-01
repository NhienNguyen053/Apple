import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AuthRouteCategories = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const { category } = useParams();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("https://localhost:7061/api/Category/getAllCategories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    if (categories.length > 0) {
        var exist = false;
        categories.map((item) => {
            if (item.categoryName.toLowerCase().replace(/\s+/g, '-') === category) {
                exist = true;
            };
            item.childCategories.map((child) => {
                if (child.categoryName.toLowerCase().replace(/\s+/g, '-') === category) {
                    exist = true;
                }
            });
        });
        if (exist === false) {
            return <Navigate to="/notfound" />;
        }
        else {
            return children;
        }
    }
};

export default AuthRouteCategories;
