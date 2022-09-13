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
import { Button } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons//LocationOn';
import Visibility from "@material-ui/icons/Visibility";


export default function Loaction(props){
    const buttonStyle={
        width:'100%',
        backgroundColor:'#ffbb00',
        marginTop:'2%',
        paddingLeft:'30%',
        borderRadius: '0.5rem',
        boxShadow: '2px 2px 3px 2px grey'

    }
    const iconstyle = {
        marginLeft:'auto',
        marginRight:'0',
    }
    const storage = getStorage();
    const [cookie,setCookie] = useCookies();
    const [text,setText] = React.useState('')
     const [open,setOpen] = React.useState(false)
     const [header,setHeader] = React.useState("Invalid Input Given");
      function handleClose(e){
        setOpen(false);
        setText('')
        setHeader('Invalid Input Given')
        window.location.reload(true);
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
                setOpen(true);
                setText(deleteData.data.message);
                setHeader("Data Deleted");
            }else{
                setOpen(true);
                setText(deleteData.data.message);
                setHeader("Not Able To Delete Data");
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
                <Button  style={buttonStyle} onClick={(event)=>{props.handleImagesShow(event,props.info.id)}}>View Images <Visibility style={iconstyle}/></Button>
                <Button style={buttonStyle} href={props.info.link}>Map Location<LocationOnIcon style={iconstyle}/></Button>                
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
        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
    
    </>
    )
}