import {useCookies} from 'react-cookie'
import Button from '@material-ui/core/Button';
import React from 'react';
import encrypt from '../../encrypt';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import './user.css'


export default function MyAccount(){
    const [cookie,setCookie] = useCookies();
    const imgStyle={height:"150px",
                width:"150px",
                borderRadius:"50%",
                margin:'0% 7.5%',
                border: '1px solid black' 
              }
    const tablestyle={
                textAlign:'left',
                marginLeft:'10px'

    }
    const rowstyle={
        padding:'0',
        lineHeight: '0px',
    }
    const textStyle={
        marginLeft:'50px',
        marginRight:'10px'
    }
    return(
    <>
    {encrypt[1].decrypt(cookie['auth'])==="admin" &&
            <div>
                <button className="tab-active" onClick={(event)=>{window.location.replace('/myaccount/destinationdetails')}}>Destinations</button>
                <button  className="tab-disable" onClick={(event)=>{window.location.replace('/myaccount')}}>Profile</button>
            </div>
        }
            <div style={{marginTop:'3%'}}>
            {cookie['token']!=undefined && (cookie["image"]!="undefined" && cookie["image"]!=""?
                <img src={cookie['image']}  style={imgStyle}/>:
                <><PersonSharpIcon aria-controls="menu-appbar" aria-haspopup="true"  style={imgStyle}/></>
            )}
            <table style={{marginLeft:'auto',marginRight:'auto'}}>
            <tr style={rowstyle}><td style={tablestyle}><h4 style={textStyle}>Name:</h4></td> <td style={tablestyle}><h4 >{encrypt[1].decrypt(cookie['name'])}</h4></td></tr>
            <tr style={rowstyle}><td style={tablestyle}><h4 style={textStyle}>UserName:</h4></td> <td style={tablestyle}><h4>{encrypt[1].decrypt(cookie['username'])}</h4></td></tr>
            <tr style={rowstyle}><td style={tablestyle}><h4 style={textStyle}> Authrization:</h4></td> <td style={tablestyle}><h4>{encrypt[1].decrypt(cookie['auth']).toUpperCase()}</h4></td></tr>
            </table>
            <Button style={{marginLeft:'50px',minHeight:'20px',minWidth:'180px'}} color="primary" variant="contained"
                onClick={(e)=>{window.location.replace('myaccount/edit')}}>Edit</Button>
            <Button style={{marginLeft:'4px',minHeight:'20px',minWidth:'180px'}} color="primary" variant="contained"
                onClick={(e)=>{window.location.replace('myaccount/changepassword')}}>Change Password</Button>
    </div>
    </>
    );
} 