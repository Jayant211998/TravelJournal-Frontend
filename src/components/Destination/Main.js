import React from 'react';
import axios from 'axios';
import {useCookies} from 'react-cookie'
import Location from './Location';
import Images from '../UI/Images';
import DialogBox from '../UI/DialogBox';
import './destination.css'
import './main.css'

const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    }
}

export default function Main(){ 
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
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [imageList,setImageList] = React.useState([]);
    const [data,setData]=React.useState([]);
    const [images,setImages] = React.useState(false);
    const [cookie,setCookie] = useCookies();
    React.useLayoutEffect(()=>{
        const checkBackend=async()=>{
            const res = await axios.get(`${process.env.REACT_APP_SERVER}/check`);
            if(!res){
              throw new Error('There Is Some Server Issue. Please try After Some Time.');
            }
        }
        checkBackend()
        .catch((error)=>{
          dispatch({type:"OPEN",value:{open:true,text:error.message,header:"Server Issue"}});
        })
      },[])
    React.useEffect(()=>{
        const getData = async()=>{
            const token = cookie['token'];
            const getAllData = await axios.get(`${process.env.REACT_APP_SERVER}/getAllData`,{
                headers: {
                      Authorization: token
                  }
                });
            if(getAllData.data.status && getAllData.data.data){
                setData(getAllData.data.data)
            }
            else if(getAllData.data.status){
                window.location.replace('/errorpage');
            } 
            else{
                dispatch({type:"OPEN",value:{open:true,text:getAllData.data.message,header:"Unable To Get Your Destinations"}});
            }
        }
        getData();
    },[])
    function deleteItem(id){}
    function handleClose(e){
        dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
      }
    const handleImageHide = (event) =>{
        setImages(false);
        // window.location.replace('/main');
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
    }
    let i = 0;
    const locationArr = data.map(loc => {
        i+=1;
        return(
            <Location key={i} info={loc} id={i} show={false} deleteItem={deleteItem} handleImagesShow={handleImagesShow}/>
        );
    }) 
    return(
        <>
        <main className='main'>
        {!images && locationArr}
        {images && <Images  imageList={imageList} handleImageHide={handleImageHide}/>}
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
        </main>

        </>
    )
}