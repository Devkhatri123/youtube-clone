import React from 'react'
import NointernetPic from "../Pics/youtube.png"
import "../CSS/ErrorPage.css"
function ErrorPage() {
  return (
    <div className='error-page'>
      <div className='error-page-content'>
        <img src={NointernetPic} alt='NointernetPic'/>
        <p>You're offline. Check your connection.</p>
        <button>Retry</button>
      </div>
    </div>
  )
}

export default ErrorPage
