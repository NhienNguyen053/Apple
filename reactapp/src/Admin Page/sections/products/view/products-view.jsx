import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Iconify from '../../../Components/iconify';
import Button from '@mui/material/Button';
import ProductCard from '../product-card';
import ProductFilters from '../product-filters';
import jwt_decode from 'jwt-decode';
import ProductCartWidget from '../product-cart-widget';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [productStatus, setProductStatus] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    fetchProducts(categoryId, subCategoryId, selectedPrice, productStatus, productName, pageIndex, pageSize);
    fetchCategories();
  }, []);

  const fetchProducts = async (category, subCategory, price, status, name, index, size) => {
      try {
          const response = await fetch(`https://localhost:7061/api/Product/getProducts?categoryId=${category}&subcategoryId=${subCategory}&price=${price}&status=${status}&name=${name}&pageIndex=${index}&pageSize=${size}`);
          const data = await response.json();
          const { products, totalCount } = data;
          var array = [];
          var i;
          for (i = 0; i < totalCount / pageSize; i++) {
              array.push(i + 1);
          };
          setTotalPage(array);
          setProducts(products);
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
  };

  const fetchCategories = async () => {
      try {
          const response = await fetch("https://localhost:7061/api/Category/getAllCategories");
          const data = await response.json();
          setCategories(data);
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = (categoryId, subCategoryId, selectedPrice, productStatus, productName, pageSize) => {
      setCategoryId(categoryId);
      setSubCategoryId(subCategoryId);
      setSelectedPrice(selectedPrice);
      setProductStatus(productStatus);
      setProductName(productName);
      setPageIndex(1);
      setPageSize(pageSize);
      fetchProducts(categoryId, subCategoryId, selectedPrice, productStatus, productName, 1, pageSize);
      setOpenFilter(false);
  };

  const routeChange = () => {
    navigate('/dashboard/products/createProduct');
  }

  const changePage = (index) => {
      setPageIndex(index);
      fetchProducts(categoryId, subCategoryId, selectedPrice, productStatus, productName, index, pageSize);
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Products</Typography>
      
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} sx={{ display: decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Product Manager' ? 'flex' : 'none' : null}} onClick={routeChange}>
              New Product
          </Button>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            categories={categories}
            inputCategoryId={categoryId}
            inputSubCategoryId={subCategoryId}
            inputSelectedPrice={selectedPrice}
            inputProductStatus={productStatus}
            inputProductName={productName}
            inputPageSize={pageSize}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
        <div style={{width: '100%'}}>
            {totalPage.map((index) => (
                <Button variant={index == pageIndex ? 'contained' : 'outline'} sx={{ minWidth: '32px', borderRadius: '0' }} onClick={() => changePage(index)}>{index}</Button>
            ))}
        </div>
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
