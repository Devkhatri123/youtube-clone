import React, { useContext } from 'react'
import { videoContext } from '../Context/VideoContext'
import { RxCross1 } from 'react-icons/rx';
import { EmailShare, FacebookShare, TwitterShare } from 'react-share-kit';
import { WhatsappShare } from 'react-share-kit';
import { RedditShare } from 'react-share-kit';
import { PinterestShare } from 'react-share-kit';
import "../CSS/VideoPage.css"
function ShareOnSocialMediaModal(props) {
    const videocontext = useContext(videoContext);
    const copyLink = async(e) => {
      const linkInput = document.getElementById("link");
      try{
         await navigator.clipboard.writeText(linkInput.value)
         e.target.innerText = "Copied!";
         videocontext.setshowToastNotification(true);
         videocontext.setNotificationMessage('Link Copied!');
         setTimeout(() => {
            e.target.innerText = "Copy";
            // videocontext.setshowToastNotification(false)
         }, 1000);
      }catch(error){
        console.log(error)
      }
    }
  return videocontext.showModal && (
    <div className='shareModal'>
      <div className="modalHeader">
       <RxCross1 onClick={()=>videocontext.setshowModal(false)}/>
       <div><h2>Share Video on Social Media</h2></div>
      </div>
      <div id="Icons">
        <FacebookShare 
        url={'www.google.com'}
        quote='My video'
        hashtag={'#react-share-kit'}
        borderRadius={'50%'}
        style={{marginRight:"12px"}}
        />
        <WhatsappShare 
        url={'www.google.com'}
        title='My video'
        borderRadius={'50%'}
        style={{marginRight:"12px"}}
        />
        <TwitterShare
       url={'https://github.com/ayda-tech/react-share-kit'}
       title={'react-share-kit - social share buttons for next & react apps.'}
       hashtags={["#react-share-kit", "#front-end"]}
       borderRadius={'50%'}
       style={{marginRight:"12px"}}
   />
    <EmailShare
    url={'www.google.com'}
    subject={'Next Share'}
    body="body"
    borderRadius={'50%'}
    style={{marginRight:"12px"}}
   />
   <RedditShare
    url={'www.google.com'}
    subject={'Next Share'}
    body="body"
    borderRadius={'50%'}
    style={{marginRight:"12px"}}
   />
   <PinterestShare
    url={'www.google.com'}
    subject={'Next Share'}
    body="body"
    borderRadius={'50%'}
    style={{marginRight:"12px"}}
   />
      </div>
      <div id="url">
        <input type="text" id='link' disabled value={!props.URL? window.location.href: `http://localhost:3000/watch?v=${props.URL}`}/>
        <button onClick={copyLink}>Copy</button>
      </div>
    </div>
  )
}

export default ShareOnSocialMediaModal
