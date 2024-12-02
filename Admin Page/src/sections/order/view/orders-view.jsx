import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Scrollbar from '../../../Components/scrollbar';
import TableNoData from '../../user/table-no-data';
import UserTableHead from '../../user/user-table-head';
import TableEmptyRows from '../../user/table-empty-rows';
import UserTableToolbar from '../../user/user-table-toolbar';
import jwt_decode from 'jwt-decode';
import { emptyRows, applyOrderFilter, getComparator } from '../../user/utils';
import Cookies from 'js-cookie';
import OrderTableRow from '../order-table-row';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button as MuiButton } from '@mui/material';

// ----------------------------------------------------------------------

export default function OrdersView() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orders, setOrders] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
    const [statusText, setStatusText] = useState(decodedToken ? decodedToken['Role'] === 'Order Manager' ? 'All' : 'Paid' : 'Paid');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (text) => {
        setAnchorEl(null);
        setStatusText(text);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (decodedToken && decodedToken['Role'] === 'Shipper') {
                    const response = await fetch(`https://localhost:7061/api/Order/getShipperOrders?id=${decodedToken["Id"]}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`
                        },
                    });
                    if (response.status !== 200) {
                        navigate('/login');
                    }
                    const datas = await response.json();
                    const dashboardOrders = datas.map(data => ({
                        id: data.orderId,
                        dateCreated: data.dateCreated,
                        items: data.productDetails,
                        status: data.status,
                        total: data.amountTotal,
                        shippingDetails: data.shippingDetails
                    }));
                    setOrders(dashboardOrders);
                } else {
                    const response = await fetch(`https://localhost:7061/api/Order/getAllOrders?status=${statusText}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`
                        },
                    });
                    if (response.status === 401) {
                        navigate('/login');
                    }
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const datas = await response.json();
                    const dashboardOrders = datas.map(data => ({
                        id: data.orderId,
                        dateCreated: data.dateCreated,
                        items: data.productDetails,
                        status: data.status,
                        total: data.amountTotal,
                        shippingDetails: data.shippingDetails
                    }));
                    setOrders(dashboardOrders);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [statusText]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const dataFiltered = applyOrderFilter({
        inputData: orders,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    const editOrder = (id) => {
        navigate('/dashboard/orders/editOrder', { state: { id: id } });
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Orders</Typography>
            </Stack>

            <Card>
                <UserTableToolbar
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={orders.length}
                                onRequestSort={handleSort}
                                headLabel={[
                                    { id: 'id', label: 'Order ID', width: '15%'},
                                    { id: 'dateCreated', label: 'Date Created', width: '20%'},
                                    { id: 'items', label: 'Items', width: '48%'},
                                    { id: 'total', label: 'Total', width: '12%'},
                                    { id: 'status', label: 'Status', align: 'center', width: '5%' },
                                    decodedToken ? decodedToken['Role'] === 'Order Manager' || decodedToken['Role'] === 'Order Processor' || decodedToken['Role'] === 'Shipper' || decodedToken['Role'] === 'Warehouse Staff' ? { id: '', label: '' } : null : null,
                                ].filter(Boolean)}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <OrderTableRow
                                            id={row.id}
                                            dateCreated={row.dateCreated}
                                            items={row.items}
                                            status={row.status}
                                            total={row.total}
                                            edit={() => { editOrder(row.id) }}
                                            userRole={decodedToken ? decodedToken['Role'] : null}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <div style={{ display: decodedToken ? decodedToken['Role'] === 'Order Manager' ? 'flex' : 'none' : 'none', position: 'absolute', zIndex: '1000', marginLeft: '15px' }}>
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
                            marginTop: '6px',
                            height: '40px'
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
            </Card>
        </Container>
    );
}
