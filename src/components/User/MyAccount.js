import {useCookies} from 'react-cookie'
import UserDetails from './UserDetails';
import Button from '@material-ui/core/Button';
import React from 'react';
import DestinationDetails from './DestinationDetails';
import encrypt from '../../encrypt'


export default function MyAccount(){
    const [cookie,setCookie] = useCookies()
    const [details,setDetails] = React.useState('user');

    const setDestinations = (event) =>{
        setDetails('destination');
    }
    const setUser = (event) =>{
        setDetails('user');
    }
    return(<>
    <div className='display'>
        {encrypt[1].decrypt(cookie['auth'])==="admin" && <Button onClick={(event)=>setDestinations(event)}>Your Destinations</Button>}
        <Button onClick={(event)=>setUser(event)}>Your Profile</Button>
    </div>
    {details==="user" && <UserDetails key="1" />}
    {details==="destination" && <DestinationDetails key="2" />}
    </>)
} 