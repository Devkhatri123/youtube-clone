import React, { useContext } from 'react'
import NointernetPic from "../Pics/youtube.png"
import "../CSS/ErrorPage.css"
import { Navbarcontext } from '../Context/NavbarContext'
function ErrorPage(props) {
  const navbarContext = useContext(Navbarcontext);
  console.log(navbarContext)
  return navbarContext.Error || navbarContext.ErrorMessage || (
    <div className='error-page'>
      <div className='error-page-content'>
        <img src={NointernetPic} alt='NointernetPic'/>
        <p>{props.ErrorMessage || navbarContext.ErrorMessage}.</p>
        <button>Retry</button>
      </div>
    </div>
  )
}

export default ErrorPage
