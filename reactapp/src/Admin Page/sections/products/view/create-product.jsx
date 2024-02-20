/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Input from '../../../../Main Page/Components/Input';
import Select2 from '../../../../Main Page/Components/Select';
import Button from '../../../../Main Page/Components/Button';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../Firebase";
import Cookies from 'js-cookie';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { Editor } from '@tinymce/tinymce-react';
import TabPanel from '../../../Components/TabPanel';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------
let nextId = -1;
export default function CreateProduct() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('New Product');
    const [productId, setProductId] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [categoryError, setCategoryError] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState('');
    const [subCategoryError, setSubCategoryError] = useState(false);
    const [productName, setProductName] = useState('');
    const [productNameError, setProductNameError] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productPriceError, setProductPriceError] = useState(false);
    const [productQuantity, setProductQuantity] = useState('');
    const [productQuantityError, setProductQuantityError] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productStatus, setProductStatus] = useState('Inactive');
    const [productImages, setProductImages] = useState([]);
    const [created, setCreated] = useState(true);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [imageError, setImageError] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const jwtToken = Cookies.get('jwtToken');
    const names = [
        'Red',
        'Blue',
        'Green',
        'Yellow',
        'Orange',
        'Purple',
        'Brown',
        'Pink',
        'Gray',
        'Black',
        'White'
    ];
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            setProductDescription(editorRef.current.getContent());
        }
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleCategoryId = (e) => {
        setCategoryId(e.target.value);
        setCategoryError(false);
    }

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    }

    const handleSubCategoryId = (e) => {
        setSubCategoryId(e.target.value);
        setSubCategoryError(false);
    }

    const handleProductName = (e) => {
        setProductName(e.target.value);
        setProductNameError('');
    }

    const handleProductPrice = (e) => {
        setProductPrice(e.target.value);
        setProductPriceError(false);
    }

    const handleProductQuantity = (e) => {
        setProductQuantity(e.target.value);
        setProductQuantityError('');
    }

    const handleProductStatus = (e) => {
        setProductStatus(e.target.value);
    }


    function getStyles(name , personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const handleButtonClick = () => {
        const fileInput = document.getElementById('productimages');
        fileInput.click();
    };

    useEffect(() => {
        setSelectedColor('empty');
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

    const back = () => {
        navigate('/dashboard/products');
    }

    <TabPanel/>

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);
    const handleChange2 = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setPersonName(value);
    };

    const handleNewProduct = async () => {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        const quantityRegex = /^[1-9]\d*$/;
        setLoading(true);
        var count = 0;
        if (categoryId !== "") {
            count++;
            if (subCategoryId !== "") {
                count++;
            }
            else {
                setSubCategoryError(true);
            }
        }
        else {
            setCategoryError(true);
        }
        if (productName.trim() !== '') {
            count++;
        }
        else {
            setProductNameError("Please enter product's name");
        }
        if (priceRegex.test(productPrice)) {
            count++;
        }
        else {
            setProductPriceError(true)
        }
        if (quantityRegex.test(productQuantity)) {
            count++;
        }
        else {
            setProductQuantityError('Invalid product quantity')
        }
        if (count === 5) {
            const productId = await fetch('https://localhost:7061/api/Product/createProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    ProductName: productName,
                    ProductPrice: productPrice,
                    ProductQuantity: productQuantity,
                    ProductStatus: productStatus,
                    CategoryId: categoryId,
                    ProductDescription: productDescription,
                    Colors: personName
                }),
            });
            setProductId(await productId.text());
            setCreated(true);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 3000);
        }
        else { }
        setLoading(false);
        window.scrollTo(0, 0);
    };

    const handleImageChange = () => {
        const input = document.querySelector('#productimages');
        const allowedTypes = ['image/png', 'image/svg', 'image/jpeg', 'image/webp'];

        const files = input.files;
        if (files == null) {
            setImageError('');
        } else {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (!allowedTypes.includes(file.type)) {
                    setImageError('Files can only be images!');
                    input.value = '';
                    return;
                } else {
                    setImageError('');
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        nextId = nextId + 1;
                        setProductImages((prevImages) => [
                            ...prevImages,
                            { id: nextId, path: event.target.result },
                        ]);
                    });
                    if (file) {
                        reader.readAsDataURL(file);
                    }
                }
            }
        }
        input.value = '';
    };

    const handlePaste = (e) => {
        var items = Array.from(e.clipboardData.items).filter(x => /^image\//.test(x.type));
        items.forEach(item => {
            var blob = item.getAsFile();
            var img = new Image();
            img.src = URL.createObjectURL(blob);
            nextId = nextId + 1;
            setProductImages((prevImages) => [
                ...prevImages,
                { id: nextId, path: img.src },
            ]);
        })
    };

    const handleUploadImage = async () => {
        if (personName.length === 0) {

        } else {
            if (selectedColor === 'empty') {
                setImageError('Please select a color!');
                return;
            } else {
                setImageError('');
            }
        }

    }

    const removeImage = (e) => {
        setProductImages((prevImages) =>
            prevImages.filter((image) => image.id !== e)
        );
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">{title}</Typography>
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Info" {...a11yProps(0)} />
                    <Tab label="Images" disabled={created === false ? true : false} {...a11yProps(1)} onClick={() => setTitle('Product' + {})} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div className='container7 display' style={{ marginTop: 0 }}>
                    <Collapse in={open} sx={{width: '100%'}}>
                        <Alert sx={{ mb: 2 }}>
                            Created product successfully!
                        </Alert>
                    </Collapse>
                    <div style={{ width: 'fit-content', height: '80%' }}>
                        <div style={{ paddingBottom: '25px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <div style={{width: '47%'}}>
                                <Select2 type={'category'} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} onInputChange={handleCategoryId} />
                                <p style={{ margin: '3px 0 0 0', color: 'red', display: categoryError === false ? 'none' : 'block'}}>Please select a category</p>
                            </div>
                            <div style={{ width: '47%' }}>
                                <Select2 type={'subcategory'} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} disabled={categoryId === "" ? true : null} categoryId={categoryId} onInputChange={handleSubCategoryId} />
                                <p style={{ margin: '3px 0 0 0', color: 'red', display: subCategoryError === false ? 'none' : 'block' }}>Please select a subcategory</p>
                            </div>
                            <div style={{width: '47%'}}>
                                <Input
                                    placeholder={"Product Name"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleProductName}
                                    error={productNameError}
                                    errorMargin={'3px 0 0 0'}
                                />
                            </div>
                            <div style={{width: '46.8%'}}>
                                <TextField
                                    label="Product Price"
                                    id="filled-start-adornment"
                                    sx={{
                                        '&:focus-within': {
                                            border: '2px solid black',
                                        },
                                        width: '100%',
                                        border: '0.5px solid gray',
                                        borderRadius: '5px',
                                        transition: 'border-color 0.3s',
                                        margin: '16px 0 0 0',
                                        boxSizing: 'border-box',
                                        height: '56px',
                                        '& .MuiInputBase-root': {
                                            bgcolor: 'white',
                                            borderBottomLeftRadius: '4px',
                                        },
                                        '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root': {
                                            fontFamily: 'SF-Pro-Display-Regular',
                                            fontSize: '17px',
                                        },
                                        '& .MuiFilledInput-root': {
                                            borderBottom: 'none !important'
                                        },
                                        '& .css-1iulo1y-MuiInputBase-root-MuiFilledInput-root:before': {
                                            content: 'none'
                                        },
                                        '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
                                            color: 'gray'
                                        },
                                        '& .css-1iulo1y-MuiInputBase-root-MuiFilledInput-root.Mui-focused': {
                                            bgcolor: 'white',
                                            paddingTop: '0',
                                        },
                                        '& .css-1iulo1y-MuiInputBase-root-MuiFilledInput-root:after': {
                                            borderBottom: 'none'
                                        },
                                        '& .css-16d1ey4-MuiFormControl-root-MuiTextField-root .MuiInputBase-root:hover': {
                                            bgcolor: 'white',
                                            borderBottom: 'none'
                                        },
                                        '& .css-1iulo1y-MuiInputBase-root-MuiFilledInput-root:hover': {
                                            bgcolor: 'white'
                                        },
                                        '& .css-1iulo1y-MuiInputBase-root-MuiFilledInput-root': {
                                            height: '53px',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    variant="filled"
                                    onChange={handleProductPrice}
                                />
                                <p style={{ margin: '3px 0 0 0', color: 'red', display: productPriceError === false ? 'none' : 'block', fontSize: '15px' }}>Product price must be a number with up to two decimals</p>
                            </div>
                            <div style={{width: '47%'}}>
                                <Input
                                    placeholder={"Product Quantity"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleProductQuantity}
                                    error={productQuantityError}
                                    errorMargin={'3px 0 0 0'}
                                />
                            </div>
                            <FormControl sx={{ mt: 2, width: '47%' }}>
                            <InputLabel id="demo-multiple-chip-label">Colors</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                sx={{width: '100%', height: '56px'}}
                                value={personName}
                                onChange={handleChange2}
                                input={<OutlinedInput id="select-multiple-chip" label="Colors" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} sx={{ bgcolor: value, '& .MuiChip-label': {color: value === 'Black' ? 'white' : 'black'} }} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {names.map((name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                        style={getStyles(name, personName, theme)}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <Editor
                                onInit={(evt, editor) => editorRef.current = editor}
                                apiKey='4e5jy2d60fpgup43p2lpt6ghxe48cmn01degz38rspmz330f'
                                init={{
                                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                    content_css: '../../../../style.css'
                                }}
                                onEditorChange={log}
                            />
                            <p style={{ width: '100%', color: 'black', margin: '16px 0 5px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Product Status</p>
                            <Select2 type={"status"} width={'47%'} borderRadius={'5px'} margin={'0'} onInputChange={handleProductStatus} />
                            <div style={{width: '100%'}}></div>
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
                                    <Button text={'Continue'} background={'black'} textColor={'white'} onclick={handleNewProduct}/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} onPaste={handlePaste}>
                    <div>
                        <p style={{ width: '100%', color: 'black', margin: '16px 0 10px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Add product images</p>
                        <button style={{ fontSize: '14px', padding: '4px 8px', cursor: 'pointer' }} onClick={handleButtonClick}>Choose Files</button> <span style={{ color: 'black' }}>or paste your images here!</span>
                        <Input
                            placeholder={""}
                            isVisible={false}
                            icon={false}
                            type={"file"}
                            onInputChange={handleImageChange}
                            id={"productimages"}
                            multiple={"multiple"}
                        />
                        <p style={{ color: 'red', margin: '8px 0' }}>{imageError}</p>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {productImages.map(image => (
                                <div>
                                    <div style={{ width: '140px', height: '140px', margin: '10px' }}>
                                        <img key={image.id} src={image.path} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <Button text={'Remove'} background={'white'} textColor={'red'} fontSize={'14px'} margin={'0 auto'} border={'1px solid red'} onclick={() => removeImage(image.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                        <InputLabel shrink htmlFor="select-multiple-native">
                            Colors
                        </InputLabel>
                        <Select
                            native
                            label="Native"
                            value={selectedColor}
                            onChange={handleColorChange}
                            inputProps={{
                                id: 'select-multiple-native',
                            }}
                            sx={{ color: selectedColor, background: selectedColor === 'White' ? '#e6e2da' : 'white' }}
                        >
                            <option value="" style={{ display: 'none' }}></option>
                            {personName.map((name) => (
                                <option key={name} value={name} style={{ color: name, background: name === 'White' ? '#e6e2da' : 'white' }}>
                                    {name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
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
                        <Button text={'Continue'} background={'black'} textColor={'white'} onclick={handleUploadImage} />
                    )}
                </div>
            </TabPanel>
        </Container>
    );
}
