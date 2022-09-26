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
import './changedetails.css'
import './user.css'

const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    }
}
export default function ChangeDetails(){

         const imgStyle={height:"15rem",
                width:"15rem",
                borderRadius:"50%",
                margin:'0% 7.5%',
                border: '.1rem solid black' 
              }
        const inputStyle={
            width:'27rem',
            height: '4rem',
            fontSize: '1.5rem'
      }
      React.useLayoutEffect(()=>{
        const checkBackend=async()=>{
            const res = await axios.get(`${process.env.REACT_APP_SERVER}/check`);
            if(!res){
              throw new Error('There Is Some Server Issue. Please try After Some Time.');
            }
        }
        checkBackend()
        .then(()=>{
          if(cookie['token']){
            window.location.replace('/main');
          }
        })
        .catch((error)=>{
          dispatch({type:"OPEN",value:{open:true,text:error.message,header:"Server Issue"}});
        })
      },[])
        const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
        const imageRef = React.useRef(null);
        const [cookie,setCookie] = useCookies();
        const [image,setImage] = React.useState(cookie['image']);
        const [loading,setLoading] = React.useState(false);
        const [formData,setFormData] = React.useState({
        name:encrypt[1].decrypt(cookie['name']),
        image:cookie['image']
        });
        const handleBack=(e)=>{
            window.location.replace('/myaccount');
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
             window.location.replace('/myaccount')

        }
        const handleSubmit=async(event)=>{
        if(formData.name===""){
            dispatch({type:"OPEN",value:{open:true,text:'Please Enter Name.',header:"Invalid Input"}});
        }
        else{
            setLoading(true);
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
                dispatch({type:"OPEN",value:{open:true,text:updateUser.data.message,header:"Updated User Details Successfully."}});
                setCookie('name',encrypt[0].encrypt(formData.name));
                setCookie('image',imgUrl);
            }else{
                dispatch({type:"OPEN",value:{open:true,text:updateUser.data.message,header:"Unable to Update User Details."}});

            }
        }
        }

            const handleImg=(event)=>{
                imageRef.current.click();
            }
            const handleChangeImg = (e) =>{
                setImage((e.target.files[0]));
        }
        const changeDetailsForm = <div  className="content">
                                    <div className="user-details">
                                    {image && image!=="undefined"?<><img src={image===cookie['image']?(image):URL.createObjectURL(image)} onClick={(e)=>handleImg(e)} className="imgStyle"/></>:
                                    <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true" onClick={(e)=>handleImg(e)} style={imgStyle}/></>}
                                    <input type="file" ref={imageRef} style={{display:"none"}} onChange={(e)=>{handleChangeImg(e)}}/>
                                    <form  onSubmit={(e)=>{handleSubmit(e)}}>
                                    <TextField 
                                    autoFocus
                                    variant='outlined'
                                    margin="dense"
                                    id="name"
                                    InputProps={{ style: { fontSize: '1.5rem' } }}
                                    InputLabelProps={{ style: { fontSize: '1.5rem' } }}
                                    style={inputStyle}
                                    name="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={(event)=>{handleChange(event)}}
                                    /><br/>

                                    </form>
                                    <table className='table'>
                                        <tr className="rowstyle"><td className="tablestyle"><h4 >UserName:</h4></td> <td className="tablestyle"><h4>{encrypt[1].decrypt(cookie['username'])}</h4></td></tr>
                                        <tr className="rowstyle"><td className="tablestyle"><h4 >Authrization:</h4></td> <td className="tablestyle"><h4>{encrypt[1].decrypt(cookie['auth']).toUpperCase()}</h4></td></tr>
                                        </table>
                                        <button className="details-button" onClick={(e)=>{handleSubmit(e)}}>Submit</button>
                                        <br/>
                                        <button className="details-button" onClick={(e)=>{handleBack(e)}}>Back</button>
                                    </div>
                                    </div>
        return(
        <>
        {!loading &&<>{changeDetailsForm}
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
        </>}
        {loading && <Loading/>}

        </>
    );
}