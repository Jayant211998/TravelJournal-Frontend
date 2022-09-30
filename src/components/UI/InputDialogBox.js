import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from "@material-ui/core/Input";
import { useEffect } from 'react';

const inputStyle={
    width:'28rem',
    height:'4rem',
    marginTop:'0.5rem',
    fontSize:'1.5rem'
  
  }
  const btnStyle={
    backgroundColor:'gray',
    width:'15%',
    padding:'1%',
    borderRadius:'0.5rem',
    color:'black',
    fontSize:'1.5rem'
  }
export default function InputDialogBox(props){
    useEffect(()=>{},[props.error])
    return(
        <>
        <Dialog
        open={true}
        fullWidth
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{fontSize:'5rem'}}><b style={{fontSize:'2.3rem'}}>{props.header}</b></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{color:'black',fontSize:'1.9rem'}}>
           {props.text}
          </DialogContentText>
          <Input
                autoFocus
                variant='outlined'
                margin="dense"
                id="otp"
                name="otp"
                value={props.enteredOtp}
                onChange={(event)=>{props.handleChange(event)}}
                style={inputStyle}
                placeholder="OTP"
                error={props.error}
      /><br/>
      {props.error && <p style={{color:'red'}}>Your Entered OTP is Incorrect.</p>}
        </DialogContent>
        
        <DialogActions>
          
          <button style={btnStyle} onClick={(e)=>{props.handleClose(e)}} color="primary" autoFocus>
            Ok
          </button>
        </DialogActions>
      </Dialog>
   
        </>
    );
}