import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { TableRow, TableCell } from '@mui/material';
import { fCurrency } from '../Components/utils/format-number';
import Label from '../Components/label';
import UserTableHead from '../Components/user-table-head';
import Button from '../Components/Button';
import { useNavigate } from "react-router-dom";
import TablePagination from '@mui/material/TablePagination';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button as MuiButton } from '@mui/material';

const Orders = () => {
    let navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [loading, setLoading] = useState(true);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [statusText, setStatusText] = useState('All');
    const [hasOrder, setHasOrder] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (text) => {
        setAnchorEl(null);
        setStatusText(text);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Refunded':
                return 'error';
            case 'Paid':
                return 'success';
            case 'Processing':
                return 'warning';
            case 'Shipping':
                return 'primary';
            case 'Delivered':
                return 'secondary';
            default:
                return 'default';
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`https://localhost:7061/api/Order/getUserOrders?userId=${decodedToken['Id']}&status=${statusText}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                    if (statusText === 'All' && data.length === 0) {
                        setHasOrder(false);
                    } else {
                        setHasOrder(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [statusText]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
        const sorted = [...orders].sort((a, b) => {
            if (id === 'id') {
                return isAsc
                    ? b.orderId.localeCompare(a.orderId)
                    : a.orderId.localeCompare(b.orderId);
            } else if (id === 'dateCreated') {
                return isAsc
                    ? new Date(b.dateCreated) - new Date(a.dateCreated)
                    : new Date(a.dateCreated) - new Date(b.dateCreated);
            } else if (id === 'total') {
                return isAsc
                    ? b.amountTotal - a.amountTotal
                    : a.amountTotal - b.amountTotal;
            } else if (id === 'status') {
                return isAsc
                    ? b.status.localeCompare(a.status)
                    : a.status.localeCompare(b.status);
            }
            return 0;
        });

        setOrders(sorted);
    };

    const routeChange = () => {
        let path = `/`;
        navigate(path);
    };

    return (
        <>
            <Navbar darkmode={false} />
            <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', margin: '48px 0 48px 0' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ width: '66%', margin: 'auto auto 35px auto', display: 'flex', flexWrap: 'wrap' }}>
                        {loading ? (
                            <p>Loading your orders...</p>
                        ) : orders && (orders.length > 0 || hasOrder) ? (
                            <>
                                <p style={{ width: '100%', color: 'black', fontSize: '40px', fontFamily: 'SF-Pro-Display-Semibold' }}>Products you've ordered.</p>
                                <div style={{ minHeight: '70vh', minWidth: '1000px' }}>
                                    <UserTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={orders.length}
                                        onRequestSort={handleSort}
                                        headLabel={[
                                            { id: 'id', label: 'Order ID', width: '15%' },
                                            { id: 'dateCreated', label: 'Date Created', width: '17%' },
                                            { id: 'items', label: 'Items', width: '50%' },
                                            { id: 'total', label: 'Total', width: '15%' },
                                            { id: 'status', label: 'Status', align: 'center', width: '5%' },
                                            { id: 'action', label: 'Action', align: 'center', width: '5%' },
                                        ]}
                                    />
                                    {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                        <TableRow hover tabIndex={-1} role="checkbox" key={order.orderId}>
                                            <TableCell>{order.orderId}</TableCell>
                                            <TableCell>{new Date(order.dateCreated).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
                                            <TableCell>
                                                {order.productDetails.map((item, index) => (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: index !== order.productDetails.length - 1 ? '10px' : '0' }} key={index}>
                                                        <p style={{ color: 'black', width: '70%' }}>{item.productName}</p>
                                                        <div style={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
                                                            <img src={item.image} style={{ width: '50px', height: '50px' }} alt={item.productName} />
                                                        </div>
                                                        <p style={{ color: 'black', width: '5%' }}>({item.quantity})</p>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell align="center">{fCurrency(order.amountTotal)}</TableCell>
                                            <TableCell align="center">
                                                <Label color={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Label>
                                            </TableCell>
                                            <TableCell><a href={`/order?id=${order.orderId}`}>View Details</a></TableCell>
                                        </TableRow>
                                    ))}
                                        <div style={{ display: 'flex', position: 'absolute', zIndex: '1000' }}>
                                            <p style={{ fontFamily: 'SF-Pro-Display-Light' }}>Status:</p>
                                            <MuiButton
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                                sx={{
                                                    color: 'black',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                    textTransform: 'none',
                                                    marginTop: '1px'
                                                }}
                                            >
                                                {statusText}
                                            </MuiButton>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={() => handleClose('All')}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                <MenuItem onClick={() => handleClose('All')}>All</MenuItem>
                                                <MenuItem onClick={() => handleClose('Paid')}>Paid</MenuItem>
                                                <MenuItem onClick={() => handleClose('Processing')}>Processing</MenuItem>
                                                <MenuItem onClick={() => handleClose('Shipping')}>Shipping</MenuItem>
                                                <MenuItem onClick={() => handleClose('Delivered')}>Delivered</MenuItem>
                                                <MenuItem onClick={() => handleClose('Confirmed')}>Confirmed</MenuItem>
                                                <MenuItem onClick={() => handleClose('Refunded')}>Refunded</MenuItem>
                                            </Menu>
                                        </div>
                                    <TablePagination
                                        page={page}
                                        component="div"
                                        count={orders.length}
                                        rowsPerPage={rowsPerPage}
                                        onPageChange={handleChangePage}
                                        rowsPerPageOptions={[5, 10, 25]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className='container3' style={{ width: '75%' }}>
                                <p className='p5'>You currently have no orders!</p>
                                <Button background={'#0071e3'} onclick={routeChange} text={"Back to shopping"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} height={'34px'} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Orders;
