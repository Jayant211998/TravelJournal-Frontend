import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


export default function Images(props){
    const [photoIndex,setPhotoIndex] = React.useState(0);
 
    return(
        <Lightbox
            mainSrc={props.imageList[photoIndex]}
            nextSrc={props.imageList[(photoIndex + 1) % props.imageList.length]}
            prevSrc={props.imageList[(photoIndex + props.imageList.length - 1) % props.imageList.length]}
            onCloseRequest={(event)=> {props.handleImageHide(event)}}
            onMovePrevRequest={() => setPhotoIndex(photoIndex => (photoIndex + props.imageList.length - 1) % props.imageList.length)}
            onMoveNextRequest={() => setPhotoIndex(photoIndex => (photoIndex + 1) % props.imageList.length)}
          />  
    );
}