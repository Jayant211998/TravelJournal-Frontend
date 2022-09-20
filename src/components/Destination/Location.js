import React from 'react'
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios'
import {useCookies} from 'react-cookie'
import DialogBox from '../UI/DialogBox';
import { getStorage, ref } from "firebase/storage";
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
    const buttonStyle={
        width:'100%',
        backgroundColor:'#ffbb00',
        marginTop:'2%',
        paddingLeft:'30%',
        borderRadius: '0.5rem',
        boxShadow: '2px 2px 3px 2px grey',
    }
    const iconstyle = {
        marginLeft:'auto',
        marginRight:'0',
    }
    const storage = getStorage();
    const [state,dispatch]=React.useReducer(reducer,{open:false,open1:false,open2:false,text:"",header:""});
    const [cookie,setCookie] = useCookies();
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
    return(
        <>
        <div className="comp" >
        <div className="info">
                <div className="section">
                <img className="image" 
                        src={props.info.image} 
                        alt="img" 
                        height="200px" 
                        width="5px" 
                        />
                <button  style={buttonStyle} onClick={(event)=>{props.handleImagesShow(event,props.info.id)}}>View Images <Visibility style={iconstyle}/></button>
                <button style={buttonStyle} href={props.info.link}>Map Location<LocationOnIcon style={iconstyle}/></button>                
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
                    <ShowMoreText
                        lines={4}
                        more="Show more"
                        less="Show less"
                        className="content-css"
                        anchorClass="my-anchor-css-class"
                        width={750}
                        truncatedEndingComponent={"... "}
                    >
                        <p>{props.info.description}</p>
                    </ShowMoreText>
                    
                </div>
                {encrypt[1].decrypt(cookie['auth'])==='admin' && props.show &&
                <div className="action">  
                    {<Link to={'editLocation/'+props.info.id}><EditIcon style={{color:'black'}} /></Link>}
                          <DeleteIcon onClick={()=>{deleteDestination(props.info.id)}}/>
                </div>
                }
        </div>
        </div>
        {state.open && <DialogBox text={state.text} handleClose={handleClose} header={state.header}/>}
    
    </>
    )
}