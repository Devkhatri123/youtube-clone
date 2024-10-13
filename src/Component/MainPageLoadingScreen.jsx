import React from 'react'
import "../CSS/LoadingScreen.css"
function MainPageLoadingScreen() {
  return (
    <>
    <div className="navbar">
        <div className="navbar-logo"></div>
        <div className="large-screennavbar-center">
        <input type="text" name="" id="search-term" placeholder='search here' disabled/>
      <button></button> </div>
        <div className="navbar-icons">
            <div className="navbar-icon"></div>
            <div className="navbar-icon"></div>
            <div className="navbar-icon"></div>
        </div>
    </div>


    <div className="skeleton-container">
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        </div>
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        </div>
    </div>

    </>
  )
}

export default MainPageLoadingScreen
