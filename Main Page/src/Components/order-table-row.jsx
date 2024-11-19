import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from '../Components/label';
import Iconify from '../Components/iconify';
import { fCurrency } from './utils/format-number';

// ----------------------------------------------------------------------

export default function OrderTableRow({
    id,
    dateCreated,
    items,
    total,
    status,
    edit,
    cancel,
    userRole
}) {
    const [open, setOpen] = useState(null);
    const [color, setColor] = useState('default');
    const [formattedDate, setFormattedDate] = useState('');

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

        const date = new Date(dateCreated);
        const vietnamTime = date.toLocaleString("en-GB", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        setFormattedDate(vietnamTime);
    }, [status, dateCreated]);

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
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: index !== items.length - 1 ? '10px' : '0' }}>
                            <p style={{ color: 'black', width: '70%' }}>{item.productName}</p>
                            <div style={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
                                <img src={item.image} style={{ width: '50px', height: '50px' }} alt={item.productName} />
                            </div>
                            <p style={{ color: 'black', width: '5%' }}>({item.quantity})</p>
                        </div>
                    ))}
                </TableCell>
                <TableCell>{fCurrency(total)}</TableCell>
                <TableCell align="center">
                    <Label color={color}>
                        {status}
                    </Label>
                </TableCell>
                <TableCell align="right" sx={{ display: userRole === 'Order Processor' || userRole === 'Shipper' ? 'table-cell' : 'none' }}>
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
                    View
                </MenuItem>
                <MenuItem onClick={() => { cancel(); handleCloseMenu(); }} sx={{ color: 'red', display: cancel === null ? 'none' : 'flex' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2, color: 'red' }} />
                    Cancel
                </MenuItem>
            </Popover>
        </>
    );
}

OrderTableRow.propTypes = {
    id: PropTypes.any,
    dateCreated: PropTypes.any,
    items: PropTypes.any,
    total: PropTypes.any,
    status: PropTypes.any,
    edit: PropTypes.func,
    cancel: PropTypes.func,
    userRole: PropTypes.string
};
