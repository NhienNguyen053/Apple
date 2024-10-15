import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Iconify from '../../../Components/iconify';
import Cookies from 'js-cookie';
import { ref, deleteObject } from "firebase/storage";
import { storage } from '../../../Firebase';
import Modal from '../../../Components/Modal';
import jwt_decode from 'jwt-decode';

// ----------------------------------------------------------------------

export default function CategoryPage() {
    const navigate = useNavigate();
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7061/api/Category/getAllCategories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${jwtToken}`
                    },
                });
                if (response.status === 401) {
                    navigate('/signin');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const routeChange = () => {
        navigate('/dashboard/categories/createCategory');
    }

    const routeChange2 = (id) => {
        navigate('/dashboard/categories/editCategory', { state: { id: id } });
    }

    const routeChange3 = (id) => {
        navigate('/dashboard/categories/createSubcategory', { state: { id: id } });
    }

    const routeChange4 = (id, parentId) => {
        navigate('/dashboard/categories/editSubcategory', { state: { id: id, parentId: parentId } });
    }

    const removeCategory = async () => {
        try {
            const response = await fetch(`https://localhost:7061/api/Category/deleteCategory?id=${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${jwtToken}`
                },
            });
            const data = await response.text();
            if (data === "Delete successfully!") {
                const existingImage = ref(storage, `videos/CategoryVideos/category_${deleteId}`);
                deleteObject(existingImage);
                const newCategories = categories.filter(category => category.id !== deleteId);
                setCategories(newCategories);
                setModalVisible(!isModalVisible);
            } else if (data === "No Image!") {
                const newCategories = categories.filter(category => category.id !== deleteId);
                setCategories(newCategories);
                setModalVisible(!isModalVisible);
            } else if (data === "Deleted subcategory!") {
                var newCategories = categories.map(category => ({
                    ...category,
                    childCategories: category.childCategories.filter(childCategory => childCategory.id !== deleteId)
                }));
                setCategories(newCategories);
                setModalVisible(!isModalVisible);
            }
            else {
                setModalVisible(!isModalVisible);
                setModalVisible2(true);
                setTimeout(() => {
                    setModalVisible2(false);
                }, 3000);
                setError(data);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const toggleModal = (param, param1, param2) => {
        setName(param2);
        setDeleteCategory(param);
        setDeleteId(param1);
        setModalVisible(!isModalVisible);
    };

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    }

    const toggleModal3 = () => {
        setModalVisible(!isModalVisible);
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Categories</Typography>

                <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={routeChange} sx={{ display: decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Product Manager' ? 'flex' : 'none' : null}}>
                    New Category
                </Button>
            </Stack>
            <div className="container7 display" style={{ flexWrap: 'wrap', padding: '15px 15px' }}>
                {isModalVisible2 && (
                    <div style={{ width: '95%', backgroundColor: 'rgb(255, 192, 203)', padding: '15px', borderRadius: '10px', margin: 'auto' }}>
                        <span style={{ fontFamily: 'SF-Pro-Display-Medium', color: 'black' }}>{error}</span>
                        <button style={{ background: 'transparent', border: 'none', fontSize: '18px', float: 'right', lineHeight: '1', cursor: 'pointer' }} onClick={toggleModal2}>x</button>
                    </div>
                )}
                {categories.map((category) => (
                    <>
                    <div className="container7" style={{ width: '41%', margin: '10px 15px', padding: '0 25px 10px 25px' }}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Bold' }}>{category.categoryName}</p>
                            <div style={{display: decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Product Manager' ? 'flex' : 'none' : null}}>
                                <i className="fa-solid fa-plus " title='New' style={{ alignSelf: 'center', fontSize: '16px', color: '#b8b8b8', cursor: 'pointer' }} onClick={() => routeChange3(category.id)}></i>
                                <i className="fa-solid fa-pen " title='Edit' style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={() => routeChange2(category.id)}></i>
                                <i className="fa-solid fa-trash" title='Delete' style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: 'black', cursor: 'pointer' }} onClick={() => toggleModal(category.categoryName, category.id, "category")}></i>
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '80%', marginRight: '20px'}}>
                                {category.childCategories.map((child) => (
                                    <p style={{ margin: '5px 0 5px 0', cursor: decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Product Manager' ? 'pointer' : 'default' : 'default'}} onClick={decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Product Manager' ? () => routeChange4(child.id, category.id) : null : null}>{child.categoryName}</p>
                                ))}
                            </div>
                            <div style={{ width: '150px', height: '94px' }}>
                                {category.videoURL ? <video controls style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }}>
                                    <source src={category.videoURL} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video> : null}
                            </div>
                        </div>
                    </div>
                    </>
                ))}
            </div>
            <Modal name={deleteCategory} name2={name} isVisible={isModalVisible} toggleModal={toggleModal3} func={removeCategory} />
        </Container>
    );
}
