import React from 'react'
import Button from '@material-ui/core/Button';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogBox from '../UI/DialogBox';
import encrypt from '../../encrypt'
import axios from 'axios'
import {useCookies} from 'react-cookie'

export default function Login(){
const [text,setText] = React.useState('')
const [open,setOpen] = React.useState(false); 
const [header,setHeader] = React.useState("Invalid Input Given")
const [cookie,setCookie] = useCookies(["username","auth","name"])
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
    const handlePassword=async()=>{
      if(formData.auth===""){
         setOpen(true);
        setText("Please Select Authrization")
      }
      else if(formData.username===""){
        setOpen(true);
        setText("Please Enter Your Email ")
      }
      else{
        const data={ auth:formData.auth,
                     username:formData.username
                  }
        const forgetPassword = await axios.post(`${process.env.REACT_APP_SERVER}/forgetPassword`,{data});
        if(forgetPassword.data.resp && forgetPassword.data.status){
            setOpen(true);
            setText("Check Email "+formData.username+"for Temporary Password Login With it and Change it from My Profile.");
            setHeader("E-Mail Sent")
          }
        else{
            setOpen(true);
            setText(forgetPassword.data.message);
            setHeader("Unable to send Mail.")
        }
      }
      
    }

    const handleLogin=async()=>{
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
      const data={ auth:formData.auth,
                   username:formData.username,
                   password:formData.password,
                   key:formData.key
                }
                
        const login = await axios.post(`${process.env.REACT_APP_SERVER}/login`,{data});
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

    const formStyle = {margin:'8% auto',
                       width:'50%',
                       height:'100%',
                       backgroundColor:'white'
                    }
    return(
    <>
     <div style={formStyle}>
     <h1>Login</h1><br/>
     <form style={{textAlign:'left',marginLeft:'35%'}}>

        <input type="radio" id="admin" name="auth" value='admin' onChange={(e)=>{handleChange(e)}}/>
          <label htmlFor="admin">Admin</label>
          <input type="radio" id="user" name="auth" value='user' onChange={(e)=>{handleChange(e)}}/>
          <label htmlFor="user">User</label><br/><br/>
       
        <InputLabel htmlFor="username">
              Email        
        </InputLabel>  
        <Input
          autoFocus
          variant='outlined'
          margin="dense"
          id="username"
          name="username"
          value={formData.username}
          onChange={(event)=>{handleChange(event)}}
          style={{width:'50%'}}
        />      
      <br/><br/><InputLabel htmlFor="password">
              Password        
        </InputLabel>
        <Input 
            autoFocus
            variant='outlined'
            margin="dense"
            id="password"
            name="password"
            type={viewPassword?"text":"password"}
            value={formData.password}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
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
           <InputLabel htmlFor="key">
              Key        
            </InputLabel>
          <Input
            autoFocus
            variant='outlined'
            margin="dense"
            id="key"
            name="key"
            type={viewKey?"text":"password"}
            value={formData.key}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
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
          <Button style={{marginTop:'0',marginLeft:'24%'}} onClick={()=>{handlePassword();}}>Forget Password</Button><br/>
           <Button style={{marginLeft:'7%'}} onClick={()=>{handleLogin(); }}>
             Login
            </Button>
         <Button onClick={()=>{window.location.replace('/register')}}>Register</Button>
     </form>
     </div>
     {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}

    </>
    );
}