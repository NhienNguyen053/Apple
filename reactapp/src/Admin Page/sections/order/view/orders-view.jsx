import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Iconify from '../../../Components/iconify';
import Scrollbar from '../../../Components/scrollbar';
import TableNoData from '../../user/table-no-data';
import UserTableRow from '../../user/user-table-row';
import UserTableHead from '../../user/user-table-head';
import TableEmptyRows from '../../user/table-empty-rows';
import UserTableToolbar from '../../user/user-table-toolbar';
import jwt_decode from 'jwt-decode';
import { emptyRows, applyOrderFilter, getComparator } from '../../user/utils';
import Cookies from 'js-cookie';
import Modal from '../../../Components/Modal';
import OrderTableRow from '../order-table-row';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:7061/api/Order/getAllOrders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                });
                if (response.status === 401) {
                    navigate('/signin');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const datas = await response.json();
                const dashboardOrders = datas.map(data => ({
                    id: data.orderId,
                    dateCreated: data.dateCreated,
                    customerId: data.customerId,
                    status: data.status,
                    total: data.amountTotal,
                    itemCount: data.productDetails.reduce((total, product) => total + product.quantity, 0)
                }));
                setOrders(dashboardOrders);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

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
                                    { id: 'id', label: 'ID' },
                                    { id: 'dateCreated', label: 'Date Created' },
                                    { id: 'customerId', label: 'Customer Id' },
                                    { id: 'itemCount', label: 'Item Count' },
                                    { id: 'total', label: 'Total' },
                                    { id: 'status', label: 'Status', align: 'center' },
                                    decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Order Manager' ? { id: '', label: '' } : null : null,
                                ].filter(Boolean)}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <OrderTableRow
                                            id={row.id}
                                            dateCreated={row.dateCreated}
                                            customerId={row.customerId}
                                            status={row.status}
                                            total={row.total}
                                            itemCount={row.itemCount}
                                            edit={() => { editOrder(row.id) }}
                                            userRole={decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null}
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
