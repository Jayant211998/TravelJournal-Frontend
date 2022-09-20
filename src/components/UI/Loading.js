import { createRoot } from 'react-dom/client';
import ReactLoading from 'react-loading'
import './header.css'

export default function Loading(){
    createRoot(document.getElementById('loading')).render(
        <div
            className="loader"
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