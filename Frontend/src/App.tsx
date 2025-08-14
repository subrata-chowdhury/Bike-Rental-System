import './App.css'
import React, { useEffect } from 'react'
import LogInPage from './components/LogInPage'
import HomePage from './components/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import AdminPage from './components/AdminPage/AdminPage'
import { useSocket } from './scripts/socket'
import BikePage from './components/BikePage'
import { OrderdBikesProvider } from './contexts/OrderdBikesContext'

const App: React.FC = (): React.JSX.Element => {
    const socketRef = useSocket();

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('user_logedin', (user) => {
            console.log(user)
        });

        return () => {
            socketRef.current?.off('user_logedin');
        };
    }, [socketRef]);

    return (
        <OrderdBikesProvider>
            <div className='container-fluid w-100 p-0 d-flex flex-column' style={{ minHeight: '100vh', zIndex: -5, backgroundColor: '#f0f0f0' }}>
                {/* <img src="bg3.jpg" alt="Bike" className="w-100 h-100 position-fixed" style={{ zIndex: -5 }} /> */}
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/login" element={<LogInPage />} />
                        <Route path='/bike/:id' element={<BikePage />} />

                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path='*' element={<div>404 Not Found</div>} />
                    </Routes>
                </BrowserRouter>
            </div >
        </OrderdBikesProvider>
    )
}

export default App
