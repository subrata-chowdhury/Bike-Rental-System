import './App.css'
import React, { useEffect } from 'react'
import LogInPage from './components/LogInPage'
import HomePage from './components/HomePage'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import AdminPage from './components/AdminPage/AdminPage'
import { useSocket } from './scripts/socket'
import BikePage from './components/BikePage'
import { OrderdBikesProvider } from './contexts/OrderdBikesContext'
import BikesPage from './components/AdminPage/BikesPage'
import UsersPage from './components/AdminPage/UsersPage'
import BookingPage from './components/AdminPage/BookingPage'
import AddBikePage from './components/AdminPage/AddBikePage'
import EditBikePage from './components/AdminPage/EditBikePage'

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

                        <Route path="/admin/bikes" element={<BikesPage />} />
                        <Route path="/admin/users" element={<UsersPage />} />
                        <Route path="/admin/bookings" element={<BookingPage />} />
                        <Route path="/admin/bikes/new" element={<AddBikePage />} />
                        <Route path="/admin/bikes/:bikeId" element={<EditBikePage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </div >
        </OrderdBikesProvider>
    )
}

export default App;

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh', color: '#333' }}>
            <h1 className='text-center'>Page Not Found</h1>
            404 Not Found
            <button className='btn btn-primary mt-3' onClick={() => navigate('/')}>Go to Home</button>
        </div>
    )
}
