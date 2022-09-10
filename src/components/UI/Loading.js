import { createRoot } from 'react-dom/client';
import ReactLoading from 'react-loading'


export default function Loading(){
    createRoot(document.getElementById('loading')).render(
        <div
            style={{marginLeft:'43%',marginTop:'10%'}}
        >
        <ReactLoading
        type="spinningBubbles"
        color="#F55A5A"
        height={500}
        width={250}
      />
      </div>
      )
} 