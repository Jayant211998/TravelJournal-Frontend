import React from 'react';
import {useCookies} from 'react-cookie'
import Location from '../Destination/Location';
import Images from '../UI/Images';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import axios from 'axios';
import DialogBox from '../UI/DialogBox';
import encrypt from '../../encrypt'


export default function DestinationDetails(){
    const [cookie,setCookie] = useCookies();
    const buttonStyle={
        borderRadius:'100%',
        backgroundColor:'#F55A5A', 
        height:'60px', 
        color:'white', 
        fontSize:'40px', 
        position:'fixed',
        left:'92%',
        top:'85%'
    }   
    const [imageList,setImageList] = React.useState([]);
    const [text,setText] = React.useState('');
    const [header,setHeader] = React.useState("Invalid Input Given") 
    const [open,setOpen] = React.useState(false); 
    const [data,setData]=React.useState([]);
    const [images,setImages] = React.useState(false);
    const [ID,setId] = React.useState('');
    React.useState(async()=>{
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
            setOpen(true);
            setText(getData.data.message);
            setHeader("Unable To Get Your Destinations")
        }
        
    },[])
    function handleClose(e){
        setOpen(false);
        setText('')
        setHeader('Invalid Input Given')
      }
    const handleImageHide = (event) =>{
        window.location.replace('/main');
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
    let i = 0;
    const locationArr = data.map(loc => {
        i+=1;
        return(
            <Location info={loc} key={i} id={i} show={true} handleImagesShow={handleImagesShow}/>
        );
    }) 
    return(
        <>
        <main className='main'>
        {locationArr}
        </main>
        {encrypt[1].decrypt(cookie['auth'])==='admin' &&<Link to='/addLocation'><Button style={buttonStyle}>+</Button></Link>}
        {images && <Images imageList={imageList} handleImageHide={handleImageHide}/>}
        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
        </>);
}