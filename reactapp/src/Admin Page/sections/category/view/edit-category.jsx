import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Input from '../../../../Main Page/Components/Input';
import Button from '../../../../Main Page/Components/Button';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../Firebase";
import Cookies from 'js-cookie';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------

export default function EditCategory() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const name = location.state?.name;
    const description = location.state?.desc;
    const image = location.state?.image;
    const [categoryName, setCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState('');
    const jwtToken = Cookies.get('jwtToken');
    const [open, setOpen] = useState(false);

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

    useEffect(() => {
        setCategoryName(name);
        setDesc(description);
    }, []);

    const handleImageChange = () => {
        const input = document.querySelector('#categoryimage');
        const preview = document.querySelector('#image-preview');
        const allowedTypes = ['image/png', 'image/svg', 'image/jpeg', 'image/webp'];

        const file = input.files[0];
        if (file == null) {
            setImageError('');
            preview.innerHTML = "";
            preview.style.display = "none";
        } else {
            if (!allowedTypes.includes(file.type)) {
                setImageError('File can only be an image!');
                preview.innerHTML = "";
                preview.style.display = "none";
                input.value = '';
            } else {
                setImageError('');
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    preview.style.display = "block";
                    preview.innerHTML = `<img src="${reader.result}" alt="Image preview" style="width:100%; height: 100%; object-fit: contain" id="preview">`;
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
            const input = document.querySelector('#categoryimage');
            const file = input.files[0];
            if (file == null) {
                await fetch('https://localhost:7061/api/Category/updateCategory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify({
                        Id: id,
                        CategoryName: categoryName,
                        Description: desc,
                        ImageURL: image,
                        ParentCategoryId: null
                    }),
                });
            } else {
                const imageRef = ref(storage, `images/CategoryImages/category_${id}`)
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
                            Id: id,
                            CategoryName: categoryName,
                            Description: desc,
                            ImageURL: downloadURL,
                            ParentCategoryId: null
                        }),
                    });
                })
            }
            setTimeout(() => {
                setLoading(false);
                navigate('/dashboard/categories'); setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 3000);
            }, 2000);
        } else {
            setLoading(false);
        }
    };
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" style={{ marginLeft: '3%' }}>Edit Category</Typography>
            </Stack>
            <div className='container7 display'>
                <Collapse in={open} sx={{ width: '100%' }}>
                    <Alert sx={{ mb: 2 }}>
                        Created category successfully!
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
                            inputValue={categoryName}
                        />
                        <Input
                            placeholder={"Category Description"}
                            isVisible={true}
                            icon={false}
                            borderRadius={"5px"}
                            width={'100%'}
                            onInputChange={handleDescChange}
                            margin={'30px auto 0 auto'}
                            inputValue={desc}
                        />
                        <Input
                            placeholder={""}
                            isVisible={true}
                            icon={false}
                            type={"file"}
                            borderRadius={"5px"}
                            width={'100%'}
                            onInputChange={handleImageChange}
                            margin={'30px auto 0 auto'}
                            id={"categoryimage"}
                        />
                        <p style={{ color: 'red' }}>{imageError}</p>
                        <div id="image-preview" style={{ width: '140px', height: '140px', display: image ? 'block' : 'none', marginTop: '20px' }}>
                            {image ? <img src={image} alt={name} style={{width:'100%', height: '100%', objectFit: 'contain'}}></img> : null}
                        </div>
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
