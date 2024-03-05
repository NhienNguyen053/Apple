import { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../Components/iconify';
import Scrollbar from '../../Components/scrollbar';
import Select from '../../../Main Page/Components/Select';

// ----------------------------------------------------------------------

export const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $100' },
  { value: 'between', label: 'Between $100 - $500' },
  { value: 'above', label: 'Above $500' },
];

// ----------------------------------------------------------------------

export default function ProductFilters({ openFilter, onOpenFilter, onCloseFilter, categories }) {
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [productStatus, setProductStatus] = useState('Inactive');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [productName, setProductName] = useState('');

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleRadioChange = (value) => {
    setSelectedPrice(value);
  };

  const handleCategoryId = (e) => {
    setCategoryId(e.target.value);
  }

  const handleSubCategoryId = (e) => {
    setSubCategoryId(e.target.value);
  }

  const handleProductStatus = (e) => {
    setProductStatus(e.target.value);
  }

  const renderCategory = (
      <Stack spacing={1}>
          <Select type={'category'} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} onInputChange={handleCategoryId} />
      </Stack>
  );

  const renderSubCategory = (
     <Stack spacing={1}>
         <Select type={'subcategory'} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} disabled={categoryId === "" ? true : null} categoryId={categoryId} onInputChange={handleSubCategoryId} />
     </Stack>
  );

  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Price:</Typography>
        {PRICE_OPTIONS.map((item, index) => (
            <div class="form-check" style={{ display: 'flex' }} onClick={() => handleRadioChange(index)}>
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" style={{ height: 'fit-content', marginTop: '4px', marginRight: '10px' }} />
                <p style={{margin: 0, }}>{item.label}</p>
            </div>
        ))}
    </Stack>
  );

  const renderName = (
    <Stack spacing={1}>
      <TextField id="outlined-basic" label="Product Name" variant="outlined" onChange={handleProductNameChange}/>
    </Stack>
  );

  const renderStatus = (
    <Stack spacing={1}>
      <Select type={"status"} width={'100%'} borderRadius={'5px'} margin={'0'} onInputChange={handleProductStatus} />
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => onCloseFilter(categoryId, subCategoryId, selectedPrice, productStatus, productName)}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderCategory}

            {renderSubCategory}

            {renderPrice}

            {renderName}

            {renderStatus}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ProductFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  categories: PropTypes.array,
};
