import React from 'react'
import "../CSS/LoadingScreen.css"
function MainPageLoadingScreen() {
  return (
    <>
    <div class="navbar">
        <div class="navbar-logo"></div>
        <div className="large-screennavbar-center">
        <input type="text" name="" id="search-term" placeholder='search here' disabled/>
      <button></button> </div>
        <div class="navbar-icons">
            <div class="navbar-icon"></div>
            <div class="navbar-icon"></div>
            <div class="navbar-icon"></div>
        </div>
    </div>


    <div class="skeleton-container">
        <div class="skeleton-card">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-details">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-details">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-details">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-details">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-details">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-details">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
    </div>

    </>
  )
}

export default MainPageLoadingScreen
