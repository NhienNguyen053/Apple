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
import Select from '../../Components/Select';

// ----------------------------------------------------------------------

export const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $100' },
  { value: 'between', label: 'Between $100 - $500' },
  { value: 'above', label: 'Above $500' },
];

// ----------------------------------------------------------------------

export default function ProductFilters({ openFilter, onOpenFilter, onCloseFilter, categories, inputCategoryId, inputSubCategoryId, inputSelectedPrice, inputProductName, inputProductStatus, inputPageSize }) {
  const [categoryId, setCategoryId] = useState(inputCategoryId);
  const [subCategoryId, setSubCategoryId] = useState(inputSubCategoryId);
  const [productStatus, setProductStatus] = useState(inputProductStatus);
  const [selectedPrice, setSelectedPrice] = useState(inputSelectedPrice);
  const [productName, setProductName] = useState(inputProductName);
  const [pageSize, setPageSize] = useState(inputPageSize);

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

  const handlePageSize = (e) => {
      setPageSize(e.target.value);
  }

  const renderCategory = (
      <Stack spacing={1}>
          <Select type={'category'} selectedCategory={categoryId} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} onInputChange={handleCategoryId} />
      </Stack>
  );

  const renderSubCategory = (
     <Stack spacing={1}>
         <Select type={'subcategory'} selectedSubCategory={subCategoryId} customOptions={categories} margin={'0'} width={'100%'} borderRadius={'5px'} disabled={categoryId === "" ? true : null} categoryId={categoryId} onInputChange={handleSubCategoryId} />
     </Stack>
  );

  const renderPrice = (
    <Stack spacing={1}>
          <Typography variant="subtitle2">Price:</Typography>
        {PRICE_OPTIONS.map(item => (
            <div class="form-check" style={{ display: 'flex' }} onClick={() => handleRadioChange(item.value)}>
                <input checked={selectedPrice === item.value ? true : null} class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" style={{ height: 'fit-content', marginTop: '4px', marginRight: '10px' }} />
                <p style={{margin: 0, }}>{item.label}</p>
            </div>
        ))}
    </Stack>
  );

  const clearAll = () => {
      setCategoryId('');
      setSubCategoryId('');
      setProductName('');
      setProductStatus('');
      setSelectedPrice('');
      setPageSize(8);
  }

  const renderName = (
    <Stack spacing={1}>
      <TextField id="outlined-basic" label="Product Name" variant="outlined" onChange={handleProductNameChange} value={productName}/>
    </Stack>
  );

  const renderStatus = (
    <Stack spacing={1}>
      <Select type={"status2"} width={'100%'} borderRadius={'5px'} margin={'0'} onInputChange={handleProductStatus} selectedValue={productStatus}/>
    </Stack>
  );

  const renderRows = (
    <Stack spacing={1}>
      <p style={{color: 'black', marginBottom: '5px', fontSize: '14px', fontFamily: 'SF-Pro-Display-Regular'}}>Page size:</p>
      <Select type={"rows"} width={'100%'} borderRadius={'5px'} margin={'0'} onInputChange={handlePageSize} selectedValue={pageSize}/>
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
        onClose={() => onCloseFilter(categoryId, subCategoryId, selectedPrice, productStatus, productName, pageSize)}
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

            {renderRows}
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
            onClick={clearAll}
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
