import {useCookies} from 'react-cookie'
import React from 'react';
import encrypt from '../../encrypt';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import './user.css'


export default function MyAccount(){

    
    const [cookie] = useCookies();
    
    const imgStyle={height:"15rem",
                width:"15rem",
                borderRadius:"50%",
                margin:'0% 7.5%',
                border: '.1rem solid black' 
              }
    
    
    return(
    <div>
    {encrypt[1].decrypt(cookie['auth'])==="admin" &&
            <div className='mytab-button'>
                <button className="mytab-active" onClick={(event)=>{window.location.replace('/myaccount/destinationdetails')}}>Destinations</button>
                <button  className="mytab-disable" onClick={(event)=>{window.location.replace('/myaccount')}}>Profile</button>
            </div>
        }
            <div className="page">
            <div className="my-details">
            {cookie['token']!=undefined && (cookie["image"]!="undefined" && cookie["image"]!=""?
                <img src={cookie['image']}  className="imgStyle1"/>:
                <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true"  style={imgStyle}/></>
            )}
            <table className="table">
            <tr className="rowstyle"><td className="tablestyle"><h4 className="textStyle">Name:</h4></td> <td className="tablestyle"><h4 >{encrypt[1].decrypt(cookie['name'])}</h4></td></tr>
            <tr className="rowstyle"><td className="tablestyle"><h4 className="textStyle">UserName:</h4></td> <td className="tablestyle"><h4>{encrypt[1].decrypt(cookie['username'])}</h4></td></tr>
            <tr className="rowstyle"><td className="tablestyle"><h4 className="textStyle"> Authrization:</h4></td> <td className="tablestyle"><h4>{encrypt[1].decrypt(cookie['auth']).toUpperCase()}</h4></td></tr>
            </table>
            <button className="user-button" onClick={(e)=>{window.location.replace('myaccount/edit')}}>Edit</button>
            <br/><button className="user-button" onClick={(e)=>{window.location.replace('myaccount/changepassword')}}>Change Password</button>
            </div>
    </div>
    </div>
    );
} 