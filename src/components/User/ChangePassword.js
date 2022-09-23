import React from 'react'
import encrypt from '../../encrypt';
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import DialogBox from '../UI/DialogBox';
import axios from 'axios';
import {useCookies} from 'react-cookie'
import './changepassword.css';
import Loading from '../UI/Loading';

const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    }
}
export default function ChangePassword(){
    const inputStyle={
        width:'28rem',
        height:'4rem',
        fontSize:'1.5rem'
    }
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [cookie] = useCookies();
    const [viewPassword, setViewPassword] = React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const [passData, setPassDate] = React.useState({
        password:"",
        newPassword:"",
        cmfPassword:""
    })
    
    function handleClose(e){
        window.location.replace('/myaccount');
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
    const handleBackPass=()=>{
        window.location.replace('/myaccount');
    }
    const handleSubmitPass=async(event)=>{
        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(passData.password===""){
            dispatch({type:"OPEN",value:{open:true,text:'Please Enter Current Password or OTP',header:"Invalid Input"}});
        } 
        else if(passData.newPassword===""){
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
            const data={ auth:encrypt[1].decrypt(cookie['auth']),
                            username:encrypt[1].decrypt(cookie['username']),
                            password:passData.password,
                            key:encrypt[1].decrypt(cookie['key']),
                            changePass:true
                } 
            const login = await axios.post(`${process.env.REACT_APP_SERVER}/login`,{data});
            if(login.data.status){
                const token = cookie['token'];
                const updateData = {username:login.data.data[0].username,auth:login.data.data[0].auth, password: passData.newPassword,id:login.data.data[0].id};
                const changePassword = await axios.post(`${process.env.REACT_APP_SERVER}/changePassword`,{
                    headers: {
                            Authorization: token
                        },
                        updateData})
                     setLoading(false);
                    if(changePassword.data.status){
                        dispatch({type:"OPEN",value:{open:true,text:'Your Password Has Been Successfully Changed.',header:"Password Changed Successfully."}});
                    }else{
                        dispatch({type:"OPEN",value:{open:true,text:changePassword.data.message,header:"Unable To Change Password."}});
                    }
                }
            
            else{        
                setLoading(false);     
                dispatch({type:"OPEN",value:{open:true,text:login.data.message,header:"Unable To Change Password."}});
            }
            setPassDate({
                password:"",
                newPassword:"",
                cmfPassword:""
            })
        }
    }
    
    return(
        <>
        {!loading && <>
        <div className='cp-pageStyle'>
        <div className='cp-formDivStyle'>
        <div>
        <h1>Change Password</h1><br/>

        <Input
            autoFocus
            type={viewPassword?"text":"password"}
            variant='outlined'
            margin="dense"
            id="password"
            name="password"
            placeholder='Current Password'
            value={passData.password}
            onChange={(event)=>{handleChangePass(event)}}
            style={inputStyle}
            endAdornment={
                <InputAdornment position="end">          
                <IconButton
                    onClick = {(event) => handlePasswordView(event)}
                >
                    {viewPassword ? <Visibility fontSize="large"/>:<VisibilityOff fontSize="large"/>}
                </IconButton>
                </InputAdornment>
            }
            /><br/><br/> 
        <Input
            autoFocus
            type="password"
            variant='outlined'
            margin="dense"
            id="newPassword"
            name="newPassword"
            placeholder='New Password'
            value={passData.newPassword}
            onChange={(event)=>{handleChangePass(event)}}
            style={inputStyle}
            /><br/><br/>

        <Input
            autoFocus
            type="password"
            variant='outlined'
            margin="dense"
            id="cmfPassword"
            name="cmfPassword"
            placeholder='Confirm Password'
            value={passData.cmfPassword}
            onChange={(event)=>{handleChangePass(event)}}
            style={inputStyle}
            /><br/><br/>
        <button className="cp-button" onClick={(e)=>{handleSubmitPass(e)}}>Submit</button><br/>
        <button className="cp-button" onClick={(e)=>{handleBackPass(e)}}>Back</button><br/>
        </div>
        </div>
        </div>
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
        </>}
        {loading && <Loading/>}

    </>   
    );
}