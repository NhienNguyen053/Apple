/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Iconify from '../../../Components/iconify';
import Cookies from 'js-cookie';
import Button2 from '../../../../Main Page/Components/Button';
import { ref, deleteObject } from "firebase/storage";
import { storage } from '../../../../Firebase';
import TextField from '../../../Components/TextField';

// ----------------------------------------------------------------------

export default function CategoryPage() {
    const navigate = useNavigate();
    const jwtToken = Cookies.get('jwtToken');
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7061/api/Categories/getAllCategories', {
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

    const routeChange2 = (id, name, desc, image) => {
        navigate('/dashboard/categories/editCategory', { state: { id: id, name: name, desc: desc, image: image } });
    }

    const removeCategory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://localhost:7061/api/Categories/deleteCategory?id=${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${jwtToken}`
                },
            });
            const data = await response.text();
            if (data === "Delete successfully!") {
                const existingImage = ref(storage, `images/CategoryImages/category_${deleteId}`);
                deleteObject(existingImage);
                const newCategories = categories.filter(category => category.id !== deleteId);
                setCategories(newCategories);
                setLoading(false);
                setModalVisible(!isModalVisible);
            } else if (data === "No Image!") {
                const newCategories = categories.filter(category => category.id !== deleteId);
                setCategories(newCategories);
                setLoading(false);
                setModalVisible(!isModalVisible);
            }
            else {
                setLoading(false);
                setModalVisible(!isModalVisible);
                setModalVisible2(true);
                setError(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const newSubCategory = async (id) => {
        const response = await fetch('https://localhost:7061/api/Categories/createSubCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${jwtToken}`
            },
            body: JSON.stringify({
                Id: id,
                CategoryName: "New Subcategory",
                Description: null,
                ImageURL: null,
                ParentCategoryId: null
            }),
        });
        const data = await response.json();
        const categoryIndex = categories.findIndex(category => category.id === id);

        if (categoryIndex !== -1) {
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex].childCategories.push({
                id: data.id,
                categoryName: data.categoryName,
                description: data.description,
                imageURL: data.imageURL,
            });
            setCategories(updatedCategories);
        }
    }

    const updateSubCategory = async (id, name, parentId) => {
        fetch('https://localhost:7061/api/Categories/updateCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                Id: id,
                CategoryName: name,
                Description: null,
                ImageURL: null,
                ParentCategoryId: parentId
            }),
        });
    }

    const toggleModal = (param, param1) => {
        setDeleteCategory(param);
        setDeleteId(param1);
        setModalVisible(!isModalVisible);
    };

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Categories</Typography>

                <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={routeChange}>
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
                    <div className="container7" style={{ width: '41%', margin: '10px 15px', padding: '0 25px' }}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Bold' }}>{category.categoryName}</p>
                            <div style={{display: 'flex'}}>
                                <i class="fa-solid fa-plus " title='New' style={{ alignSelf: 'center', fontSize: '16px', color: '#b8b8b8', cursor: 'pointer' }} onClick={() => newSubCategory(category.id)} ></i>
                                <i class="fa-solid fa-pen " title='Edit' style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: '#5b5b5b', cursor: 'pointer' }} onClick={() => routeChange2(category.id, category.categoryName, category.description, category.imageURL)}></i>
                                <i class="fa-solid fa-trash" title='Delete' style={{ alignSelf: 'center', marginLeft: '10px', fontSize: '14px', color: 'black', cursor: 'pointer' }} onClick={() => toggleModal(category.categoryName, category.id)}></i>
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '80%', marginRight: '20px'}}>
                                {category.childCategories.map((child) => (
                                    <TextField id={child.id} name={child.categoryName} parentId={child.parentCategoryId} onClick={updateSubCategory} />
                                ))}
                            </div>
                            <div style={{ width: '100px', height: '100px' }}>
                                {category.imageURL ? <img src={category.imageURL} alt={category.categoryName} style={{ width: '100%', height: '100%', objectFit: 'contain' }}></img> : null}
                            </div>
                        </div>
                    </div>
                    </>
                ))}
            </div>
            {isModalVisible && (
                <div className="modalBg">
                    <div className="modal">
                        <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '20px' }}>Are you sure you want to delete the <span style={{fontFamily: 'SF-Pro-Display-Bold', color: 'black'}}>{deleteCategory}</span> category?</p>
                        <div style={{ display: 'flex', width: 'fit-content', height: 'fit-content' }}>
                            <Button2 text={'No'} onclick={toggleModal} background={'white'} textColor={'black'} margin={'20px 10px 20px 0'} />
                            {loading ? (
                                <div class="lds-spinner">
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                </div>
                            ) : (
                                <Button2 text={'Yes'} background={'black'} textColor={'white'} onclick={removeCategory} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}
