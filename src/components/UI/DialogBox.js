import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function DialogBox(props){
    return(
        <>
        <Dialog
        open={true}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {props.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={(e)=>{props.handleClose(e)}} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
   
        </>
    );
}