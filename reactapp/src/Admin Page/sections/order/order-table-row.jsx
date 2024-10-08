import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from '../../Components/label';
import Iconify from '../../Components/iconify';
import { fCurrency } from '../../utils/format-number';

// ----------------------------------------------------------------------

export default function OrderTableRow({
    id,
    dateCreated,
    customerId,
    itemCount,
    total,
    status,
    edit,
    userRole
}) {
    const [open, setOpen] = useState(null);
    const [color, setColor] = useState('default');

    useEffect(() => {
        switch (status) {
            case 'Canceled':
                setColor('error');
                break;
            case 'Paid':
                setColor('success');
                break;
            case 'Processing':
                setColor('warning');
                break;
            case 'Shipping':
                setColor('primary');
                break;
            case 'Delivered':
                setColor('secondary');
                break;
            default:
                setColor('default');
                break;
        }
    }, [status]);

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
                <TableCell>{dateCreated}</TableCell>
                <TableCell>{customerId}</TableCell>
                <TableCell align="center">{itemCount}</TableCell>
                <TableCell>{fCurrency(total)}</TableCell>
                <TableCell align="center">
                    <Label color={color}>
                        {status}
                    </Label>
                </TableCell>
                <TableCell align="right" sx={{ display: userRole === 'Order Manager' ? 'flex' : 'none' }}>
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
            </Popover>
        </>
    );
}

OrderTableRow.propTypes = {
    id: PropTypes.any,
    dateCreated: PropTypes.any,
    customerId: PropTypes.any,
    itemCount: PropTypes.any,
    total: PropTypes.any,
    status: PropTypes.any,
    edit: PropTypes.func,
};
