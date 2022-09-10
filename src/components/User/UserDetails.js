import React from 'react';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import TextField from '@material-ui/core/TextField';
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { Button } from '@material-ui/core';
import {useCookies} from 'react-cookie'
import DialogBox from '../UI/DialogBox';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { storage } from '../../firebase';
import encrypt from '../../encrypt';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import axios from 'axios';


export default function UserDetails(){
    const imgStyle={height:"150px",
                width:"150px",
                borderRadius:"50%",
                margin:'0% 7.5%',
                border: '1px solid black' 
              }
    const imageRef = React.useRef(null);
    const [cookie,setCookie] = useCookies();
    const [text,setText] = React.useState('')
    const [header,setHeader] = React.useState("Invalid Input Given")
    const [open,setOpen] = React.useState(false);   
    const [edit,setEdit] = React.useState(false);
    const [pass,setPass] = React.useState(false)
    const [viewPassword, setViewPassword] = React.useState(false);
    const [image,setImage] = React.useState(cookie['image']);
    const [passData, setPassDate] = React.useState({
        password:"",
        newPassword:"",
        cmfPassword:""
    })
    const [formData,setFormData] = React.useState({
        username:encrypt[1].decrypt(cookie['username']),
        name:encrypt[1].decrypt(cookie['name']),
        image:cookie['image']
    });
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
    const handleChange=(event)=>{
        setFormData(prevFormData => {
            const e=event.target;
            return {
                ...prevFormData,
                [e.name]: e.value
            }
        })
    } 
    function handleClose(e){
        setOpen(false);
        setText('')
        setHeader('Invalid Input Given')
      }
    const handleEdit=(event)=>{
        setEdit(true);
        setPass(false);
    }
    const handlePassword=(event)=>{
        setPass(true);
        setEdit(false);
    }
    const handleSubmit=async(event)=>{
        if(formData.name===""){
            setOpen(true);
            setText("Please Enter Name")
        }
        else{
            let imgUrl = cookie['image'];
            if(image!==cookie['image']){
                const imgRef =  ref(storage , `travelJournal/user/${encrypt[1].decrypt(cookie['id'])}`);
                const imgUpload = await uploadBytes(imgRef, image);
                imgUrl = await getDownloadURL(imgRef);
            }
            const token = cookie['token'];
            const data = {...formData,auth:encrypt[1].decrypt(cookie['auth']),image:imgUrl};
            const updateUser = await axios.post(`${process.env.REACT_APP_SERVER}/upadateUser/${encrypt[1].decrypt(cookie['id'])}`,{
                headers: {
                  Authorization: token
               },
              data
            });
            if(updateUser.data.status){
                setOpen(true);
                setText(updateUser.data.message);
                setHeader("Updated User Details Successfully.");
                setCookie('name',encrypt[0].encrypt(formData.name));
                setCookie('image',imgUrl);
                setEdit(false);setPass(false);
            }else{
                setOpen(true);
                setText(updateUser.data.message);
                setHeader("Unable to Update User Details.");   
            }
        }
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
    else{ const data={ auth:encrypt[1].decrypt(cookie['auth']),
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
                    if(changePassword.data.status){
                        setOpen(true);
                        setText("Your Password Has Been Successfully Changed.");
                        setHeader("Password Changed Successfully.")
                    }else{
                        setOpen(true);
                        setText(changePassword.data.message);
                        setHeader("Unable To Change Password.")

                    }
                    setEdit(false);
                    setPass(false);
                }
            else{              
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
            const handleImg=(event)=>{
                imageRef.current.click();
            }
            const handleChangeImg = (e) =>{
                setImage((e.target.files[0]));
    }
    return(
    <>
    {edit && !pass &&
    <div style={{marginTop:'5%'}}>
    {image && image!=="undefined"?<><img src={image===cookie['image']?(image):URL.createObjectURL(image)} onClick={(e)=>handleImg(e)} style={imgStyle}/></>:
    <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true" onClick={(e)=>handleImg(e)} style={imgStyle}/></>}
    <input type="file" ref={imageRef} style={{display:"none"}} onChange={(e)=>{handleChangeImg(e)}}/>
    <form  onSubmit={(e)=>{handleSubmit(e)}}>
    <TextField
        autoFocus
        variant='outlined'
        margin="dense"
        id="name"
        name="name"
        label="Name"
        value={formData.name}
        onChange={(event)=>{handleChange(event)}}
        style={{width:'25%'}}
        /><br/>
   
    </form>
    <h3>UserName: {encrypt[1].decrypt(cookie['username'])}</h3>
    <h3>Authrization: {encrypt[1].decrypt(cookie['auth']).toUpperCase()}</h3>
    <Button onClick={(e)=>{handleSubmit(e)}}>Submit</Button>
    </div>
    }
    {!edit && pass &&
    <div style={{marginTop:'5%'}}>
    {cookie['image'] && cookie['image']!=="undefined"?<><img src={cookie['image']}  style={imgStyle}/></>:
    <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true"  style={imgStyle}/></>}
    <form  onSubmit={(e)=>{handleSubmitPass(e)}}>
    <InputLabel htmlFor="password">
              Current Password        
        </InputLabel>
    <Input
        autoFocus
        type={viewPassword?"text":"password"}
        variant='outlined'
        margin="dense"
        id="password"
        name="password"
        value={passData.password}
        onChange={(event)=>{handleChangePass(event)}}
        style={{width:'25%'}}
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
    <InputLabel htmlFor="password">
            New Password        
    </InputLabel>
    <Input
        autoFocus
        type="password"
        variant='outlined'
        margin="dense"
        id="newPassword"
        name="newPassword"
        value={passData.newPassword}
        onChange={(event)=>{handleChangePass(event)}}
        style={{width:'25%'}}
        /><br/><br/>
    <InputLabel htmlFor="password">
              Confirm Password        
    </InputLabel>
    <Input
        autoFocus
        type="password"
        variant='outlined'
        margin="dense"
        id="cmfPassword"
        name="cmfPassword"
        value={passData.cmfPassword}
        onChange={(event)=>{handleChangePass(event)}}
        style={{width:'25%'}}
        /><br/><br/>
    </form>
    <Button onClick={(e)=>{handleSubmitPass(e)}}>Submit</Button>

    
    </div>
    }
    
    {!edit && !pass &&
    <div style={{marginTop:'5%'}}>
    {cookie['image'] && cookie['image']!=="undefined"?<><img src={cookie['image']}  style={imgStyle}/></>:
    <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true"  style={imgStyle}/></>}
    <h3>Name: {encrypt[1].decrypt(cookie['name'])}</h3>
    <h3>UserName: {encrypt[1].decrypt(cookie['username'])}</h3>
    <h3>Authrization: {encrypt[1].decrypt(cookie['auth']).toUpperCase()}</h3>
    <Button onClick={(e)=>{handleEdit(e)}}>Edit</Button>
    <Button onClick={(e)=>{handlePassword(e)}}>Change Password</Button>
    </div>
    }
        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}

    </>
    );
}