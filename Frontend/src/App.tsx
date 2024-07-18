import './App.css'
import React, { useState } from 'react'
import LogInPage from './components/LogInPage'
import HomePage from './components/HomePage'

const App: React.FC = (): JSX.Element => {
    const [isLogIn, setIsLogIn] = useState<boolean>(false)
    return (
        <>
            <div className='container-fluid d-grid align-items-start w-100 p-0' style={{ height: '100vh', zIndex: -5 }}>
                <img src="bg.webp" alt="Bike" className="w-100 h-100 position-fixed" style={{ zIndex: -5 }} />
                {isLogIn ? <HomePage setIsLogIn={setIsLogIn} /> : <LogInPage setIsLogIn={setIsLogIn} />}
            </div >
        </>
    )
}

export default App
