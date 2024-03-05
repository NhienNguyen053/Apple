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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
      try {
          const response = await fetch("https://localhost:7061/api/Product/getAllProducts");
          const data = await response.json();
          setProducts(data);
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

  const handleCloseFilter = (categoryId, subCategoryId, selectedPrice, productStatus, productName) => {
    setOpenFilter(false);
  };

  const routeChange = () => {
    navigate('/dashboard/products/createProduct');
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Products</Typography>
      
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} sx={{ display: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' ? 'flex' : 'none' }} onClick={routeChange}>
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
          />

        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
