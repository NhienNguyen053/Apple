import React from 'react';
import MainPage from './Main Page/Pages/MainPage';
import SignIn from './Main Page/Pages/SignIn';
import SignUp from './Main Page/Pages/SignUp';
import NotFound from './Main Page/Pages/NotFound';
import ResetPassword from './Main Page/Pages/ResetPassword';
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
      <>
        <Routes>
          <Route path = '/' element = { <MainPage />} />
          <Route path = '/signin' element = { <SignIn /> }/>
          <Route path = '/signup' element = { <SignUp /> }/>
          <Route path= '/resetpassword' element = { <ResetPassword /> }/>
          <Route path = '*' element = { <NotFound /> }/>
        </Routes>
      </>
    );
  }
  
  export default App;
