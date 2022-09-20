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
import React,{useState} from 'react';
import ErrorPage from './components/ErrorPage';
import DestinationDetails from './components/Destination/DestinationDetails';
import ChangePassword from './components/User/ChangePassword';
import ChangeDetails from './components/User/ChangeDetails';
import ForgetPassword from './components/User/ForgetPassword'
import {useCookies} from 'react-cookie'; 

function App() {

  React.useEffect(() => {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const [width, setWidth]   = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
  }
  const [cookie]  = useCookies();
  const path=(window.location.pathname.split('/').pop());
  const validPath = cookie['token'] && path && path!=='register' && path!=='changepassword' && path!=='forgetpassword'
  const AppContext = React.createContext();
  return (
    <div className="App">      
      {validPath &&<Header />}
      <AppContext.Provider value={{}}>
      <div className={validPath?"margin-top5":"margin-top0"}>
      <BrowserRouter >
      {
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="register" element={<Register/>} />
                <Route path="forgetpassword" element={<ForgetPassword/>} />
                <Route path="myaccount" element={cookie['token']?<MyAccount/>:<Login/>}/>
                <Route path="myaccount/edit" element={cookie['token']?<ChangeDetails/>:<Login/>}/>
                <Route path="myaccount/changepassword" element={cookie['token']?<ChangePassword/>:<Login/>}/>
                <Route path="myaccount/destinationdetails" element={cookie['token']?<DestinationDetails/>:<Login/>}/>
                <Route path="myaccount/destinationdetails/addLocation" element={cookie['token']?<AddLocation/>:<Login/>}/>
                <Route path="myaccount/destinationdetails/editLocation/:id" element={cookie['token']?<EditLocation/>:<Login/>}/>
                <Route path="main" element={cookie['token']?<Main/>:<Login/>}/>
                <Route path="errorpage" element={cookie['token']?<ErrorPage/>:<Login/>}/>
                <Route path="*" element={cookie['token']?<NoPage/>:<Login/>}/>
            </Routes>            
     }
    </BrowserRouter>
    </div>
    </AppContext.Provider>
    </div>
  );
}

export default App;
