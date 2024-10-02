import React from 'react'
import "../CSS/LoadingScreen.css";
function VideoPageLoadingScreen() {
  return (
    <div class="container">
    <div class="main-content">
        <div class="video-placeholder"></div>

        <div class="video-details">
            <div class="text-line title-placeholder"></div>

            <div style={{display:"flex",justifyContent:"space-between"}}>
            <div class="profile-actions">
                <div class="profile-placeholder"></div>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                <div class="text-line user-name-placeholder"></div>
                <div class="text-line subscriber"></div>
                </div>
            </div>

            <div class="buttons-placeholder">
                <div class="button-placeholder"></div>
                <div class="button-placeholder"></div>
                <div class="button-placeholder"></div>
            </div>
            </div>

            <div class="comments-section">
                <div class="comment-placeholder"></div>
                <div class="comment-placeholder"></div>
                <div class="comment-placeholder"></div>
            </div>
        </div>
    </div>

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

export default VideoPageLoadingScreen
