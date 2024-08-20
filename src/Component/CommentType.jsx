import {React,useState} from 'react'
import UploadVideo from './uploadVideo'

function CommentType() {
    let [OpenuploadPage,setOpenuploadPage] = useState(false);
    const showComp= ()=>{
       setOpenuploadPage(true);
    }
    const HandleRadioBtnValue = (e) => {
        sessionStorage.setItem("commentMode",e.target.value);
    }
  return OpenuploadPage ? (
    <UploadVideo/>
  ):(
    <div className='comment_Type'>
        <h3>Comment Mode</h3>
        <div>
      <input type="radio" name='commentType' value="on" id='on' checked={true} onClick={HandleRadioBtnValue}/><label htmlFor="On" >On</label>
      </div>
      <div>
      <input type="radio" name='commentType' id='off' value="Off" onClick={HandleRadioBtnValue}/><label htmlFor="Off">Off</label>
      </div>
      <button onClick={showComp}>Next</button>
    </div>
  )
}

export default CommentType
