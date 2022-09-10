import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios'; 
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import DialogBox from '../UI/DialogBox';
import Input from "@material-ui/core/Input";
import { v4 as uuid } from 'uuid';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';


export default function Register(){
const imgStyle={height:"100px",
                width:"100px",
                borderRadius:"50%",
                margin:'0% 7.5%',
                border: '1px solid black' 
              }


const unique_id = uuid();
const profileImg = React.useRef(null);
const [profilePic,setProfilePic] = React.useState(null);
const [text,setText] = React.useState('')
const [open,setOpen] = React.useState(false);
const [open1,setOpen1] = React.useState(false);
const [header,setHeader] = React.useState("Invalid Input Given")
const [userList, setUserList] = React.useState([]);
const [adminList, setAdminList] = React.useState([]);
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
          setOpen(true);
          setText(UserList.data.message);
          setHeader('Unable To Do Email Validation.')
        }

        if(AdminList.data.status && AdminList.data.data){
          setAdminList(AdminList.data.data);
        }
        else if(AdminList.data.status){
          window.location.replace('/errorpage');  
        }
        else{
          setOpen(true);
          setText(AdminList.data.message);
          setHeader('Unable To Do Email Validation.')
        }
        
      }
      getAllUser();
    },[]);

    function handleImg(event){
        profileImg.current.click();
    }
    function handleChangeImg(e){
      setProfilePic(e.target.files[0]);
    }

    function handleClose(e){
      e.preventDefault();
      setOpen(false);
      setText('')
      setHeader('Invalid Input Given')
    }
    function handleClose1(e){
      e.preventDefault();
      setOpen1(false);
      setText('')
      setHeader('Invalid Input Given')
      window.location.replace('/');

    }

    const handleChange=(event)=>{
        setFormData(prev=>{
           return { ...prev,
            [event.target.name]:event.target.value}
        });
    }
    const handleRegister=async(e)=>{
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      if(formData.auth===""){
        setOpen(true);
        setText("Please Select Authrization")
      }
      else  if(formData.username===""){
        setOpen(true);
        setText("Please Enter Your Email ")
      }else if(!formData.username.match(validRegex)){
        setOpen(true);
        setText("Please Enter a Valid Email ")
      }
      else  if(formData.password===""){
        setOpen(true);
        setText("Please Enter A Password")
      }
      else if(!formData.password.match(passw)){
        setOpen(true);
        setText("Password should contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
      }
      else  if(formData.cmf_password===""){
        setOpen(true);
        setText("Please Confirm Your Password")
      }
      else  if(formData.auth==="admin" && formData.key===""){
        setOpen(true);
        setText("If You want to Register as Admin then You Need to provide Key")
      }
      else  if(formData.cmf_password!==formData.password){
        setOpen(true);
        setText("Password and Confirm Password Do Not match")
      }    
      else if(formData.auth==="admin" && adminList.find(ad =>ad.username===formData.username)){
        setOpen(true);
        setText("This Username Already Exist As Admin");
      }
      else if(formData.auth==="user" && userList.find(ad =>ad.username===formData.username)){
        setOpen(true);
        setText("This Username Already Exist As User");
      }
      else{
        let imgUrl = "";
        if(profilePic!==null){
          const imgRef =  ref(storage , `travelJournal/user/${formData.id}`);
          const imgUpload = await uploadBytes(imgRef, profilePic);
          imgUrl = await getDownloadURL(imgRef);
        }
        const data={ 
          id:unique_id.slice(0,8),
          auth:formData.auth,
          username:formData.username,
          name:formData.name,
          password:formData.password,
          key:formData.key,
          image:imgUrl
        }
          const register = await axios.post(`${process.env.REACT_APP_SERVER}/register`,{data});
          if(register.data.status){
              setOpen1(true);
              setText(register.data.message)
              setHeader("Registration Successfully")
          }else{
              setOpen(true);
              setText(register.data.message)
              setHeader("Registration Failed")

          }
    }
    }
    return(<>
        <div style={{margin:'2% auto',width:'60%'}}>
        <h1>Register</h1><br/>
        
        {profilePic?<><img src={URL.createObjectURL(profilePic)} onClick={(e)=>handleImg(e)} style={imgStyle}/></>:
        <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true" onClick={(e)=>handleImg(e)} style={imgStyle}/></>}
        <br></br>
        <input type="file" ref={profileImg} onChange={(e)=>{handleChangeImg(e)}} style={{display:'none'}} />
              
        <form style={{textAlign:'left',marginLeft:'35%'}}>
        <input type="radio" id="admin" name="auth" value='admin' onChange={(e)=>{handleChange(e)}}/>
        <label htmlFor="admin">Admin</label>
        <input type="radio" id="user" name="auth" value='user' onChange={(e)=>{handleChange(e)}}/>
        <label htmlFor="user">User</label><br/><br/>

        <label htmlFor="username">Email Id</label><br/>
        <Input
            autoFocus
            variant='outlined'
            margin="dense"
            id="username"
            name="username"
            value={formData.username}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
          /><br/>
          
           <label htmlFor="name">Name</label><br/>
          <Input
            autoFocus
            variant='outlined'
            margin="dense"
            id="name"
            name="name"
            value={formData.name}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
          /><br/>

          <label htmlFor="password">Password</label><br/>
          <Input
            autoFocus
            variant='outlined'
            margin="dense"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
          /><br/>
          <label htmlFor="cmf_password">Confirm Password</label><br/>
          <Input
            autoFocus
            variant='outlined'
            margin="dense"
            id="cmf_password"
            name="cmf_password"
            type="password"
            value={formData.cmf_password}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
          /><br/>
          {formData.auth==='admin' && <><label htmlFor="key">Key</label><br/>
          <Input
            autoFocus
            variant='outlined'
            margin="dense"
            id="key"
            name="key"
            type="password"
            value={formData.key}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
          /><br/></>}
          <br/>
           
     <Button onClick={(e)=>{handleRegister(e);}}>Register</Button>
     </form>
     </div>
     {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
     {open1 && <DialogBox text={text} handleClose={handleClose1} header={header}/>}

    </>);
}