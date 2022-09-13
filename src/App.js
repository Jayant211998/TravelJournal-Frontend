import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './components/Destination/Main'
import AddLocation from './components/Destination/AddLocation'
import Login from './components/User/Login'
import Register from './components/User/Register'
import EditLocation from './components/Destination/EditLocation'
import NoPage from "./components/NoPage";
import MyAccount from "./components/User/MyAccount";
import Header from './components/UI/Header';
import React from 'react';
import ErrorPage from './components/ErrorPage';
import DestinationDetails from './components/User/DestinationDetails';
import ChangePassword from './components/User/ChangePassword';
import ChangeDetails from './components/User/ChangeDetails';
import ForgetPassword from './components/User/ForgetPassword'

function App() {
  const path=(window.location.pathname.split('/').pop());
  return (
    <div className="App">      
      {path && path!=='register' && path!=='changepassword' &&path!=='forgetpassword' &&<Header  />}
      <BrowserRouter>
      {
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgetpassword" element={<ForgetPassword />} />
                <Route path="myaccount" element={<MyAccount />}/>
                <Route path="myaccount/edit" element={<ChangeDetails />}/>
                <Route path="myaccount/changepassword" element={<ChangePassword />}/>
                <Route path="myaccount/destinationdetails" element={<DestinationDetails />}/>
                <Route path="myaccount/destinationdetails/addLocation" element={<AddLocation />} />
                <Route path="myaccount/destinationdetails/editLocation/:id" element={<EditLocation />} />
                <Route path="main" element={<Main />}/>
                <Route path="errorpage" element={<ErrorPage />}/>
                <Route path="*" element={<NoPage />} />
            </Routes>            
     }
    </BrowserRouter>
    </div>
  );
}

export default App;