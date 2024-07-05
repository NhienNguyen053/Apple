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
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import jwt_decode from 'jwt-decode';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Cookies from 'js-cookie';
import Modal from '../../../Components/Modal';

// ----------------------------------------------------------------------

export default function UserPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [users, setUsers] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const jwtToken = Cookies.get('jwtToken');
  const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
  const [userName, setUserName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [error, setError] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch('https://localhost:7061/api/Users/getAllUsers', {
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
              const apiUsers = await response.json();
              const dashboardUsers = apiUsers.map(apiUser => ({
                  id: apiUser.id,
                  firstName: apiUser.firstName,
                  lastName: apiUser.lastName,
                  country: apiUser.country,
                  birthday: apiUser.birthday,
                  name: `${apiUser.firstName} ${apiUser.lastName}`,
                  email: apiUser.email,
                  isVerified: apiUser.verifiedAt,
                  phone: apiUser.phone,
                  role: apiUser.role
              }));
              setUsers(dashboardUsers);
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

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const routeChange = () => {
      navigate('/dashboard/users/createUser');
  }

  const editUser = (id) => {
      navigate('/dashboard/users/editUser', { state: { id: id } });
  }

  const deleteUser = async () => {
      const response = await fetch(`https://localhost:7061/api/Users/deleteUser?id=${deleteId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${jwtToken}`
          },
      });
      setModalVisible(!isModalVisible);
      if (response.status === 204) {
          setModalVisible2(true);
          setColor('rgb(255, 192, 203)');
          setError("Can't find user's account!");
      }
      else if (response.status === 400) {
          setModalVisible2(true);
          setColor('rgb(255, 192, 203)');
          setError("Can't delete admin's account!");
      }
      else {
          setModalVisible2(true);
          setTimeout(() => {
              setModalVisible2(false);
          }, 3000);
          setColor('rgb(192, 255, 203)');
          setError("Account deleted successfully!");
          const newUsers = users.filter(user => user.id !== deleteId);
          setUsers(newUsers);
      }
  }

  const toggleModal = (param, param1) => {
      setUserName(param);
      setDeleteId(param1);
      setModalVisible(!isModalVisible);
  };

  const toggleModal2 = () => {
      setModalVisible(!isModalVisible);
  }

  const toggleModal3 = () => {
      setModalVisible2(!isModalVisible2);
  }

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={routeChange} sx={{ display: decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' ? 'flex' : 'none' : null}}>
          {color}New User
        </Button>
      </Stack>

      <Card>
          {isModalVisible2 && (
              <div style={{ width: '95%', backgroundColor: `${color}`, padding: '15px', borderRadius: '10px', margin: '20px auto 0 auto' }}>
                  <span style={{ fontFamily: 'SF-Pro-Display-Medium', color: 'black' }}>{error}</span>
                  <button style={{ background: 'transparent', border: 'none', fontSize: '18px', float: 'right', lineHeight: '1', cursor: 'pointer' }} onClick={toggleModal3}>x</button>
              </div>
          )}
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
                rowCount={users.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'id', label: 'ID'},
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone Number' },
                  { id: 'role', label: 'Role' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' ? { id: '', label: '' } : null : null,
                ].filter(Boolean)}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      id={row.id}
                      name={row.name}
                      role={row.role}
                      email={row.email}
                      phone={row.phone}
                      isVerified={row.isVerified}
                      edit={() => {editUser(row.id)}}
                      remove={() => toggleModal(row.name, row.id)}
                      userRole={decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Modal name={userName} name2={"account"} name3={"user "} isVisible={isModalVisible} toggleModal={toggleModal2} func={deleteUser} />
    </Container>
  );
}
