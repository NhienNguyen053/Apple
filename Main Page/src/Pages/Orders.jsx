import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { TableRow, TableCell } from '@mui/material';
import { fCurrency } from '../Components/utils/format-number';
import Label from '../Components/label';
import UserTableHead from '../Components/user-table-head';
import { applyOrderFilter, getComparator } from '../Components/utils';
import Button from '../Components/Button';
import { useNavigate } from "react-router-dom";

const Orders = () => {
    let navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Canceled':
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
                const response = await fetch(`https://localhost:7061/api/Order/getUserOrders?userId=${decodedToken['Id']}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else { }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchUser();
    }, []);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const dataFiltered = applyOrderFilter({
        inputData: orders,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const routeChange = () => {
        let path = `/`;
        navigate(path);
    }

    return (
        <>
            <Navbar darkmode={false} />
            <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', margin: '48px 0 48px 0' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ width: '66%', margin: 'auto auto 35px auto', display: 'flex', flexWrap: 'wrap' }}>
                        {orders ? orders.length > 0 ? (
                            <>
                                <p style={{ width: '100%', color: 'black', fontSize: '40px', fontFamily: 'SF-Pro-Display-Semibold' }}>Products you've ordered.</p>
                                <div style={{ minHeight: '70vh' }}>
                                    <UserTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={orders.length}
                                        onRequestSort={handleSort}
                                        headLabel={[
                                            { id: 'id', label: 'Order ID', width: '15%' },
                                            { id: 'dateCreated', label: 'Date Created', width: '15%' },
                                            { id: 'items', label: 'Items', width: '50%' },
                                            { id: 'total', label: 'Total', width: '15%' },
                                            { id: 'status', label: 'Status', align: 'center', width: '5%' },
                                            { id: 'action', label: 'Action', align: 'center', width: '5%' },
                                        ]}
                                    />
                                    {orders ? orders.map((order) => (
                                        <TableRow hover tabIndex={-1} role="checkbox">
                                            <TableCell>{order.orderId}</TableCell>
                                            <TableCell>{new Date(order.dateCreated).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', })}</TableCell>
                                            <TableCell>
                                                {order.productDetails.map((item, index) => (
                                                    <>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: index !== order.productDetails.length - 1 ? '10px' : '0' }}>
                                                            <p style={{ color: 'black', width: '70%' }}>{item.productName}</p>
                                                            <div style={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
                                                                <img src={item.image} style={{ width: '50px', height: '50px' }} />
                                                            </div>
                                                            <p style={{ color: 'black', width: '5%' }}>({item.quantity})</p>
                                                        </div>
                                                    </>
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
                                    )) : (
                                        <></>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='container3' style={{ width: '75%' }}>
                                    <p className='p5'>You currently have no orders!</p>
                                    <Button background={'#0071e3'} onclick={routeChange} text={"Back to shopping"} radius={'10px'} fontSize={'16px'} margin={'0 auto 100px auto'} width={'300px'} height={'34px'} />
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Orders;
