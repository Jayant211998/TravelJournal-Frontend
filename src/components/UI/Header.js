import React from 'react'
import {Menu,MenuItem} from '@material-ui/core'
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import {useCookies} from 'react-cookie'
import encrypt from '../../encrypt'

export default function Header(){
    const imgStyle={height:"35px",
                width:"35px",
                borderRadius:"50%",
                margin:'0% 7.5%',
                border: '1px solid black' 
              }

    const [cookie,setCookie,removeCookie] = useCookies()

    const [menu,setmenu]=React.useState(false);

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
        <header className='header'>           
            <div className="heading">
               <a href='/main' style={{textDecoration:'none',color:'white'}}>My Travel Journal</a>
            </div>
            <div className='links'>
                {cookie['token']!=undefined && (cookie["image"]!="undefined" && cookie["image"]!=""?
                <img src={cookie["image"]} onClick={(e)=>handleClick(e)} style={imgStyle}/>:
                <PersonSharpIcon aria-controls="menu-appbar" 
                aria-haspopup="true" onClick={(e)=>{handleClick(e)}}/>)}
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
                <div style={{position:'fixed',top:'12%',left:'89%',backgroundColor:'white'}}>
                <MenuItem  disabled style={{color:'black',fontWeight:'4px'}}>{encrypt[1].decrypt(cookie['name'])}</MenuItem>
                <MenuItem onClick={(e)=>{handleClose(e,myaccount)}}>My Account</MenuItem>
                <MenuItem onClick={(e)=>{handleClose(e,logout)}}>Logout</MenuItem>
                </div>
            </Menu>
        </header>
    )
}