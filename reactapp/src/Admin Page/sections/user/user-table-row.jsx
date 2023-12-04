import { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from '../../Components/label';
import Iconify from '../../Components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  id,
  name,
  email,
  role,
  isVerified,
  phone,
  edit,
  remove
}) {
  const [open, setOpen] = useState(null);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell>{id}</TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{phone}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>
          <Label color={(isVerified === null && 'error') || 'success'}>{isVerified === null ? 'No' : 'Yes'}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={edit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={remove} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any,
  email: PropTypes.any,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  phone: PropTypes.string,
  edit: PropTypes.func,
  remove: PropTypes.func
};
