import React,{useContext, useEffect} from 'react'
import { videoContext } from '../Context/VideoContext';

function ToastNotification() {
    const videocontext = useContext(videoContext)
    useEffect(()=>{
      if(!videocontext.showToastNotification){
        document.body.style.opacity = "1";
      }
      },[videocontext.showToastNotification]);
      useEffect(()=>{
      if(videocontext.showToastNotification){
        setTimeout(() => {
          videocontext.setshowToastNotification(false);
        }, 3000);
      }
      },[videocontext.showToastNotification]);
  return videocontext.showToastNotification && (
    <div id="toast_notification" className='transition'>
    <div id="toast_text">
      <p style={{fontSize:"1rem"}}>{videocontext.NotificationMessage}</p>
      <span>undo</span>
     </div>
    </div>
  )
}

export default ToastNotification