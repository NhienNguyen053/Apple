import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../Firebase";
import Cookies from 'js-cookie';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------

export default function CreateSubcategory() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const [categoryName, setCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState('');
    const [imageError2, setImageError2] = useState('');
    const jwtToken = Cookies.get('jwtToken');
    const [open, setOpen] = useState(false);
    const [openText, setOpenText] = useState('');
    const [openColor, setOpenColor] = useState('');

    const handleNameChange = (e) => {
        setCategoryError('');
        setCategoryName(e.target.value);
    }

    const handleDescChange = (e) => {
        setDesc(e.target.value);
    }

    const back = () => {
        navigate('/dashboard/categories');
    }

    const handleImageChange = () => {
        const input = document.querySelector('#categoryimage');
        const preview = document.querySelector('#image-preview');
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

        const file = input.files[0];
        if (file == null) {
            setImageError('');
            preview.innerHTML = "";
            preview.style.display = "none";
        } else {
            if (!allowedImageTypes.includes(file.type)) {
                setImageError('File can only be an image!');
                preview.innerHTML = "";
                preview.style.display = "none";
                input.value = '';
            } else {
                setImageError('');
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    preview.style.display = "block";
                    preview.innerHTML = `<img src="${reader.result}" alt="Preview" style="width:100%; height: auto; object-fit: contain; border-radius: 10px;">`;
                });
                if (file) {
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    const handleImageChange2 = () => {
        const input = document.querySelector('#categoryicon');
        const preview = document.querySelector('#image-preview2');
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

        const file = input.files[0];
        if (file == null) {
            setImageError2('');
            preview.innerHTML = "";
            preview.style.display = "none";
        } else {
            if (!allowedImageTypes.includes(file.type)) {
                setImageError2('File can only be an image!');
                preview.innerHTML = "";
                preview.style.display = "none";
                input.value = '';
            } else {
                setImageError2('');
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    preview.style.display = "block";
                    preview.innerHTML = `<img src="${reader.result}" alt="Preview" style="width:100%; height: auto; object-fit: contain; border-radius: 10px;">`;
                });
                if (file) {
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    const handleNewCategory = async () => {
        setLoading(true);
        var count = 0;
        if (categoryName.trim() === '') {
            setCategoryError('Enter subcategory name');
        } else {
            setCategoryError('');
            count++;
        }
        if (count === 1) {
            const response = await fetch('https://localhost:7061/api/Category/createCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    CategoryName: categoryName,
                    Description: desc,
                    VideoURL: null,
                    ParentCategoryId: id
                }),
            });
            if (response.status === 400) {
                const data = await response.text();
                setOpenColor('error');
                setOpenText(data);
                setTimeout(() => {
                    setLoading(false);
                    setOpen(true);
                    setTimeout(() => {
                        setOpen(false);
                    }, 5000);
                    window.scrollTo(0, 0);
                }, 2000);
                return;
            }
            else {
                setOpenColor('success');
                setOpenText('Created subcategory successfully!');
            }
            const input = document.querySelector('#categoryimage');
            const file = input.files[0];
            const input2 = document.querySelector('#categoryicon');
            const file2 = input2.files[0];
            const data = await response.json();
            if (file != null) {
                const imageRef = ref(storage, `images/SubcategoryImages/subcategoryImage_${data.id}`)
                uploadBytes(imageRef, file).then(() => {
                    return getDownloadURL(imageRef);
                })
                    .then((downloadURL) => {
                        fetch('https://localhost:7061/api/Category/updateCategory', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${jwtToken}`
                            },
                            body: JSON.stringify({
                                Id: data.id,
                                CategoryName: categoryName,
                                Description: desc,
                                ImageURL: downloadURL,
                                IconURL: null,
                                ParentCategoryId: id
                            }),
                        });
                    })
            }
            if (file2 != null) {
                const imageRef2 = ref(storage, `images/SubcategoryImages/subcategoryIcon_${data.id}`)
                uploadBytes(imageRef2, file2).then(() => {
                    return getDownloadURL(imageRef2);
                })
                    .then((downloadURL) => {
                        fetch('https://localhost:7061/api/Category/updateCategory', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${jwtToken}`
                            },
                            body: JSON.stringify({
                                Id: data.id,
                                CategoryName: categoryName,
                                Description: desc,
                                ImageURL: null,
                                IconURL: downloadURL,
                                ParentCategoryId: id
                            }),
                        });
                    })
            }
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
                window.scrollTo(0, 0);
            }, 2000);
        } else {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" style={{ marginLeft: '3%' }}>New Subcategory</Typography>
            </Stack>
            <div className='container7 display'>
                <Collapse in={open} sx={{ width: '100%' }}>
                    <Alert sx={{ mb: 2 }} severity={openColor}>
                        {openText}
                    </Alert>
                </Collapse>
                <div style={{ width: 'fit-content', height: '80%' }} className="formInputs2">
                    <div style={{ paddingBottom: '25px' }}>
                        <Input
                            placeholder={"Subcategory Name"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            error={categoryError}
                            width={'100%'}
                            onInputChange={handleNameChange}
                            margin={'0 auto 0 auto'}
                        />
                        <Input
                            placeholder={"Subcategory Description"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            width={'100%'}
                            onInputChange={handleDescChange}
                            margin={'30px auto 0 auto'}
                        />
                        <p style={{ margin: '15px 0 0 0', color: 'black', fontFamily: 'SF-Pro-Display-Medium' }}>Intro Image:</p>
                        <Input
                            placeholder={""}
                            isVisible={true}
                            icon={false}
                            type={"file"}
                            borderRadius={"5px"}
                            width={'100%'}
                            onInputChange={handleImageChange}
                            margin={'5px auto 0 auto'}
                            id={"categoryimage"}
                        />
                        <p style={{ color: 'red' }}>{imageError}</p>
                        <div id="image-preview" style={{ width: '280px', height: 'fit-content', display: 'none', marginTop: '20px' }}></div>
                        <p style={{ margin: '15px 0 0 0', color: 'black', fontFamily: 'SF-Pro-Display-Medium' }}>Intro Icon:</p>
                        <Input
                            placeholder={""}
                            isVisible={true}
                            icon={false}
                            type={"file"}
                            borderRadius={"5px"}
                            width={'100%'}
                            onInputChange={handleImageChange2}
                            margin={'5px auto 0 auto'}
                            id={"categoryicon"}
                        />
                        <p style={{ color: 'red' }}>{imageError2}</p>
                        <div id="image-preview2" style={{ width: '280px', height: 'fit-content', display: 'none', marginTop: '20px' }}></div>
                        <div style={{ display: 'flex', height: 'fit-content', width: 'fit-content' }}>
                            <Button text={'Back'} onclick={back} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                            <div style={{ width: '15px' }}></div>
                            {loading ? (
                                <div className="lds-spinner">
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                    <div></div><div></div><div></div><div></div>
                                </div>
                            ) : (
                                <Button text={'Continue'} background={'black'} onclick={handleNewCategory} textColor={'white'} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
