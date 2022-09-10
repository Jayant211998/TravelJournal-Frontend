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


export default function AddLocation(props){
    const [cookie,setCookie] = useCookies();
    const unique_id = uuid();
    const [text,setText] = React.useState('');
    const [open,setOpen] = React.useState(false); 
    const [open1,setOpen1] = React.useState(false); 
    const [header,setHeader] = React.useState("Invalid Input Given") 
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
      setOpen(false);
      setText('')
      setHeader('Invalid Input Given')
    }
    function handleClose1(e){
      setOpen1(false);
      setText('')
      setHeader('Invalid Input Given')
      window.location.replace('/myaccount');
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
      setOpen(true)
      setText("Please Enter Location Name")
    }
    else  if(formData.location===""){
      setOpen(true)
      setText("Please Enter City and Country Name")
    }
    else  if(formData.description===""){
      setOpen(true)
      setText("Please Enter Description")
    }
    else  if(formData.startDate===""){
      setOpen(true)
      setText("Please Enter Strating Date of Travel")
    }
    else  if(formData.endDate===""){
      setOpen(true)
      setText("Please Enter Last date of travel")
    }
    else  if(image===null){
      setOpen(true)
      setText("Please upload Profile Image For Destination.")
    }
    else  if(formData.imageList===[]){
      setOpen(true)
      setText("Please upload Atleast One Image.")
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
        setOpen1(true);
        setText(addData.data.message);
        setHeader("Data Added");
      }
      else{
        setOpen1(true);
        setText(addData.data.message);
        setHeader("Unable to Add Data");
      }
   }
  }
    return(
    <>
    {!loading && <>
    <h1 style={{textAlign:'left',marginLeft:'10%'}}>Add New Destination</h1>
    <form style={{textAlign:'left',marginLeft:'10%',marginTop:'2%'}} onSubmit={(e)=>{handleSubmit(e)}}>
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
            style={{width:'50%'}}
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
            style={{width:'50%'}}
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
            style={{width:'50%'}}
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
            style={{width:'24%'}}
            
          />
          <TextField
            autoFocus
            style={{marginLeft:'2%',width:'24%'}}
            type='date'
            variant='outlined'
            margin="dense"
            id="endDate"
            name="endDate"
            label="End Date"
            value={formData.endDate}
            InputLabelProps={{shrink:true}}
            onChange={(event)=>{handleChange(event)}}

          /><br/><br/>
          <InputLabel> Profile Image : </InputLabel>
          <input type="file" onChange={(e)=>handleImageChange(e)} />
           <br></br>
           <br></br>
           
           <InputLabel > Images </InputLabel>
           <input type="file" multiple onChange={(e)=>handleFileChange(e)} />
           {imagesSelected}
            <br></br>
            <Button 
            style={{marginTop:'10px',marginRight:'10px',marginBottom:'10px'}}
            variant="contained"
            color="primary"
            onClick={(e)=>{handleSubmit(e)}}
            >Submit
            </Button>
    </form>
    {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
    {open1 && <DialogBox text={text} handleClose={handleClose1} header={header}/>}
    </> }      
    {loading && <Loading/>}
    </>
    );
}