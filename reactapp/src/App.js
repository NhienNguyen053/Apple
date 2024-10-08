import React from 'react';
import MainPage from './Main Page/Pages/MainPage';
import SignIn from './Main Page/Pages/SignIn';
import SignUp from './Main Page/Pages/SignUp';
import NotFound from './Main Page/Pages/NotFound';
import ResetPassword from './Main Page/Pages/ResetPassword';
import Otp from './Main Page/Pages/Otp';
import NewPassword from './Main Page/Pages/NewPassword';
import AppPage from './Admin Page/Pages/app';
import DashboardLayout from './Admin Page/layouts/dashboard';
import ProductsPage from './Admin Page/Pages/products';
import UserPage from './Admin Page/Pages/user';
import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AuthRoute0 from './Admin Page/routes/AuthRoute0';
import AuthRoute from './Admin Page/routes/AuthRoute';
import AuthRoute2 from './Admin Page/routes/AuthRoute2';
import AuthRoute3 from './Admin Page/routes/AuthRoute3';
import CreateUser from './Admin Page/Pages/createUser';
import CategoryPage from './Admin Page/Pages/category';
import CreateCategory from './Admin Page/Pages/createCategory';
import EditCategory from './Admin Page/Pages/editCategory';
import EditUser from './Admin Page/Pages/editUser';
import CreateProduct from './Admin Page/sections/products/view/create-product';
import EditProduct from './Admin Page/sections/products/view/edit-product';
import Category from './Main Page/Pages/Category';
import AuthRouteCategories from './Admin Page/routes/AuthRouteCategories';
import CreateSubcategory from './Admin Page/sections/category/view/create-subcategory';
import EditSubcategory from './Admin Page/sections/category/view/edit-subcategory';
import Product from './Main Page/Pages/Product';
import AuthRouteProducts from './Admin Page/routes/AuthRouteProducts';
import ShoppingCart from './Main Page/Pages/ShoppingCart';
import Failed from './Main Page/Pages/Failed';
import Success from './Main Page/Pages/Success';
import Order from './Main Page/Pages/Order';
import Checkout from './Main Page/Pages/Checkout';
import OrdersView from './Admin Page/sections/order/view/orders-view';
import EditOrder from './Admin Page/sections/order/view/edit-order';

function App() {
    return (
            <HelmetProvider>
                <Suspense>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route
                            path="/:category"
                            element={
                                <AuthRouteCategories>
                                    <Category key={window.location.pathname} />
                                </AuthRouteCategories>
                            }
                        />
                        <Route
                            path="/:category/:product"
                            element={
                                <AuthRouteProducts>
                                    <Product key={window.location.pathname} />
                                </AuthRouteProducts>
                            }
                        />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/resetpassword" element={<ResetPassword />} />
                        <Route path="/otp" element={<Otp />} />
                        <Route path="/notfound" element={<NotFound />} />
                        <Route path="/newpassword" element={<NewPassword />} />
                        <Route path="/cart" element={<ShoppingCart />} />
                        <Route path="/failed" element={<Failed />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="/order" element={<Order />} />
                        <Route path="/checkout" element={<Checkout />} />
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
