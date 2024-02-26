import React from 'react';
import MainPage from './Main Page/Pages/MainPage';
import SignIn from './Main Page/Pages/SignIn';
import SignUp from './Main Page/Pages/SignUp';
import NotFound from './Main Page/Pages/NotFound';
import ResetPassword from './Main Page/Pages/ResetPassword';
import Otp from './Main Page/Pages/Otp';
import NewPassword from './Main Page/Pages/NewPassword';
import TestUpload from './Main Page/Pages/TestUpload';
import AppPage from './Admin Page/Pages/app';
import DashboardLayout from './Admin Page/layouts/dashboard';
import ProductsPage from './Admin Page/Pages/products';
import UserPage from './Admin Page/Pages/user';
import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AuthRoute from './Admin Page/routes/AuthRoute';
import CreateUser from './Admin Page/Pages/createUser';
import CategoryPage from './Admin Page/Pages/category';
import CreateCategory from './Admin Page/Pages/createCategory';
import EditCategory from './Admin Page/Pages/editCategory';
import EditUser from './Admin Page/Pages/editUser';
import CreateProduct from './Admin Page/sections/products/view/create-product';
import EditProduct from './Admin Page/sections/products/view/edit-product';

function App() {
    return (
      <HelmetProvider>
      <Suspense>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/newpassword" element={<NewPassword />} />
            <Route path="/testupload" element={<TestUpload />} />
            
            <Route
            path="/dashboard/"
            element={
              <AuthRoute>
                <DashboardLayout>
                  <AppPage />
                </DashboardLayout>
              </AuthRoute>
            }
            />
            <Route
            path="/dashboard/products"
            element={
              <AuthRoute>
                <DashboardLayout>
                  <ProductsPage />
                </DashboardLayout>
              </AuthRoute>
            }
            />
            <Route
            path="/dashboard/products/createProduct"
            element={
              <AuthRoute>
                <DashboardLayout>
                  <CreateProduct />
                </DashboardLayout>
              </AuthRoute>
            }
            />
            <Route
              path="/dashboard/products/editProduct"
              element={
                <AuthRoute>
                  <DashboardLayout>
                    <EditProduct />
                  </DashboardLayout>
                </AuthRoute>
              }
            />
            <Route
            path="/dashboard/users"
            element={
              <AuthRoute>
                <DashboardLayout>
                  <UserPage />
                </DashboardLayout>
              </AuthRoute>
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
                <AuthRoute>
                  <DashboardLayout>
                    <CategoryPage />
                  </DashboardLayout>
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard/categories/createCategory"
              element={
                <AuthRoute>
                  <DashboardLayout>
                    <CreateCategory />
                  </DashboardLayout>
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard/categories/editCategory"
              element={
                <AuthRoute>
                  <DashboardLayout>
                    <EditCategory />
                  </DashboardLayout>
                </AuthRoute>
              }
            />
          </Routes>
      </Suspense>
    </HelmetProvider>
    );
  }
  
  export default App;
