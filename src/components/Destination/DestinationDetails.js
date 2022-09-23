import React from 'react';
import {useCookies} from 'react-cookie'
import Location from './Location';
import Images from '../UI/Images';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import axios from 'axios';
import DialogBox from '../UI/DialogBox';
import encrypt from '../../encrypt'
import './destination.css'

const buttonStyle={
    borderRadius:'100%',
    backgroundColor:'#F55A5A', 
    height:'6rem',
    color:'white', 
    fontSize:'4rem', 
    position:'fixed',
    right:'3%',
    bottom:'3%',
    border:'none',

}
const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    }
}

export default function DestinationDetails(){
    React.useLayoutEffect(()=>{
        if(encrypt[1].decrypt(cookie['auth'])==="user"){
            dispatch({type:"OPEN1",value:{text:"You Are Not Autherizesd For This Page",header:"Unautherized User"}});

        }
      },[])
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [cookie] = useCookies();
     
     
    const [imageList,setImageList] = React.useState([]);
    const [data,setData]=React.useState([]);
    const [images,setImages] = React.useState(false);
    const [ID,setId] = React.useState('');
    
    React.useState(()=>{
        const getData = async()=>{
            const token = cookie['token'];
            const getData = await axios.get(`${process.env.REACT_APP_SERVER}/getDataByUserId/${encrypt[1].decrypt(cookie['id'])}`,{
            headers: {
                Authorization: token
            }
            });
            if(getData.data.status){
                setData(getData.data.data)
            } 
            else{
                dispatch({type:"OPEN",value:{open:true,text:getData.data.message,header:"Unable To Get Your Destinations"}});
            } 
        }
        getData();
    },[])
    function handleClose(e){
        dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
      }
    const handleImageHide = (event) =>{
        window.location.replace('/myaccount/destinationdetails');
    }
    function deleteItem(id){
        setData((prev)=>{
            return prev.filter(data=>data.id!==id)
        })
    }
    const handleImagesShow=async(event,id)=>{
        const token = cookie['token'];
        const imgList = await axios.get(`${process.env.REACT_APP_SERVER}/getImages/${id}`,{
        headers: {
              Authorization: token
          },
        });
        setImageList(imgList.data.data);
        setImages(true);
        setId(id);
    }
    const handleClose1=()=>{
        window.location.replace('/');
    }
    let i = 0;
    const locationArr = data.map(loc => {
        i+=1;
        return(
            <Location info={loc} key={i} id={i} show={true} deleteItem={deleteItem} handleImagesShow={handleImagesShow}/>
        );
    }) 
    return( 
        <div >
        <div className='tab-button'>
            <button className="tab-disable" onClick={(event)=>{window.location.replace('/myaccount/destinationdetails')}}>Destinations</button>
            <button  className="tab-active" onClick={(event)=>{window.location.replace('/myaccount')}}>Profile</button>
        </div>
        <div className='dest-page'>
        {locationArr}
        {encrypt[1].decrypt(cookie['auth'])==='admin' &&
            <Button style={buttonStyle} 
            onClick={()=>{window.location.replace('/myaccount/destinationdetails/addLocation')}}>
                +
            </Button>
        }
        {images && <Images imageList={imageList} handleImageHide={handleImageHide}/>}
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
        {state.open1 && <DialogBox text={state.text} handleClose={handleClose1} header={state.header}/>}
        </div>
        
        </div>);
}