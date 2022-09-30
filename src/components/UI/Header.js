import React from 'react';
import {Menu,MenuItem} from '@material-ui/core'
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {useCookies} from 'react-cookie';
import encrypt from '../../encrypt';
import './header.css';

export default function Header(){
    const imgStyle={height:"3.5rem",
                width:"3.5rem",
                borderRadius:"50%",
                border: '0.2rem solid #F55A5A',
              }
    const hoverStyle={
                height:"4rem",
              width:"4rem",
              borderRadius:"50%",
            }

    const [cookie,setCookie,removeCookie] = useCookies()

    const [menu,setmenu]=React.useState(false);
    const [img,setImg] = React.useState(false); 
    const handleClick=(e)=>{
        setmenu(true)
    }
    const handleClose=(e,event)=>{
        setmenu(false);
        if(event!=="close")
            event();
    } 
    const logout =()=>{
        removeCookie('username')
        removeCookie('auth')
        removeCookie('name')
        removeCookie('id')
        removeCookie('token')
        removeCookie('image')
        removeCookie('key')

        window.location.replace('/')
    }
    const myaccount=()=>{
        window.location.replace('/myaccount')

    }
    
    return(
        <header className='header' >           
            <div className="heading">
                <div className="backButton">
                <ArrowBackIosIcon fontSize="large" onClick={()=>{window.location.replace('/main')}} width="medium"/>
                </div>
               <a href='/main'>My Travel Journal</a>
            </div>
            <div className='img'>
            <div className='icon'>
                {cookie['token']!=undefined && (cookie["image"]!="undefined" && cookie["image"]!=""?
                <img src={cookie["image"]}
                     onClick={(e)=>handleClick(e)}
                     onMouseOver={()=>{setImg(true)}} 
                     onMouseLeave={()=>{setImg(false)}} 
                     style={img?hoverStyle:imgStyle}/>:
                <PersonSharpIcon 
                    aria-controls="menu-appbar" 
                    fontSize="large" 
                    onMouseOver={()=>{setImg(true)}}
                    onMouseLeave={()=>{setImg(false)}} 
                    style={img?hoverStyle:imgStyle}
                    aria-haspopup="true"
                    onClick={(e)=>{handleClick(e)}}/>)}
            </div>
            </div>
            <Menu
                id="simple-menu"
                anchorOrigin={{
                    vertical:'top',
                    horizontal:'right'
                }}
                keepMounted
               
                open={menu}
                onClose={(e)=>{handleClose(e,"close")}}
            >
                <div className="dropdown">
                <MenuItem  disabled style={{fontSize:'1.5rem'}} className="dropdown-item">{encrypt[1].decrypt(cookie['name'])}</MenuItem>
                <MenuItem onClick={(e)=>{handleClose(e,myaccount)}} style={{fontSize:'1.5rem'}}>My Account</MenuItem>
                <MenuItem onClick={(e)=>{handleClose(e,logout)}} style={{fontSize:'1.5rem'}}>Logout</MenuItem>
                </div>
            </Menu>
        </header>
    )
}