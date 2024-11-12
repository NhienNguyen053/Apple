/* eslint-disable no-loop-func */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Input from '../../../Components/Input';
import Select2 from '../../../Components/Select';
import Button from '../../../Components/Button';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from "firebase/storage";
import { storage } from "../../../Firebase";
import Cookies from 'js-cookie';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import Modal from '../../../Components/Modal';
import jwt_decode from 'jwt-decode';

// ----------------------------------------------------------------------

export default function EditProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const [colorSelect, setColorSelect] = useState("");
    const [personName, setPersonName] = React.useState([]);
    const [product, setProduct] = useState();
    const [title, setTitle] = useState();
    const [productId, setProductId] = useState();
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState();
    const [categoryError, setCategoryError] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState();
    const [subCategoryError, setSubCategoryError] = useState(false);
    const [productName, setProductName] = useState();
    const [productNameError, setProductNameError] = useState('');
    const [productPrice, setProductPrice] = useState();
    const [productPriceError, setProductPriceError] = useState(false);
    const [productDescription, setProductDescription] = useState();
    const [productStatus, setProductStatus] = useState();
    const [productImages, setProductImages] = useState([]);
    const [activeImages, setActiveImages] = useState([]);
    const [created, setCreated] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [openText, setOpenText] = useState('');
    const [openColor, setOpenColor] = useState('');
    const [open2, setOpen2] = React.useState(false);
    const [imageError, setImageError] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [display, setDisplay] = useState();
    const [material, setMaterial] = useState();
    const [chip, setChip] = useState();
    const [camera, setCamera] = useState();
    const [functionality, setFunctionality] = useState();
    const [sizeAndWeight, setSizeAndWeight] = useState();
    const [powerAndBattery, setPowerAndBattery] = useState();
    const [connector, setConnector] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isModalVisible3, setModalVisible3] = useState(false);
    const [deleteImageId, setDeleteImageId] = useState('');
    const [deleted, setDeleted] = useState(false);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const [role] = useState(decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null);

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
    const memories = [
        '4GB',
        '8GB',
        '16GB',
        '32GB',
        '64GB'
    ]
    const storages = [
        '64GB',
        '128GB',
        '256GB',
        '512GB',
        '1TB',
        '2TB'
    ]
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

    const handleColorChange = async (e) => {
        setSelectedColor(e.target.value);
        getProductImagesByColor(e.target.value);
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

    const handleProductStatus = (e) => {
        setProductStatus(e.target.value);
    }

    const handleDisplay = (e) => {
        setDisplay(e.target.value);
    }

    const handleMaterial = (e) => {
        setMaterial(e.target.value);
    }

    const handleChip = (e) => {
        setChip(e.target.value);
    }

    const handleCamera = (e) => {
        setCamera(e.target.value);
    }

    const handleFunctionality = (e) => {
        setFunctionality(e.target.value);
    }

    const handleSizeAndWeight = (e) => {
        setSizeAndWeight(e.target.value);
    }

    const handlePowerAndBattery = (e) => {
        setPowerAndBattery(e.target.value);
    }

    const handleConnector = (e) => {
        setConnector(e.target.value);
    }

    function getStyles(name, personName, theme) {
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
        getProduct();
        fetchData();
    }, []);

    useEffect(() => {
        if (personName.length === 0 && productId) {
            getProductImagesByColor(null);
        }
    }, [productId, personName])

    const getProduct = async () => {
        const response = await fetch(`https://localhost:7061/api/Product/getProductById?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${jwtToken}`
            },
        });
        const product = await response.json();
        setProduct(product);
        setTitle(`Product #${product.productNumber}`);
        setProductId(product.id);
        setCategoryId(product.categoryId);
        setSubCategoryId(product.subCategoryId);
        setProductName(product.productName);
        setProductPrice(product.productPrice);
        setProductDescription(product.productDescription);
        setProductStatus(product.productStatus);
        setDisplay(product.specifications.display);
        setMaterial(product.specifications.material);
        setChip(product.specifications.chip);
        setCamera(product.specifications.camera);
        setFunctionality(product.specifications.functionality);
        setSizeAndWeight(product.specifications.sizeAndWeight);
        setPowerAndBattery(product.specifications.powerAndBattery);
        setConnector(product.specifications.connector);
        setPersonName(product.colors);
        setProductMemory(product.options.memory);
        setProductStorage(product.options.storage);
    }

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
                navigate('/login');
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

    const getProductImagesByColor = async (e) => {
        try {
            const response = await fetch('https://localhost:7061/api/Product/getProductImagesByColor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    productId: productId,
                    color: e
                }),
            });
            if (response.status === 401) {
                navigate('/login');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setActiveImages([]);
            data.forEach(item => {
                setActiveImages((prevImages) => [
                    ...prevImages,
                    { id: uuidv4(), path: item },
                ]);
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const back = () => {
        navigate('/dashboard/products');
    }

    <TabPanel />

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
    const [productMemory, setProductMemory] = React.useState([]);
    const [productStorage, setProductStorage] = React.useState([]);
    const handleChange2 = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleChange3 = (event) => {
        const {
            target: { value },
        } = event;
        setProductMemory(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleChange4 = (event) => {
        const {
            target: { value },
        } = event;
        setProductStorage(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleUpdateProduct = async (e) => {
        const sortedArr1 = product.colors.slice().sort();
        const sortedArr2 = personName.slice().sort();
        var isSame = sortedArr1.every((value, index) => value === sortedArr2[index]);
        var isSame2 = sortedArr2.every((value, index) => value === sortedArr1[index]);
        if (e === 0) {
            if (isSame === false || isSame2 === false) {
                toggleModal3();
                return;
            } else { }
        } else {
            setModalVisible3(!isModalVisible3);
        }
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
        if (count === 4) {
            const result = await fetch('https://localhost:7061/api/Product/updateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    Id: productId,
                    ProductName: productName,
                    ProductPrice: productPrice,
                    ProductStatus: productStatus,
                    CategoryId: categoryId,
                    SubCategoryId: subCategoryId,
                    ProductDescription: productDescription,
                    Colors: personName,
                    Specifications: {
                        Display: display,
                        Material: material,
                        Chip: chip,
                        Camera: camera,
                        Functionality: functionality,
                        SizeAndWeight: sizeAndWeight,
                        PowerAndBattery: powerAndBattery,
                        Connector: connector
                    },
                    Options: {
                        Memory: productMemory,
                        Storage: productStorage
                    }
                }),
            });
            if (result.status === 200) {
                setCreated(true);
                const data = await result.json();
                data.forEach(item => {
                    const decodedUrl = decodeURIComponent(item);
                    const urlObject = new URL(decodedUrl);
                    const path = urlObject.pathname;
                    const pathSegments = path.split('/');
                    const extractedPath = pathSegments.slice(5).join('/');
                    const storage = getStorage();
                    const desertRef = ref(storage, extractedPath);
                    deleteObject(desertRef);
                })
                setActiveImages([]);
                setSelectedColor("");
                setOpenColor('success');
                setOpenText('Updated product successfully!');
            }
            else if (result.status === 401) {
                const data = "Credentials expired. Please log in again!";
                setOpenColor('error');
                setOpenText(data);
            }
            else {
                const data = await result.text();
                setOpenColor('error');
                setOpenText(data);
            }
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000);
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
                        setProductImages((prevImages) => [
                            ...prevImages,
                            { id: uuidv4(), path: event.target.result },
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
            setProductImages((prevImages) => [
                ...prevImages,
                { id: uuidv4(), path: img.src },
            ]);
        })
    };

    const handleUploadImage = async () => {
        setLoading(true);
        var imageURLs = [];
        var hasColors = false;

        if (personName.length === 0) {
            hasColors = false;
        } else {
            if (selectedColor === 'empty') {
                setImageError('Please select a color!');
                setLoading(false);
                return;
            } else {
                setImageError('');
                hasColors = true;
            }
        }

        for (let i = 0; i < productImages.length; i++) {
            const file = productImages[i].path;

            const response = await fetch(file);
            const blob = await response.blob();

            const mimeString = blob.type;
            const imageRef = ref(storage, `images/ProductImages/${productId}/${uuidv4()}`);

            try {
                await uploadBytes(imageRef, blob);
                const downloadURL = await getDownloadURL(imageRef);
                setActiveImages((prevImages) => [
                    ...prevImages,
                    { id: uuidv4(), path: downloadURL },
                ]);
                imageURLs.push(downloadURL);
            } catch (error) {
                console.error('Error uploading image:', error);
                setImageError('Failed to upload image.');
                setLoading(false);
                return;
            }
        }

        if (productImages.length > 0) {
            await fetch('https://localhost:7061/api/Product/updateProductImages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({
                    productId: productId,
                    productImages: imageURLs,
                    Color: hasColors ? selectedColor.toString() : null,
                }),
            });
        }

        setTimeout(() => {
            setLoading(false);
            setProductImages([]);
            setOpen2(true);
            setTimeout(() => {
                setOpen2(false);
            }, 5000);
            window.scrollTo(0, 0);
        }, 2000);
    };


    const removeImage = (e) => {
        setProductImages((prevImages) =>
            prevImages.filter((image) => image.id !== e)
        );
    }

    const removeImage2 = async () => {
        const decodedUrl = decodeURIComponent(deleteImageId);
        const urlObject = new URL(decodedUrl);
        const path = urlObject.pathname;
        const pathSegments = path.split('/');
        const extractedPath = pathSegments.slice(5).join('/');
        const storage = getStorage();
        const desertRef = ref(storage, extractedPath);
        deleteObject(desertRef).then(async () => {
            await fetch('https://localhost:7061/api/Product/deleteProductImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    productId: productId,
                    imageUrl: deleteImageId,
                    color: selectedColor
                }),
            });
            setDeleted(true);
            setActiveImages(activeImages.filter(x => x.path !== deleteImageId))
            setModalVisible(!isModalVisible);
            setOpen2(true);
            setTimeout(() => {
                setOpen2(false);
                setDeleted(false);
            }, 5000);
            window.scrollTo(0, 0);
        }).catch((error) => {
            console.error(error);
        })
    }

    const deleteProduct = async () => {
        setLoading2(true);
        const response = await fetch(`https://localhost:7061/api/Product/deleteProduct?id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        const data = await response.json();
        data.forEach(item => {
            const decodedUrl = decodeURIComponent(item);
            const urlObject = new URL(decodedUrl);
            const path = urlObject.pathname;
            const pathSegments = path.split('/');
            const extractedPath = pathSegments.slice(5).join('/');
            const storage = getStorage();
            const desertRef = ref(storage, extractedPath);
            deleteObject(desertRef);
        });
        setTimeout(() => {
            navigate('/dashboard/products/');
            setLoading2(false);
        }, 3000);
    }

    const toggleModal = (e) => {
        setDeleteImageId(e);
        setModalVisible(!isModalVisible);
    }

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    }

    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3);
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">{title}</Typography>
                <Button text={'Delete'} background={'red'} textColor={'white'} margin={0} onclick={toggleModal2} />
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Info" {...a11yProps(0)} />
                    <Tab label="Images" disabled={created === false ? true : false} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div className='container7 display' style={{ marginTop: 0 }}>
                    <Collapse in={open} sx={{ width: '100%' }} >
                        <Alert sx={{ mb: 2 }} severity={openColor}>
                            {openText}
                        </Alert>
                    </Collapse>
                    <div style={{ width: 'fit-content', height: '80%' }}>
                        <div style={{ paddingBottom: '25px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }} className="formInputs3">
                            <div style={{ width: '47%' }}>
                                <Select2 type={'category'} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} onInputChange={handleCategoryId} selectedCategory={categoryId} disabled={role === 'Product Manager' ? false : true} />
                                <p style={{ margin: '3px 0 0 0', color: 'red', display: categoryError === false ? 'none' : 'block' }}>Please select a category</p>
                            </div>
                            <div style={{ width: '47%' }}>
                                <Select2 type={'subcategory'} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} disabled={categoryId === "" ? true : null} categoryId={categoryId} onInputChange={handleSubCategoryId} selectedSubCategory={subCategoryId} />
                                <p style={{ margin: '3px 0 0 0', color: 'red', display: subCategoryError === false ? 'none' : 'block' }}>Please select a subcategory</p>
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Product Name"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleProductName}
                                    inputValue={productName}
                                    error={productNameError}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Product Price (₫)"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleProductPrice}
                                    inputValue={productPrice}
                                    error={productPriceError}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                                <p style={{ margin: '3px 0 0 0', color: 'red', display: productPriceError === false ? 'none' : 'block', fontSize: '15px' }}>Product price must be a number with up to two decimals</p>
                            </div>
                            <FormControl sx={{ mt: 2, width: '47%', mb: 2 }}>
                                <InputLabel id="demo-multiple-chip-label">Colors</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    sx={{ width: '100%', height: '56px' }}
                                    value={personName}
                                    disabled={role === 'Product Manager' ? false : true}
                                    onChange={handleChange2}
                                    input={<OutlinedInput id="select-multiple-chip" label="Colors" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} sx={{ bgcolor: value, '& .MuiChip-label': { color: value === 'Black' ? 'white' : 'black' } }} />
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
                                value={productDescription}
                                init={{
                                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                    content_css: '../../../../style.css'
                                }}
                                onEditorChange={log}
                            />
                            <p style={{ width: '100%', color: 'black', margin: '16px 0 5px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Product Specifications:</p>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Display"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    onInputChange={handleDisplay}
                                    inputValue={display}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Material"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    onInputChange={handleMaterial}
                                    inputValue={material}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Chip"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleChip}
                                    inputValue={chip}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Camera"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleCamera}
                                    inputValue={camera}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Functionality"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleFunctionality}
                                    inputValue={functionality}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"SizeAndWeight"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleSizeAndWeight}
                                    inputValue={sizeAndWeight}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"PowerAndBattery"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    inputValue={powerAndBattery}
                                    onInputChange={handlePowerAndBattery}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <div style={{ width: '47%' }}>
                                <Input
                                    placeholder={"Connector"}
                                    isVisible={true}
                                    icon={false}
                                    borderRadius={"5px"}
                                    width={'100%'}
                                    margin={'16px 0 0 0'}
                                    onInputChange={handleConnector}
                                    inputValue={connector}
                                    errorMargin={'3px 0 0 0'}
                                    disabled={role === 'Product Manager' ? false : true}
                                />
                            </div>
                            <p style={{ width: '100%', color: 'black', margin: '16px 0 5px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Options:</p>
                            <FormControl sx={{ mt: 2, width: '47%' }}>
                                <InputLabel id="demo-multiple-chip-label">Memory</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    disabled={role === 'Product Manager' ? false : true}
                                    sx={{ width: '100%', height: '56px' }}
                                    value={productMemory}
                                    onChange={handleChange3}
                                    input={<OutlinedInput id="select-multiple-chip" label="Colors" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} sx={{ bgcolor: value, '& .MuiChip-label': { color: value === 'Black' ? 'white' : 'black' } }} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {memories.map((memory) => (
                                        <MenuItem
                                            key={memory}
                                            value={memory}
                                            style={getStyles(memory, personName, theme)}
                                        >
                                            {memory}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mt: 2, width: '47%' }}>
                                <InputLabel id="demo-multiple-chip-label">Storage</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    sx={{ width: '100%', height: '56px' }}
                                    value={productStorage}
                                    onChange={handleChange4}
                                    disabled={role === 'Product Manager' ? false : true}
                                    input={<OutlinedInput id="select-multiple-chip" label="Colors" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} sx={{ bgcolor: value, '& .MuiChip-label': { color: value === 'Black' ? 'white' : 'black' } }} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {storages.map((storage) => (
                                        <MenuItem
                                            key={storage}
                                            value={storage}
                                            style={getStyles(storage, personName, theme)}
                                        >
                                            {storage}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <p style={{ width: '100%', color: 'black', margin: '16px 0 5px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Product Status</p>
                            <Select2 selectedValue={productStatus} type={"status"} width={'47%'} borderRadius={'5px'} margin={'0'} onInputChange={handleProductStatus} disabled={role === 'Product Manager' ? false : true} />
                            <div style={{ width: '100%' }}></div>
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
                                    <Button text={'Update'} background={'black'} textColor={'white'} onclick={() => handleUpdateProduct(0)} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }} onPaste={handlePaste}>
                    <Collapse in={open2} sx={{ width: '100%' }}>
                        <Alert sx={{ mb: 2 }}>
                            {deleted == false ? 'Uploaded images successfully!' : 'Deleted image successfully!'}
                        </Alert>
                    </Collapse>
                    <div style={{display: role === 'Product Manager' ? 'block' : 'none' }}>
                        <p style={{ width: '100%', color: 'black', margin: '16px 0 10px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Add product images:</p>
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
                                        <img key={image.path} src={image.path} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <Button text={'Remove'} background={'white'} textColor={'red'} fontSize={'14px'} margin={'0 auto'} border={'1px solid red'} onclick={() => removeImage(image.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300, display: personName.length === 0 ? 'none' : 'flex' }}>
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
                            sx={{ color: selectedColor === 'White' ? 'black' : selectedColor }}
                        >
                            <option value={colorSelect} style={{ display: 'none' }}></option>
                            {personName.map((name) => (
                                <option key={name} value={name} style={{ color: name === 'White' ? 'black' : name }}>
                                    {name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ display: role === 'Product Manager' ? 'flex' : 'none' , height: 'fit-content', width: 'fit-content' }}>
                    <Button text={'Back'} onclick={back} background={'linear-gradient(to bottom, #ffffff, #e1e0e1)'} textColor={'black'} />
                    <div style={{ width: '15px' }}></div>
                    {loading ? (
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    ) : (
                        <Button text={'Upload'} background={'black'} textColor={'white'} onclick={handleUploadImage} />
                    )}
                </div>
                <div>
                    <p style={{ width: '100%', color: 'black', margin: '16px 0 10px 0', fontFamily: 'SF-Pro-Display-Regular' }}>Active product images:</p>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {activeImages.map(image => (
                            <div>
                                <div style={{ width: '140px', height: '140px', margin: '10px' }}>
                                    <img key={image.path} src={image.path} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Button text={'Remove'} background={'white'} textColor={'red'} fontSize={'14px'} margin={'0 auto'} border={'1px solid red'} onclick={() => toggleModal(image.path)} />
                            </div>
                        ))}
                    </div>
                </div>
            </TabPanel>
            <Modal name2={"image"} isVisible={isModalVisible} toggleModal={toggleModal} func={removeImage2} />
            <Modal name3={"product"} name={product ? " #" + product.productNumber : ""} isVisible={isModalVisible2} toggleModal={toggleModal2} func={deleteProduct} loading={loading2} />
            <Modal name1={'!'} name4={"update"} name3={"product's colors? This will delete previous images"} isVisible={isModalVisible3} toggleModal={toggleModal3} func={() => handleUpdateProduct(1)} />
        </Container>
    );
}
