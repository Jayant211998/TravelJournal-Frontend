import React from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogBox from '../UI/DialogBox';
import { useCookies } from 'react-cookie';
import encrypt from '../../encrypt';
import Loading from '../UI/Loading';
import './changelocation.css'

const reducer=(state,action)=>{
  switch(action.type){
    case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
    case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
  }
}
export default function EditLocation(props){
  React.useLayoutEffect(()=>{
    if(encrypt[1].decrypt(cookie['auth'])==="user"){
      dispatch({type:"OPEN2",value:{text:'You Are Not Autherizesd For This Page',header:'Unautherized User'}})
    }
  },[]);
  const [cookie] = useCookies(); 
  const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
  const [loading,setLoading] = React.useState(false);

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
    return(<>
    {!loading && <>
    <h1 className="edit-heading" >Edit Destination</h1>

    <form className="edit-form" onSubmit={(e)=>{handleSubmit(e)}}>
    <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            id="title"
            name="title"
            label="Destination Name"
            value={formData.title}
            onChange={(event)=>{handleChange(event)}}
            className="edit-input"
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
          /><br></br>
          
            <br></br>
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
    </>}
    {loading && <Loading/>}
    </>)
}