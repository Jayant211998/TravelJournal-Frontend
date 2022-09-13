import React from 'react'
import Input from "@material-ui/core/Input";
import DialogBox from '../UI/DialogBox';
import axios from 'axios'
import {useCookies} from 'react-cookie'
import './user.css';
import Loading from '../UI/Loading';


export default function ForgetPassword(){
const [text,setText] = React.useState('')
const [open,setOpen] = React.useState(false); 
const [header,setHeader] = React.useState("Invalid Input Given")
const [cookie,setCookie] = useCookies(["username","auth","name"])
const [loading,setLoading] = React.useState(false);
const [formData,setFormData] = React.useState({
    auth:"",
    username:"",
    });
    function handleClose(e){
      setOpen(false);
      setText('')
      setHeader('Invalid Input Given')
      window.location.replace('/');

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
        setLoading(true);
        const data={ auth:formData.auth,
                     username:formData.username
                  }
        const forgetPassword = await axios.post(`${process.env.REACT_APP_SERVER}/forgetPassword`,{data});
        setLoading(false);
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
    const inputStyle={
            width:'300px',
            height:'40px',

    }
    return(
      <>
      {!loading && <>
    <div  className="fp-pageStyle">
     <div className="fp-formDivStyle">
     <div >
     <h1 >Forget Password</h1><br/>
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
       
           <button onClick={(e)=>{handlePassword(e);}} className="button"> Forget Password </button><br/>
            
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