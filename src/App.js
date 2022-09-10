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
import {useCookies} from 'react-cookie';
import React from 'react';
import ErrorPage from './components/ErrorPage';

function App() {
  const [cookie,setCookie] = useCookies();
  return (
    <div className="App">      
      <Header/>
      <BrowserRouter>
      {
            
            // cookie['token']=='undefined'?
            <Routes>
                <Route path="register" element={<Register />} />
                <Route path="*" element={<Login />} />
            {/* </Routes>: */}
            {/* <Routes> */}
                <Route path="addLocation" element={<AddLocation />} />
                <Route path="editLocation/:id" element={<EditLocation />} />
                <Route path="myaccount" element={<MyAccount />}/>
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