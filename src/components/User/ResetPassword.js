import React from 'react';
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import DialogBox from '../UI/DialogBox';
import axios from 'axios';
import './changepassword.css';
import Loading from '../UI/Loading';

const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
      case "close": return{open:false,open1:false,open2:false,text:"",header:""}
    }
} 
export default function ResetPassword(){
    const inputStyle={
        width:'28rem',
        height:'4rem',
        fontSize:'1.5rem'
    }
    // React.useLayoutEffect(()=>{
    //     const checkBackend=async()=>{
    //         const res = await axios.get(`${process.env.REACT_APP_SERVER}/check`);
    //         if(!res){
    //           throw new Error('There Is Some Server Issue. Please try After Some Time.');
    //         }
    //     }
    //     checkBackend()
    //     .catch((error)=>{
    //       dispatch({type:"OPEN",value:{open:true,text:error.message,header:"Server Issue"}});
    //     })
    //   },[])
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [viewPassword, setViewPassword] = React.useState(false);
    const [viewcmfPassword, setViewCmfPassword] = React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const [passData, setPassDate] = React.useState({
        password:"",
        newPassword:"",
        cmfPassword:""
    })
    
    function handleClose(e){
        dispatch({type:"close"})
        // window.location.replace();
      }
      const handleCmfPasswordView = (event) =>{
        setViewCmfPassword(!viewcmfPassword);
      }
    const handlePasswordView = (event) =>{
        setViewPassword(!viewPassword);
      }
    const handleChangePass=(event)=>{
        setPassDate(prevFormData => {
            const e=event.target;
            return {
                ...prevFormData,
                [e.name]: e.value
            }
        })
    }
    const handleSubmitPass=async(event)=>{
        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(passData.newPassword===""){
            dispatch({type:"OPEN",value:{open:true,text:'Please Enter New Password',header:"Invalid Input"}});
        } 
        else if(passData.newPassword!==passData.cmfPassword){
            dispatch({type:"OPEN",value:{open:true,text:'New Password and Confirm Password Does Not Match',header:"Invalid Input"}});
            } 
        else if(!passData.newPassword.match(passw)){
            dispatch({type:"OPEN",value:{open:true,text:'Password should contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',header:"Invalid Input"}});
          }
        else{ 
            setLoading(true);
            const info = window.location.pathname.split("/");
            const data = {password:passData.newPassword};
            const resetPassword = await axios.post(`${process.env.REACT_APP_SERVER}/resetPassword/${info[2]}/${info[3]}`,{data});
            setLoading(false);
            if(resetPassword.data.status){
                dispatch({type:"OPEN",value:{open:true,text:'Your Password Has Been Successfully Changed.',header:"Password Changed Successfully."}});
            }else{
                dispatch({type:"OPEN",value:{open:true,text:resetPassword.data.message,header:"Unable To Change Password."}});
            }
            setPassDate({
                password:"",
                newPassword:"",
                cmfPassword:""
            })
        }
    }

    const resetPasswordForm = <div className='fp-pageStyle'>
    <div className='fp-formDivStyle'>
    <div>
    <h1>Reset Password</h1><br/>

    <Input
        autoFocus
        type={viewPassword?"text":"password"}
        variant='outlined'
        margin="dense"
        id="newPassword"
        name="newPassword"
        placeholder='New Password'
        value={passData.newPassword}
        onChange={(event)=>{handleChangePass(event)}}
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
        /><br/><br/>

    <Input
        autoFocus
        type={viewcmfPassword?"text":"password"}
        variant='outlined'
        margin="dense"
        id="cmfPassword"
        name="cmfPassword"
        placeholder='Confirm Password'
        value={passData.cmfPassword}
        onChange={(event)=>{handleChangePass(event)}}
        style={inputStyle}
        endAdornment={
            <InputAdornment position="end">          
            <IconButton
                onClick = {(event) => handleCmfPasswordView(event)}
            >
                {!viewcmfPassword ? <Visibility fontSize="large"/>:<VisibilityOff fontSize="large"/>}
            </IconButton>
            </InputAdornment>
        }
        /><br/><br/>
    <button className="cp-button" onClick={(e)=>{handleSubmitPass(e)}}>Submit</button><br/>
    </div>
    </div>
    </div>
    
    return(
        <>
        {!loading && <>{resetPasswordForm}
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
        </>}
        {loading && <Loading/>}
    </>   
    );
}