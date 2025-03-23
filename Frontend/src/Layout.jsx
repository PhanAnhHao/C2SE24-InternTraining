import React from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='app-container'>
            <div className='header-container'>
                <Header />
            </div>
            <div className='main-container'>
                <div className='sidenav-container'>

                </div>
                <div className='app-container pt-20'>
                    <Outlet />
                </div>
            </div>
            <div className='footer-container'>
                <Footer />
            </div>
        </div>
    )
}

export default Layout
