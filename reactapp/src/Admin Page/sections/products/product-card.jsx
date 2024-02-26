import PropTypes from 'prop-types';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { fCurrency } from '../../utils/format-number';

import Label from '../../Components/label';
import { ColorPreview } from '../../Components/color-utils';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(product.productImages === null ? null : product.productImages[0].imageURLs[0]);

  const handleEditClick = (product) => {
    navigate('/dashboard/products/editProduct', { state: { product: product } });
  }

  const renderStatus = (
    <Label
      variant="filled"
      color={(product.productStatus === 'Inactive' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.productStatus}
    </Label>
  );

    const handleColorClick = (color) => {
        const matchingImage = product.productImages.find((img) => img.color === color);
        if (matchingImage) {
            setImage(matchingImage.imageURLs[0]);
        }
    };

  const renderImg = (
    <Box
      component="img"
      alt={product.productName}
      src={image}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'contain',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      {fCurrency(product.productPrice)}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative', cursor: 'pointer' }} onClick={() => handleEditClick(product)}>
        {'sale' && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.productName}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={product.colors} onClick={handleColorClick}/>
          {renderPrice}
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
