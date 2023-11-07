import React from 'react'
import axios from 'axios'; 
import DialogBox from '../UI/DialogBox';
import Input from "@material-ui/core/Input";
import { v4 as uuid } from 'uuid';
import './register.css';
import Loading from '../UI/Loading';
import InputDialogBox from '../UI/InputDialogBox';
import {useCookies} from 'react-cookie';

 
const reducer=(state,action)=>{
  switch(action.type){
    case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    case "default":return{open:false,open1:false,open2:false,text:"",header:""}
  }
}

const inputStyle={
  width:'28rem',
  height:'4rem',
  marginTop:'0.5rem',
  fontSize:'1.5rem'
}
export default function Register(){

  // React.useLayoutEffect(()=>{
  //   const checkBackend=async()=>{
  //       const res = await axios.get(`${process.env.REACT_APP_SERVER}/check`);
  //       if(!res){
  //         throw new Error('There Is Some Server Issue. Please try After Some Time.');
  //       }
  //   }
  //   checkBackend()
  //   .then(()=>{
  //     if(cookie['token']){
  //       window.location.replace('/main');
  //     }
  //   })
  //   .catch((error)=>{
  //     dispatch({type:"OPEN",value:{open:true,text:error.message,header:"Server Issue"}});
  //   })
  // },[])
const unique_id = uuid();
const [cookie] = useCookies(["username","auth","name"]);
const [otp,setOtp] = React.useState("");
const [enteredOtp,setEnteredOtp] = React.useState("");
const [error,setError] = React.useState(false);
const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
const [userList, setUserList] = React.useState([]);
const [adminList, setAdminList] = React.useState([]);
const [loading,setLoading] = React.useState(false);
const [formData,setFormData] = React.useState({
    id:unique_id.slice(0,8),
    auth:"",
    username:"",
    name:"",
    password:"",
    cmf_password:"",
    key:"",
    image:""
    });
    

    React.useEffect(()=>{
      async function getAllUser (){
        const UserList = await axios.get(`${process.env.REACT_APP_SERVER}/getAllUser`);
        const AdminList = await axios.get(`${process.env.REACT_APP_SERVER}/getAllAdmin`);
        if(UserList.data.status && UserList.data.data){
          setUserList(UserList.data.data);
        }
        else if(UserList.data.status){
          window.location.replace('/errorpage');
        }
        else{
          dispatch({type:"OPEN",value:{open:true,text:UserList.data.message,header:"Unable To Do Email Validation."}});
        }

        if(AdminList.data.status && AdminList.data.data){
          setAdminList(AdminList.data.data);
        }
        else if(AdminList.data.status){
          window.location.replace('/errorpage');  
        }
        else{
          dispatch({type:"OPEN",value:{open:true,text:AdminList.data.message,header:"Unable To Do Email Validation."}});
        }
        
      }
      getAllUser();
    },[]);


    function handleClose(e){
      dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
    }
    function handleClose1(e){
      window.location.replace('/');
    }
    async function handleSubmit(e){
      if(otp===enteredOtp){
        dispatch({type:"OPEN",value:{open2:false,text:"",header:""}});
        setLoading(true);
          const data={ 
            id:unique_id.slice(0,8),
            auth:formData.auth,
            username:formData.username,
            name:formData.name,
            password:formData.password,
            key:formData.key,
            image:""
          }
          const register = await axios.post(`${process.env.REACT_APP_SERVER}/register`,{data});
        setLoading(false);
        if(register.data.status){
          dispatch({type:"OPEN1",value:{text:register.data.message,header:"Registration Successfully"}})
        }else{
          dispatch({type:"OPEN",value:{open:true,text:register.data.message,header:"Registration Failed."}});
        }
      }
      else{
        setError(true);
      }
    }

    const handleChange=(event)=>{
        setFormData(prev=>{
           return { ...prev,
            [event.target.name]:event.target.value}
        });
    }
    const handleChangeOTP=(event)=>{
      setEnteredOtp(event.target.value);
    }
    const handleRegister=async(e)=>{
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      if(formData.auth===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Select Authrization.',header:"Invalid Input"}});
      }
      else  if(formData.username===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter Your Email',header:"Invalid Input"}});
      }
      else if(!formData.username.match(validRegex)){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter a Valid Email',header:"Invalid Input"}});
      }
      else  if(formData.name===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter Your Name',header:"Invalid Input"}});
      }
      else  if(formData.password===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter Your Password',header:"Invalid Input"}});
      }
      else if(!formData.password.match(passw)){
        dispatch({type:"OPEN",value:{open:true,text:'Password should contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',header:"Invalid Input"}});
      }
      else  if(formData.cmf_password===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Confirm Your Password',header:"Invalid Input"}});
      }
      else  if(formData.auth==="admin" && formData.key===""){
        dispatch({type:"OPEN",value:{open:true,text:'If You want to Register as Admin then You Need to provide Key',header:"Invalid Input"}});
      }
      else  if(formData.cmf_password!==formData.password){
        dispatch({type:"OPEN",value:{open:true,text:'Password and Confirm Password Do Not match',header:"Invalid Input"}});
      }    
      else if(formData.auth==="admin" && adminList.find(ad =>ad.username===formData.username)){
        dispatch({type:"OPEN",value:{open:true,text:'This Username Already Exist As Admin',header:"Invalid Input"}});
      }
      else if(formData.auth==="user" && userList.find(ad =>ad.username===formData.username)){
        dispatch({type:"OPEN",value:{open:true,text:"This Username Already Exist As User",header:"Invalid Input"}});
      }
      else{
        const myotp = unique_id.slice(0,6); 
        setOtp(myotp);
        const data = {
          otp: myotp,
          username:formData.username,
        }
        await axios.post(`${process.env.REACT_APP_SERVER}/verifyuser`,{data});
        dispatch({type:"OPEN2",value:{text:"Email has been sent with an OTP to Email-ID with which you want to Register Please Enter that OTP to continue registration.",header:"Verify OTP"}});
    }
    }
    const registerForm =<div className="register-pageStyle">
    <div className="register-formDivStyle">
      <div>
    <h1 >Register</h1><br/>         
    <input type="radio" id="admin" name="auth" value='admin' onChange={(e)=>{handleChange(e)}}/>
    <label htmlFor="admin">Admin</label>
    <input type="radio" id="user" name="auth" value='user' onChange={(e)=>{handleChange(e)}}/>
    <label htmlFor="user">User</label><br/><br/>

    <Input
        autoFocus
        variant='outlined'
        margin="dense"
        id="username"
        name="username"
        value={formData.username}
        onChange={(event)=>{handleChange(event)}}
        style={inputStyle}
        placeholder="Email"
      /><br/>
      
      <Input
        autoFocus
        variant='outlined'
        margin="dense"
        id="name"
        name="name"
        value={formData.name}
        onChange={(event)=>{handleChange(event)}}
        style={inputStyle}
        placeholder="Name"

      /><br/>

      <Input
        autoFocus
        variant='outlined'
        margin="dense"
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={(event)=>{handleChange(event)}}
        style={inputStyle}
        placeholder="Password"

      /><br/>
      <Input
        autoFocus
        variant='outlined'
        margin="dense"
        id="cmf_password"
        name="cmf_password"
        type="password"
        value={formData.cmf_password}
        onChange={(event)=>{handleChange(event)}}
        style={inputStyle}
        placeholder="Confirm Password"

      /><br/>
      {formData.auth==='admin' && <>
      <Input
        autoFocus
        variant='outlined'
        margin="dense"
        id="key"
        name="key"
        type="password"
        value={formData.key}
        onChange={(event)=>{handleChange(event)}}
        style={inputStyle}
        placeholder="Key"
      /><br/></>}
      <br/>
       
      <button onClick={(e)=>{handleRegister(e);} } className="register-button">Register</button><br/>
      <p className="register-link">
          Already have an account ? <a href='/'>Sign In</a>
        </p>
      <br/>
 </div>
 </div>
 </div>
    return(<>
      {!loading && <>{registerForm}
     {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
     {state.open1 && <DialogBox text={state.text} handleClose={handleClose1} header={state.header}/>}
     {state.open2 && <InputDialogBox text={state.text} error={error} otp={enteredOtp} handleChange={handleChangeOTP} handleClose={handleSubmit} header={state.header}/>}
    </>}
      {loading && <Loading/>}

    </>);
}