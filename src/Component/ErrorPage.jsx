import React from 'react'
import NointernetPic from "../Pics/youtube.png"
import "../CSS/ErrorPage.css"
function ErrorPage(props) {
  return (
    <div className='error-page'>
      <div className='error-page-content'>
        <img src={NointernetPic} alt='NointernetPic'/>
        <p>{props.ErrorMessage}.</p>
        <button>Retry</button>
      </div>
    </div>
  )
}

export default ErrorPage
