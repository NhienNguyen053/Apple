import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function CreateCategory() {
    const API_BASE_URL = process.env.REACT_APP_API_HOST;
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState('');
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

    const handleVideoChange = () => {
        const input = document.querySelector('#categoryimage');
        const preview = document.querySelector('#image-preview');
        const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

        const file = input.files[0];
        if (file == null) {
            setImageError('');
            preview.innerHTML = "";
            preview.style.display = "none";
        } else {
            if (!allowedVideoTypes.includes(file.type)) {
                setImageError('File can only be a video!');
                preview.innerHTML = "";
                preview.style.display = "none";
                input.value = '';
            } else {
                setImageError('');
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    preview.style.display = "block";
                    preview.innerHTML = `<video controls style="width:100%; height: 100%; object-fit: contain, borderRadius: 10px"><source src="${reader.result}" type="${file.type}">Your browser does not support the video tag.</video>`;
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
            setCategoryError('Enter category name');
        } else {
            setCategoryError('');
            count++;
        }
        if (count === 1) {
            const response = await fetch(`${API_BASE_URL}/api/Category/createCategory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    CategoryName: categoryName,
                    Description: desc,
                    VideoURL: null,
                    ParentCategoryId: null
                }),
            });
            if (response.status === 400) {
                const data = await result.text();
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
                setOpenText('Created category successfully!');
            }
            const input = document.querySelector('#categoryimage');
            const file = input.files[0];
            if (file != null) {
                const data = await response.json();
                const imageRef = ref(storage, `videos/CategoryVideos/category_${data.id}`)
                uploadBytes(imageRef, file).then(() => {
                    return getDownloadURL(imageRef);
                })
                .then((downloadURL) => {
                    fetch(`${API_BASE_URL}/api/Category/updateCategory`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`
                        },
                        body: JSON.stringify({
                            Id: data.id,
                            CategoryName: categoryName,
                            Description: desc,
                            VideoURL: downloadURL,
                            ParentCategoryId: null
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
                <Typography variant="h4" style={{ marginLeft: '3%' }}>New Category</Typography>
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
                            placeholder={"Category Name"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            error={categoryError}
                            width={'100%'}
                            onInputChange={handleNameChange}
                            margin={'0 auto 0 auto'}
                        />
                        <Input
                            placeholder={"Category Description"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            width={'100%'}
                            onInputChange={handleDescChange}
                            margin={'30px auto 0 auto'}
                        />
                        <p style={{ margin: '15px 0 0 0', color: 'black', fontFamily: 'SF-Pro-Display-Medium' }}>Intro Video:</p>
                        <Input
                            placeholder={""}
                            isVisible={true}
                            icon={false}
                            type={"file"}
                            borderRadius={"5px"}
                            width={'100%'}
                            accept={"video/*"}
                            onInputChange={handleVideoChange}
                            margin={'5px auto 0 auto'}
                            id={"categoryimage"}
                        />
                        <p style={{color: 'red'}}>{imageError}</p>
                        <div id="image-preview" style={{ width: '280px', height: '280px', display: 'none', marginTop: '20px'}}></div>
                        <div style={{ display: 'flex', height: 'fit-content', width: 'fit-content' }}>
                            <Button text={'Back'} onclick={back} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                            <div style={{width: '15px'}}></div>
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
