import React from 'react';
import { Navigate } from 'react-router-dom';
import AppPage from './Pages/app';
import DashboardLayout from './layouts/dashboard';
import ProductsPage from './Pages/products';
import UserPage from './Pages/user';
import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AuthRoute0 from './routes/AuthRoute0';
import AuthRoute from './routes/AuthRoute';
import AuthRoute2 from './routes/AuthRoute2';
import AuthRoute3 from './routes/AuthRoute3';
import CreateUser from './Pages/createUser';
import CategoryPage from './Pages/category';
import CreateCategory from './Pages/createCategory';
import EditCategory from './Pages/editCategory';
import EditUser from './Pages/editUser';
import CreateProduct from './sections/products/view/create-product';
import EditProduct from './sections/products/view/edit-product';
import CreateSubcategory from './sections/category/view/create-subcategory';
import EditSubcategory from './sections/category/view/edit-subcategory';
import OrdersView from './sections/order/view/orders-view';
import EditOrder from './sections/order/view/edit-order';
import NotFound from './Pages/NotFound';
import Login from './Pages/login';
import ResetPassword from './Pages/ResetPassword';

function App() {
    return (
            <HelmetProvider>
                <Suspense>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login/" replace />} />
                        <Route path="/login" element={ <Login /> } />
                        <Route path="/notfound" element={ <NotFound /> }/>
                        <Route path="/resetpassword" element={ <ResetPassword /> } />
                        <Route path="*" element={<Navigate to="/notfound" replace />} />
                        <Route
                            path="/dashboard/"
                            element={
                                <AuthRoute0>
                                    <DashboardLayout>
                                        <AppPage />
                                    </DashboardLayout>
                                </AuthRoute0>
                            }
                        />
                        <Route
                            path="/dashboard/products"
                            element={
                                <AuthRoute0>
                                    <DashboardLayout>
                                        <ProductsPage />
                                    </DashboardLayout>
                                </AuthRoute0>
                            }
                        />
                        <Route
                            path="/dashboard/products/createProduct"
                            element={
                                <AuthRoute2>
                                    <DashboardLayout>
                                        <CreateProduct />
                                    </DashboardLayout>
                                </AuthRoute2>
                            }
                        />
                        <Route
                            path="/dashboard/products/editProduct"
                            element={
                                <AuthRoute2>
                                    <DashboardLayout>
                                        <EditProduct />
                                    </DashboardLayout>
                                </AuthRoute2>
                            }
                        />
                        <Route
                            path="/dashboard/users"
                            element={
                                <AuthRoute0>
                                    <DashboardLayout>
                                        <UserPage />
                                    </DashboardLayout>
                                </AuthRoute0>
                            }
                        />
                        <Route
                            path="/dashboard/users/createUser"
                            element={
                                <AuthRoute>
                                    <DashboardLayout>
                                        <CreateUser />
                                    </DashboardLayout>
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="/dashboard/users/editUser"
                            element={
                                <AuthRoute>
                                    <DashboardLayout>
                                        <EditUser />
                                    </DashboardLayout>
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="/dashboard/categories"
                            element={
                                <AuthRoute0>
                                    <DashboardLayout>
                                        <CategoryPage />
                                    </DashboardLayout>
                                </AuthRoute0>
                            }
                        />
                        <Route
                            path="/dashboard/categories/createCategory"
                            element={
                                <AuthRoute2>
                                    <DashboardLayout>
                                        <CreateCategory />
                                    </DashboardLayout>
                                </AuthRoute2>
                            }
                        />
                        <Route
                            path="/dashboard/categories/editCategory"
                            element={
                                <AuthRoute2>
                                    <DashboardLayout>
                                        <EditCategory />
                                    </DashboardLayout>
                                </AuthRoute2>
                            }
                        />
                        <Route
                            path="/dashboard/categories/createSubcategory"
                            element={
                                <AuthRoute2>
                                    <DashboardLayout>
                                        <CreateSubcategory />
                                    </DashboardLayout>
                                </AuthRoute2>
                            }
                        />
                        <Route
                            path="/dashboard/categories/editSubcategory"
                            element={
                                <AuthRoute2>
                                    <DashboardLayout>
                                        <EditSubcategory />
                                    </DashboardLayout>
                                </AuthRoute2>
                            }
                        />
                        <Route
                            path="/dashboard/orders"
                            element={
                                <AuthRoute0>
                                    <DashboardLayout>
                                        <OrdersView />
                                    </DashboardLayout>
                                </AuthRoute0>
                            }
                        />
                        <Route
                            path="/dashboard/orders/editOrder"
                            element={
                                <AuthRoute3>
                                    <DashboardLayout>
                                        <EditOrder />
                                    </DashboardLayout>
                                </AuthRoute3>
                            }
                        />
                    </Routes>
                </Suspense>
            </HelmetProvider>
    );
  }
  
  export default App;
