import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Bike } from '../Types';
import { getBookings } from '../scripts/API Calls/bookingApiCalls.ts';
import { useSocket } from '../scripts/socket.ts';

type OrderdBikesContextType = {
    orderedBikes: Bike[];
    addBike: (bike: Bike) => void;
    removeBike: (id: string) => void;
    clearBikes: () => void;
};

const OrderdBikesContext = createContext<OrderdBikesContextType | undefined>(undefined);

export const useOrderdBikes = () => {
    const context = useContext(OrderdBikesContext);
    if (!context) {
        throw new Error('useOrderdBikes must be used within an OrderdBikesProvider');
    }
    return context;
};

export const OrderdBikesProvider = ({ children }: { children: ReactNode }) => {
    const [orderedBikes, setOrderedBikes] = useState<Bike[]>([]);
    const socket = useSocket();
    const location = window.location;

    const addBike = (bike: Bike) => {
        setOrderedBikes(prev => [...prev, bike]);
    };

    const removeBike = (id: string) => {
        setOrderedBikes(prev => prev.filter(bike => bike._id !== id));
    };

    const clearBikes = () => {
        setOrderedBikes([]);
    };


    useEffect(() => {
        if (!socket.current) return;

        socket.current.on('booking_details_changed', () => {
            if (!location.pathname.split('/').includes('admin'))
                getBookings(0, { status: 'picked up' }, (data) => {
                    const bikes: Bike[] = [];
                    data.bookings.forEach(booking => {
                        bikes.push(booking.bike)
                    })
                    if (bikes.length === 0) {
                        return;
                    }
                    setOrderedBikes(bikes);
                })
        });

        return () => {
            socket.current?.off('booking_details_changed');
        };
    }, [socket]);

    useEffect(() => {
        if (!location.pathname.split('/').includes('admin'))
            getBookings(0, { status: 'picked up' }, (data) => {
                const bikes: Bike[] = [];
                data.bookings.forEach(booking => {
                    bikes.push(booking.bike)
                })
                if (bikes.length === 0) {
                    return;
                }
                setOrderedBikes(bikes);
            })
    }, [])

    return (
        <OrderdBikesContext.Provider value={{ orderedBikes, addBike, removeBike, clearBikes }}>
            {children}
        </OrderdBikesContext.Provider>
    );
};