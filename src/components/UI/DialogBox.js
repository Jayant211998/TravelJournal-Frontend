import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DialogBox(props){
   const btnStyle={
      backgroundColor:'gray',
      width:'15%',
      padding:'1%',
      borderRadius:'0.5rem',
      color:'black',
      fontSize:'1.5rem'
    }
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