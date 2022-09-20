import React from 'react'
import axios from 'axios'
import { v4 as uuid } from 'uuid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useCookies } from 'react-cookie';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import DialogBox from '../UI/DialogBox';
import Loading from '../UI/Loading';
import encrypt from '../../encrypt'
import './changelocation.css'

const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    }
}

export default function AddLocation(props){
  React.useLayoutEffect(()=>{
    if(encrypt[1].decrypt(cookie['auth'])==="user"){
        dispatch({type:"OPEN2",value:{text:'You Are Not Autherizesd For This Page',header:'Unautherized User'}})
    }
  },[]);
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [cookie] = useCookies();
    const unique_id = uuid();
    const [disable,setDisable] = React.useState(true);  
    const [image,setImage] = React.useState(null);
    const [imageList,setImageList] = React.useState([]);
    const [loading,setLoading] = React.useState(false);

    const [formData,setFormData] = React.useState({
      id:unique_id.slice(0,8),
      userid:encrypt[1].decrypt(cookie['id']),
      title:"",
      location:"",
      description:"",
      startDate:"",
      endDate:"",
      link:"",
      image:"",
      imageList: []
    });

    const imagesSelected = imageList.map(img => {
      return <p>{img.name}</p>
    })

  
    function handleClose(e){
      dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
    }
    function handleClose1(e){
      window.location.replace('/myaccount/destinationdetails');
    }

    function handleClose2(e){
      window.location.replace('/');
    }

    const handleChange=(event)=>{     
      if(formData.title!=="")
             setDisable(false);
      else
            setDisable(true); 
        setFormData(prevFormData => {
          const e=event.target;
            return {
                ...prevFormData,
                [e.name]: e.value
            }
        })       
    }
    const handleFileChange = (event) =>{ 
        event.preventDefault();
        setImageList(prev =>[...prev,...event.target.files]);
    }
    const handleImageChange = (event) =>{
        event.preventDefault();
        setImage(event.target.files[0]);
    }
    

   const handleSubmit = async(event) =>{
    if(formData.title===""){
      dispatch({type:"OPEN",value:{open:true,text:'Please Enter Location Name',header:"Invalid Input"}});
    }
    else  if(formData.location===""){
      dispatch({type:"OPEN",value:{open:true,text:'Please Enter City and Country Name',header:"Invalid Input"}});
    }
    else  if(formData.description===""){
      dispatch({type:"OPEN",value:{open:true,text:'Please Enter Description',header:"Invalid Input"}});
    }
    else  if(formData.startDate===""){
      dispatch({type:"OPEN",value:{open:true,text:'Please Enter Strating Date of Travel',header:"Invalid Input"}});
    }
    else  if(formData.endDate===""){
      dispatch({type:"OPEN",value:{open:true,text:'Please Enter Last date of travel',header:"Invalid Input"}});
     }
    else  if(image===null){
      dispatch({type:"OPEN",value:{open:true,text:'Please upload Profile Image For Destination.',header:"Invalid Input"}});
    }
    else  if(formData.imageList===[]){
      dispatch({type:"OPEN",value:{open:true,text:'Please upload Atleast One Image.',header:"Invalid Input"}});
    }
    else 
    { 
      setLoading(true);
      const imgRef =  ref(storage , `travelJournal/destination/profile/${formData.id}`);
      const imgUpload = await uploadBytes(imgRef, image);
      const imgUrl = await getDownloadURL(imgRef);
      let listOfImages = [];
      for(let i=0;i<imageList.length;i++){
          const imageRef =  ref(storage , `travelJournal/destination/${encrypt[1].decrypt(cookie['id'])}/${formData.id}/img${i+1}`);
          const imageUpload = await uploadBytes(imageRef, imageList[i]);
          const url = await getDownloadURL(imageRef);
          listOfImages.push(url);
      }
      listOfImages.unshift(imgUrl);
      const token = cookie['token'];
      const  data ={...formData, 
      link:"http://maps.google.com/?q="+formData.title,
      image:imgUrl,
      imageList: listOfImages
      }
      const addData =  await axios.post(`${process.env.REACT_APP_SERVER}/addData`,{
        headers: {
              Authorization: token
          },
          data
        })
      setLoading(false);
      if(addData.data.status){
        dispatch({type:"OPEN1",value:{text:addData.data.message,header:"Data Added"}})
      }
      else{
        dispatch({type:"OPEN1",value:{text:addData.data.message,header:"Unable to Add Data"}})
      }
   }
  }
    return(
    <>
    {!loading && <>
    <h1 className="edit-heading" >Add New Destination</h1>
    <form className="edit-form" onSubmit={(e)=>{handleSubmit(e)}}>
    <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            id="title"
            name="title"
            label="Destination Name"
            value={formData.title}
            onChange={(event)=>{
              handleChange(event);
              
          }}
            className="edit-input"
            multiline
          /><br/>
          <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            id="location"
            name="location"
            label="Country"
            value={formData.location}
            onChange={(event)=>{handleChange(event);}}
            className="edit-input"
            multiline
          /><br/>
          <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            id="description"
            name="description"
            label="Description"
            value={formData.description}
            onChange={(event)=>{handleChange(event)}}
            className="edit-input"
            multiline
          /><br/>
          <TextField
            autoFocus
            type='date'
            variant='outlined'
            margin="dense"
            id="startDate"
            name="startDate"
            label="Start Date"
            value={formData.startDate}
            InputLabelProps={{shrink:true}}
            onChange={(event)=>{handleChange(event)}}
            className="start-date"
            
          />
          <TextField
            autoFocus
            className="end-date"
            type='date'
            variant='outlined'
            margin="dense"
            id="endDate"
            name="endDate"
            label="End Date"
            value={formData.endDate}
            InputLabelProps={{shrink:true}}
            onChange={(event)=>{handleChange(event)}}
            style={{marginLeft:'2%'}}
          /><br/><br/>
          <InputLabel> Profile Image : </InputLabel>
          <input type="file" onChange={(e)=>handleImageChange(e)} />
           <br></br>
           <br></br>
           
           <InputLabel > Images </InputLabel>
           <input type="file" multiple onChange={(e)=>handleFileChange(e)} />
           {imagesSelected}
            <br/><br/>
            <Button 
            className="submit-button"
            variant="contained"
            color="primary"
            onClick={(e)=>{handleSubmit(e)}}
            >Submit
            </Button>
    </form>
    {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
    {state.open1 && <DialogBox text={state.text} handleClose={handleClose1} header={state.header}/>}
    {state.open2 && <DialogBox text={state.text} handleClose={handleClose2} header={state.header}/>}
    </> }      
    {loading && <Loading/>}
    </>
    );
}