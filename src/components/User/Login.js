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
import './login.css';
import Loading from '../UI/Loading';



const reducer=(state,action)=>{
  switch(action.type){
    case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
  }
}
export default function Login(){
  const inputStyle={width:'28rem',
                    height: '4rem',
                    fontSize: '1.5rem'
                  }
                                                   
  React.useLayoutEffect(()=>{
    if(cookie['token']){
      window.location.replace('/main');
    }
  },[])
const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});

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
      dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
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
        dispatch({type:"OPEN",value:{open:true,text:'Please Select Authrization',header:"Invalid Input"}});
      }
      else  if(formData.username===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter Your Email',header:"Invalid Input"}});
      }
      else  if(formData.password===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter Password',header:"Invalid Input"}});
      }
      else  if(formData.auth==="admin" && formData.key===""){
        dispatch({type:"OPEN",value:{open:true,text:'If You want to Login as Admin then You Need to provide Key',header:"Invalid Input"}});
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
            window.location.reload();
            
          } 
        else{
          dispatch({type:"OPEN",value:{open:true,text:login.data.message,header:"Unable to Login"}});
        }
      }
    }
    const loginForm = <>
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
                    {!viewPassword ? <Visibility fontSize="large"/>:<VisibilityOff fontSize="large"/>}
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
              <InputAdornment position="end" >          
                <IconButton
                  onClick = {(event) => handleKeyView(event)}
                >
                    {!viewKey ? <Visibility fontSize="large"/>:<VisibilityOff fontSize="large"/>}
                </IconButton>
              </InputAdornment>
            }
          />
          
          </>}
           <button onClick={(e)=>{handleLogin(e);}} className="login-button"> Login </button><br/>
            <p className="links">
              <a href='/forgetpassword'>Forget Password</a>&nbsp;/&nbsp;
              <a href='/register' >  Register</a>
            </p>
          <br/>
     </div>
     </div>

    </div>
    {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
      </>
 
 
 
 
 
 return(
      <>
      {!loading && loginForm}
      {loading && <Loading/>}      
    </>
    );
}