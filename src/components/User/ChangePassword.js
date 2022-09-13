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
import './user.css';
import Loading from '../UI/Loading';


export default function ChangePassword(){

    const [cookie,setCookie] = useCookies();
    const [text,setText] = React.useState('')
    const [header,setHeader] = React.useState("Invalid Input Given")
    const [open,setOpen] = React.useState(false); 
    const [viewPassword, setViewPassword] = React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const [passData, setPassDate] = React.useState({
        password:"",
        newPassword:"",
        cmfPassword:""
    })
    
    function handleClose(e){
        setOpen(false);
        setText('')
        setHeader('Invalid Input Given')
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
    const handleSubmitPass=async(event)=>{
        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(passData.password===""){
            setOpen(true);
            setText("Please Enter Current Password or OTP");
        } 
        else if(passData.newPassword===""){
            setOpen(true);
            setText("Please Enter New Password");
        } 
        else if(passData.newPassword!==passData.cmfPassword){
            setOpen(true);
            setText("New Password and Confirm Password Does Not Match");
        } 
        else if(!passData.newPassword.match(passw)){
            setOpen(true);
            setText("Password should contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
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
                        setOpen(true);
                        setText("Your Password Has Been Successfully Changed.");
                        setHeader("Password Changed Successfully.")
                    }else{
                        setOpen(true);
                        setText(changePassword.data.message);
                        setHeader("Unable To Change Password.")

                    }
                }
            
            else{        
                setLoading(false);      
                setOpen(true);
                setText(login.data.message);
                setHeader("Unable to Change Password")
            }
            setPassDate({
                password:"",
                newPassword:"",
                cmfPassword:""
            })
        }
    }
    const inputStyle={
        width:'300px',
        height:'40px',
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
                    {viewPassword ? <Visibility/>:<VisibilityOff/>}
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
        <button className="button" onClick={(e)=>{handleSubmitPass(e)}}>Submit</button><br/>
        </div>
        </div>
        </div>
        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
        </>}
        {loading && <Loading/>}

    </>   
    );
}