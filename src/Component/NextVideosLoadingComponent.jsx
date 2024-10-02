import React from 'react'
import "../CSS/LoadingScreen.css";
function NextVideosLoadingComponent() {
  return (
    <div className='NextVideosLoading'>
      <div class="suggested-videos">
        <div class="video-suggestion-placeholder">
            <div className='suggested-video'></div>
            <div className='suggested-video-info'>
            <div className='video-title'></div>
            <div className='video-Views'></div>
            </div>
        </div>
        <div class="video-suggestion-placeholder">
            <div className='suggested-video'></div>
            <div className='suggested-video-info'>
            <div className='video-title'></div>
            <div className='video-Views'></div>
            </div>
        </div>
        <div class="video-suggestion-placeholder">
            <div className='suggested-video'></div>
            <div className='suggested-video-info'>
            <div className='video-title'></div>
            <div className='video-Views'></div>
            </div>
        </div>
    </div>
        </div>
  )
}

export default NextVideosLoadingComponent