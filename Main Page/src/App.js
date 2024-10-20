import React from 'react';
import MainPage from './Pages/MainPage';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import NotFound from './Pages/NotFound';
import ResetPassword from './Pages/ResetPassword';
import Otp from './Pages/Otp';
import NewPassword from './Pages/NewPassword';
import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Category from './Pages/Category';
import AuthRouteCategories from './Components/AuthRouteCategories';
import Product from './Pages/Product';
import AuthRouteProducts from './Components/AuthRouteProducts';
import ShoppingCart from './Pages/ShoppingCart';
import Result from './Pages/Result';
import Order from './Pages/Order';
import Checkout from './Pages/Checkout';
import Account from './Pages/Account';
import Orders from './Pages/Orders';
import AuthRouteUser from './Components/AuthRouteUser';

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
                        <Route path="/result" element={<Result />} />
                        <Route path="/order" element={<Order />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/account" element={<AuthRouteUser><Account /></AuthRouteUser>} />
                        <Route path="/account/orders" element={<AuthRouteUser><Orders /></AuthRouteUser>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </HelmetProvider>
    );
  }
  
  export default App;
