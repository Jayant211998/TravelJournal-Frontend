import React from 'react'
import Input from "@material-ui/core/Input";
import DialogBox from '../UI/DialogBox';
import axios from 'axios'
import './changepassword.css';
import Loading from '../UI/Loading';

const reducer=(state,action)=>{
  switch(action.type){
    case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
  }
}
export default function ForgetPassword(){
  const inputStyle={
    width:'28rem',
    height:'4rem',
    fontSize:'1.5rem'

}
const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
const [loading,setLoading] = React.useState(false);
const [formData,setFormData] = React.useState({
    auth:"",
    username:"",
    });
    function handleClose(e){
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
        dispatch({type:"OPEN",value:{open:true,text:'Please Select Authrization',header:"Invalid Input"}});
      }
      else if(formData.username===""){
        dispatch({type:"OPEN",value:{open:true,text:'Please Enter Your Email',header:"Invalid Input"}});
      }
      else{
        setLoading(true);
        const data={ auth:formData.auth,
                     username:formData.username
                  }
        const forgetPassword = await axios.post(`${process.env.REACT_APP_SERVER}/forgetPassword`,{data});
        setLoading(false);
        if(forgetPassword.data.resp && forgetPassword.data.status){
          dispatch({type:"OPEN",value:{open:true,text:'Check Email "+formData.username+"for Temporary Password Login With it and Change it from My Profile.',header:"E-Mail Sent"}});
        }
        else{
          dispatch({type:"OPEN",value:{open:true,text:'forgetPassword.data.message',header:"Unable to send Mail."}});
        }
      }
      
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
       
           <button onClick={(e)=>{handlePassword(e);}} className="cp-button"> Forget Password </button><br/>
            
          <br/>
     </div>
     </div>

    </div>
    {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
      </>}
      {loading && <Loading/>}

    </>
    );
}