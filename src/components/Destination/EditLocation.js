import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogBox from '../UI/DialogBox';
import { useCookies } from 'react-cookie';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import encrypt from '../../encrypt';
import Loading from '../UI/Loading';
import './changelocation.css';

const reducer=(state,action)=>{
  switch(action.type){
    case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
  }
}
export default function EditLocation(props){
  React.useLayoutEffect(()=>{
    const checkBackend=async()=>{
        const res = await axios.get(`${process.env.REACT_APP_SERVER}/check`);
        if(!res){
          throw new Error('There Is Some Server Issue. Please try After Some Time.');
        }
    }
    checkBackend()
    .then(()=>{
      if(encrypt[1].decrypt(cookie['auth'])==="user"){
        dispatch({type:"OPEN2",value:{text:'You Are Not Autherizesd For This Page',header:'Unautherized User'}})
    }
    })
    .catch((error)=>{
      dispatch({type:"OPEN",value:{open:true,text:error.message,header:"Server Issue"}});
    })
  },[])
  const [cookie] = useCookies(); 
  const images = React.useRef();
  const profile = React.useRef();
  const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
  const [loading,setLoading] = React.useState(false);
  const [image,setImage] = React.useState(null);
  const [imageList,setImageList] = React.useState([]);

  const imagesSelected = imageList.map(img => {
    return <>{img.name+" , "}</>
  })
  const profileImg = <>{image?image.name:""}</>


  const handleFileChange = (event) =>{ 
    event.preventDefault();
    setImageList(prev =>[...prev,...event.target.files]);
  }
  const handleImageChange = (event) =>{
      event.preventDefault();
      setImage(event.target.files[0]);
  }
  function handleClose(e){
    dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
  }
  function handleClose1(e){
    window.location.replace('/myaccount/destinationdetails');
  }
  
  function handleClose2(e){
    window.location.replace('/');
  }
   const id=(window.location.pathname.split('/').pop());

    React.useEffect(()=>{
        
        const getData=async()=>{
            const token = cookie['token'];
            const getDestination = await axios.get(`${process.env.REACT_APP_SERVER}/getDataById/${id}`,{
              headers: {
                    Authorization: token
                }
              })
            if(getDestination.data.status && getDestination.data.data)
                setFormData({...getDestination.data.data[0]})
            else if(getDestination.data.status){
                    window.location.replace('/errorpage');
                } 
            else{
              dispatch({type:"OPEN",value:{open:true,text:getDestination.data.message,header:"Unable To Edit Destinations"}});
            }
      }
      getData();
    },[])

    const [formData,setFormData] = React.useState({
      title:"",
      location:"",
      description:"",
      startDate:"",
      endDate:"",
      link:"",
      image:"",
      imageList: []
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
    else {
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
      // listOfImages.unshift(imgUrl);
      const token = cookie['token'];
      const  data ={...formData, 
        link:"http://maps.google.com/?q="+formData.title}
      const upadateData =  await axios.post(`${process.env.REACT_APP_SERVER}/upadateData/${id}`,{
        headers: {
              Authorization: token
          },
          data
        })
        setLoading(false);
      if(upadateData.data.status){
        dispatch({type:"OPEN1",value:{text:upadateData.data.message,header:"Data Updated"}});
      }else{
        dispatch({type:"OPEN1",value:{text:upadateData.data.message,header:"Unable to Update Data"}});
      }
    }
   }
   const editLocation = <div className="edit-block">
   <h1 className="edit-heading" >Edit Destination</h1>

   <form className="edit-form" onSubmit={(e)=>{handleSubmit(e)}}>
      <div className='edit-input'>  
      <TextField
           autoFocus
           variant='outlined'
           margin="dense"
           id="title"
           name="title"
           label="Destination Name"
           value={formData.title}
           onChange={(event)=>{handleChange(event)}}
           style={{width: '100%'}}
           InputProps={{ style: { fontSize: '1.5rem' } }}
        InputLabelProps={{ style: { fontSize: '1.5rem' } }}
        
           multiline
         /></div><br/>
        <div className='edit-input'>
           <TextField
           autoFocus
           variant='outlined'
           margin="dense"
           id="location"
           name="location"
           label="City, Country"
           value={formData.location}
           onChange={(event)=>{handleChange(event)}}
           InputProps={{ style: { fontSize: '1.5rem' } }}
        InputLabelProps={{ style: { fontSize: '1.5rem' } }}
        
           style={{width: '100%'}}
           multiline
         /></div><br/>
         <div className='edit-input'><TextField
           autoFocus
           variant='outlined'
           margin="dense"
           id="description"
           name="description"
           label="Description"
           value={formData.description}
           InputProps={{ style: { fontSize: '1.5rem' } }}
        InputLabelProps={{ style: { fontSize: '1.5rem' } }}
        
           onChange={(event)=>{handleChange(event)}}
           style={{width: '100%'}}
           multiline
         /></div><br/>
         <div className='edit-date'>
         <div className='start-date'>
          <TextField
           autoFocus
           type='date'
           variant='outlined'
           margin="dense"
           id="startDate"
           name="startDate"
           label="Start Date"
           value={formData.startDate}
           onChange={(event)=>{handleChange(event)}}
           InputProps={{ style: { fontSize: '1.5rem' } }}
          InputLabelProps={{ style: { fontSize: '1.5rem' },shrink:true }}
        
           style={{width: '100%'}}
         /></div><div className='end-date'>
         <TextField
           autoFocus
           style={{width: '100%'}}
           type='date'
           variant='outlined'
           margin="dense"
           id="endDate"
           name="endDate"
           label="End Date"
           value={formData.endDate}
           InputProps={{ style: { fontSize: '1.5rem' } }}
           InputLabelProps={{ style: { fontSize: '1.5rem' },shrink:true }}
           onChange={(event)=>{handleChange(event)}}
         /></div></div><br/>
           <br/>
           <div className='selected-img'>
          <Button style={{width:'100%',fontSize:'1.4rem',color:'white'}} onClick={(e)=>{profile.current.click()}}>Profile Image</Button>
        </div>
        <input type="file" ref={profile} style={{display:'none'}} onChange={(e)=>handleImageChange(e)} />
        <div className="img-list">
         {profileImg}
         </div>
        <br/><br/>
        <div className='selected-img'>
          <Button style={{width:'100%',fontSize:'1.4rem',color:'white'}} onClick={(e)=>{images.current.click()}}>Select Images</Button>
        </div> 
        <input type="file" multiple ref={images} style={{display:'none'}} onChange={(e)=>handleFileChange(e)} />
         <div className="img-list">
         {imagesSelected}
         </div>
         <br/><br/>
           <div className="submit-button">
            <Button 
           style={{width:'100%',fontSize:'1.5rem',color:'white'}}   
           onClick={(e)=>{handleSubmit(e)}}
           >Submit
           </Button>
           </div>
   </form>
   {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
   {state.open1 && <DialogBox text={state.text} handleClose={handleClose1} header={state.header}/>}
   {state.open2 && <DialogBox text={state.text} handleClose={handleClose2} header={state.header}/>}
   </div>
    return(
    <>
    {!loading && editLocation}
    {loading && <Loading/>}
    </>
    )
}