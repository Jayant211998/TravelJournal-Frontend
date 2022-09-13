import React from 'react'
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogBox from '../UI/DialogBox';
import encrypt from '../../encrypt'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import './user.css';
import Loading from '../UI/Loading';


export default function Login(){
const [text,setText] = React.useState('')
const [open,setOpen] = React.useState(false); 
const [header,setHeader] = React.useState("Invalid Input Given")
const [cookie,setCookie] = useCookies(["username","auth","name"])
const [loading,setLoading] = React.useState(false);
const [formData,setFormData] = React.useState({
    auth:"",
    username:"",
    password:"",
    key:""
    });
    const [viewPassword, setViewPassword] = React.useState(false);
    const [viewKey, setViewKey] = React.useState(false);
    function handleClose(e){
      setOpen(false);
      setText('')
      setHeader('Invalid Input Given')
    }
    const handlePasswordView = (event) =>{
      setViewPassword(!viewPassword);
    }
    const handleKeyView = (event) =>{
      setViewKey(!viewKey);
    }
    const handleChange=(event)=>{
        setFormData((prev=>{
           return { ...prev,
            [event.target.name]:event.target.value}
        }))
    }
    
    const handleLogin=async(e)=>{
      e.preventDefault();
      if(formData.auth===""){
        setOpen(true);
        setText("Please Select Authrization")
      }
      else  if(formData.username===""){
        setOpen(true);
        setText("Please Enter Your Email ")
      }
      else  if(formData.password===""){
        setOpen(true);
        setText("Please Enter Password")
      }
      else  if(formData.auth==="admin" && formData.key===""){
        setOpen(true);
        setText("If You want to Login as Admin then You Need to provide Key")
      }
      else{
        setLoading(true);
      const data={ auth:formData.auth,
                   username:formData.username,
                   password:formData.password,
                   key:formData.key
                }
                
        const login = await axios.post(`${process.env.REACT_APP_SERVER}/login`,{data});
        setLoading(false);
        if(login.data.status){
            setCookie('id',encrypt[0].encrypt(login.data.data.id));
            setCookie('auth',encrypt[0].encrypt(login.data.data.auth));
            setCookie('name',encrypt[0].encrypt(login.data.data.name));
            setCookie('username',encrypt[0].encrypt(login.data.data.username));
            setCookie('token',(login.data.data.token));
            setCookie('image',(login.data.data.image));
            setCookie('key',encrypt[0].encrypt(login.data.data.key));
            window.location.replace('/main')
          } 
        else{              
            setOpen(true);
            setText(login.data.message);
            setHeader("Unable to Login")
        }
      }
    }
    const inputStyle={
            width:'300px',
            height:'40px',

    }
    return(
      <>
      {!loading && <>
    <div  className="pageStyle">
     <div className="formDivStyle">
     <div >
     <h1 >Login</h1><br/>
        <input type="radio" id="admin" name="auth" value='admin' onChange={(e)=>{handleChange(e)}}/>
          <label htmlFor="admin">Admin</label>
          <input type="radio" id="user" name="auth" value='user' onChange={(e)=>{handleChange(e)}}/>
          <label htmlFor="user">User</label><br/><br/>
       
        <Input
          autoFocus
          placeholder='Email'
          variant='outlined'
          margin="dense"
          id="username"
          name="username"
          value={formData.username}
          onChange={(event)=>{handleChange(event)}}
          style={inputStyle}
        />      
      <br/><br/>
        <Input 
            autoFocus
            placeholder='Password'
            variant='outlined'
            margin="dense"
            id="password"
            name="password"
            type={viewPassword?"text":"password"}
            value={formData.password}
            onChange={(event)=>{handleChange(event)}}
            style={inputStyle}
            endAdornment={
              <InputAdornment position="end">          
                <IconButton
                  onClick = {(event) => handlePasswordView(event)}
                >
                    {viewPassword ? <Visibility/>:<VisibilityOff/>}
                </IconButton>
              </InputAdornment>
            }
        />
          <br/><br/>
           {formData.auth==='admin' && <>
          <Input
            autoFocus
            placeholder='Key'
            variant='outlined'
            margin="dense"
            id="key"
            name="key"
            type={viewKey?"text":"password"}
            value={formData.key}
            onChange={(event)=>{handleChange(event)}}
            style={inputStyle}
            endAdornment={
              <InputAdornment position="end">          
                <IconButton
                  onClick = {(event) => handleKeyView(event)}
                >
                    {viewKey ? <Visibility/>:<VisibilityOff/>}
                </IconButton>
              </InputAdornment>
            }
          /></>}
           <button onClick={(e)=>{handleLogin(e);}} className="button"> Login </button><br/>
            <p className="link">
              <a href='/forgetpassword' >Forget Password</a>/
              <a href='/register'>Register</a>
            </p>
          <br/>
     </div>
     </div>

    </div>
    {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
      </>}
      {loading && <Loading/>}      
    </>
    );
}