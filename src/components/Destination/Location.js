import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios'
import {useCookies} from 'react-cookie'
import DialogBox from '../UI/DialogBox';
import encrypt from '../../encrypt'
import ShowMoreText from "react-show-more-text";
import LocationOnIcon from '@material-ui/icons//LocationOn';
import Visibility from "@material-ui/icons/Visibility";
import './location.css';

const reducer=(state,action)=>{
    switch(action.type){
      case "OPEN": return{open:action.value.open,open1:false,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN1": return{open:false,open1:true,open2:false,text:action.value.text,header:action.value.header}
      case "OPEN2": return{open:false,open1:false,open2:true,text:action.value.text,header:action.value.header}    
    }
}
export default function Loaction(props){
    const [numLines,setNumLines]=React.useState(0);
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [cookie] = useCookies();
      function handleClose(e){
        dispatch({type:"OPEN",value:{open:false,text:'',header:""}});
        props.deleteItem(props.info.id);
      }
    const deleteDestination = async(id)=>{
        
        if(window.confirm('Please Click OK to delete')){
             const token = cookie['token'];
            const deleteData = await axios.delete(`${process.env.REACT_APP_SERVER}/deleteData/${id}`,{
                headers: {
                    authorization: token
                }
            })
            if(deleteData.data.status){
                dispatch({type:"OPEN",value:{open:true,text:deleteData.data.message,header:"Data Deleted"}});
            }else{
                dispatch({type:"OPEN",value:{open:true,text:deleteData.data.message,header:"Not Able To Delete Data"}});
            }
        }     
    }
    React.useEffect(()=>{
        const winWidth = window.innerWidth;
        if(winWidth<'426'){
            setNumLines(4);
        }
        else if(winWidth>='426' && winWidth<='768'){
            setNumLines(4);
        } 
        
        else if(winWidth>'768'&& winWidth<='1024'){
            setNumLines(8);
        }
        else if(winWidth>'1024'){
            setNumLines(5);
        }
    },[])
     

    return(
        <>
        <div className="comp" >
        <div className="info">
                <div className="section">
                <img className="image" 
                        src={props.info.image} 
                        alt="img" 
                        />
                <div className="buttondiv">
                    <button  className="buttonStyle" onClick={(event)=>{props.handleImagesShow(event,props.info.id)}}><span>View Images</span> <Visibility fontSize='large'/></button>
                    <button className="buttonStyle" href={props.info.link}><span>Map Location</span><LocationOnIcon fontSize='large'/></button>                
                </div>
                {encrypt[1].decrypt(cookie['auth'])==='admin' && props.show &&
                            <div className="action">  
                                <button className="buttonStyle" onClick={()=>{window.location.replace('/myaccount/destinationdetails/editLocation/'+props.info.id)}}><EditIcon fontSize="large" style={{color:'black'}} /></button>
                                <button className="buttonStyle" onClick={()=>{deleteDestination(props.info.id)}}><DeleteIcon fontSize="large" /></button>
                            </div>
                }
                </div>
                <div className="details">
                    <div className="location">
                        <p className="place"> <b>Country:</b>{" "+props.info.location}</p>
                    </div>
                    <div className="placeName"><h3>{props.info.title}</h3></div>
                        <div className="date">
                            <p className='start'><b>StartDate:</b>{" "+props.info.startDate}</p>
                            <p className='end'><b>EndDate:</b>{" "+props.info.endDate}</p>
                        </div>
                        <div>
                        <ShowMoreText
                            lines={numLines}
                            style={{width:'100%'}}
                            more="Show more"
                            less="Show less"
                            className="content-css"
                            anchorClass="my-anchor-css-class"
                            width={window.innerWidth>'1024'?1000:550}
                            truncatedEndingComponent={"... "}
                        >
                            <p>{props.info.description}</p>
                        </ShowMoreText>
                        </div>
                    </div>
                    
                </div>
        </div>
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
    
    </>
    )
}