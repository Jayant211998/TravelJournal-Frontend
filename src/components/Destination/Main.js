import React from 'react';
import axios from 'axios';
import {useCookies} from 'react-cookie'
import Location from './Location';
import Images from '../UI/Images';
import DialogBox from '../UI/DialogBox';


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
    const [imageList,setImageList] = React.useState([]);
    const [text,setText] = React.useState('');
    const [header,setHeader] = React.useState("Invalid Input Given") 
    const [open,setOpen] = React.useState(false); 
    const [data,setData]=React.useState([]);
    const [images,setImages] = React.useState(false);
    const [cookie,setCookie] = useCookies();
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
                setOpen(true);
                setText(getAllData.data.message);
                setHeader("Unable To Get Your Destinations")
            }
        }
        getData();
    },[])
    function deleteItem(id){}
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
        {locationArr}
        </main>
        {images && <Images  imageList={imageList} handleImageHide={handleImageHide}/>}
        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}

        </>
    )
}