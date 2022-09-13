import React from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogBox from '../UI/DialogBox';
import { useCookies } from 'react-cookie';
import encrypt from '../../encrypt';
import Loading from '../UI/Loading';


export default function EditLocation(props){
  const [cookie,setCookie] = useCookies(); 

  const [open1,setOpen1] = React.useState(false)
  const [text,setText] = React.useState('')
  const [open,setOpen] = React.useState(false)
  const [header,setHeader] = React.useState("Invalid Input Given");
  const [loading,setLoading] = React.useState(false);


  function handleClose(e){
    setOpen(false);
    setText('')
    setHeader('Invalid Input Given')
  }

  function handleClose1(e){
    setOpen1(false);
    setText('')
    setHeader('Invalid Input Given');
    window.location.replace('/myaccount/destinationdetails');
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
                setOpen(true);
                setText(getDestination.data.message);
                setHeader("Unable To Edit Destinations")
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
      image:""
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
    else {
      setLoading(true);
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
        setOpen1(true);
        setText(upadateData.data.message)
        setHeader("Data Updated")
      }else{
        setOpen1(true);
        setText(upadateData.data.message)
        setHeader("Unable to Update Data")
      }
    }
   }
    return(<>
    {!loading && <>
    <h1 style={{textAlign:'left',marginLeft:'10%'}}>Edit Destination</h1>

    <form style={{textAlign:'left',marginLeft:'10%',marginTop:'2%'}} onSubmit={(e)=>{handleSubmit(e)}}>
    <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            id="title"
            name="title"
            label="Destination Name"
            value={formData.title}
            onChange={(event)=>{handleChange(event)}}
            style={{width:'50%'}}
            multiline
          /><br/>
          <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            id="location"
            name="location"
            label="City, Country"
            value={formData.location}
            onChange={(event)=>{handleChange(event)}}
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

          /><br></br>
          
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
    </>}
    {loading && <Loading/>}
    </>)
}