import './App.css'
import React, { useState } from 'react'
import LogInPage from './components/LogInPage'

const App: React.FC = (): JSX.Element => {
    const [isLogIn, setIsLogIn] = useState<boolean>(false)
    return (
        <>
            <div className='container-fluid d-grid align-items-center w-100 p-0' style={{ height: '100vh' }}>
                {isLogIn ? "logged In" : <LogInPage setIsLogIn={setIsLogIn} />}
            </div >
        </>
    )
}

export default App
