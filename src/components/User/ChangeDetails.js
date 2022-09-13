import React from 'react';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import {useCookies} from 'react-cookie'
import DialogBox from '../UI/DialogBox';
import { storage } from '../../firebase';
import encrypt from '../../encrypt';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import axios from 'axios';
import Loading from '../UI/Loading';
import './user.css';


export default function ChangeDetails(){
        const imgStyle={height:"150px",
                    width:"150px",
                    borderRadius:"50%",
                    margin:'0% 7.5%',
                    border: '1px solid black' 
                }
                const tablestyle={
                    textAlign:'left',
                    marginLeft:'10px'
    
        }
        const rowstyle={
            padding:'0',
            lineHeight: '0px',
        }
        const imageRef = React.useRef(null);
        const [cookie,setCookie] = useCookies();
        const [text,setText] = React.useState('')
        const [header,setHeader] = React.useState("Invalid Input Given")
        const [open,setOpen] = React.useState(false);   
        const [image,setImage] = React.useState(cookie['image']);
        const [loading,setLoading] = React.useState(false);
        const [formData,setFormData] = React.useState({
        name:encrypt[1].decrypt(cookie['name']),
        image:cookie['image']
        });

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
        window.location.replace('/myaccount')

        }
        const handleSubmit=async(event)=>{
        setLoading(true);
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
            setLoading(false);
            if(updateUser.data.status){
                setOpen(true);
                setText(updateUser.data.message);
                setHeader("Updated User Details Successfully.");
                setCookie('name',encrypt[0].encrypt(formData.name));
                setCookie('image',imgUrl);
            }else{
                setOpen(true);
                setText(updateUser.data.message);
                setHeader("Unable to Update User Details.");   
            }
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
        {!loading &&<>
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
        <table style={{marginLeft:'auto',marginRight:'auto'}}>
            <tr style={rowstyle}><td style={tablestyle}><h4 >UserName:</h4></td> <td style={tablestyle}><h4>{encrypt[1].decrypt(cookie['username'])}</h4></td></tr>
            <tr style={rowstyle}><td style={tablestyle}><h4 >Authrization:</h4></td> <td style={tablestyle}><h4>{encrypt[1].decrypt(cookie['auth']).toUpperCase()}</h4></td></tr>
            </table><Button style={{minHeight:'20px',minWidth:'150px'}} color="primary" variant="contained" onClick={(e)=>{handleSubmit(e)}}>Submit</Button>
        </div>

        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
        </>}
        {loading && <Loading/>}

        </>
    );
}