import React from 'react'
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios'
import {useCookies} from 'react-cookie'
import DialogBox from '../UI/DialogBox';
import { getStorage, ref } from "firebase/storage";
import encrypt from '../../encrypt'


export default function Loaction(props){
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
                <img    className="image" 
                        src={props.info.image} 
                        alt="img" 
                        height="250px" 
                        width="50px" 
                        onClick={(event)=>{props.handleImagesShow(event,props.info.id)}}/>
                <div className="details">
                    <div className="location">
                        <p className="place">{props.info.location}</p>
                        <a href={props.info.link} className="maps">View On Google Maps</a>
                    </div>
                    <div><h3>{props.info.title}</h3></div>
                    <div className="date">
                    <p className='start'>{props.info.startDate}</p>
                    <p className='end'>{props.info.endDate}</p>
                    </div>
                    <p>{props.info.description}</p>
                </div>
                {encrypt[1].decrypt(cookie['auth'])==='admin' && props.show &&<div className="action">  
                    {<Link to={'/editLocation/'+props.info.id}><EditIcon style={{color:'black'}} /></Link>}
                          <DeleteIcon onClick={()=>{deleteDestination(props.info.id)}}/>
                </div>}
            </div>
        </div>
        {open && <DialogBox text={text} handleClose={handleClose} header={header}/>}
    </>
    )
}