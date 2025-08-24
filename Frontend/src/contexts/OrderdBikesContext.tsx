import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Bike } from '../Types';
import { getBookings } from '../scripts/API Calls/bookingApiCalls.ts';

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
        getBookings(0, { endTime: { $lt: new Date().toISOString() }, status: 'picked up' }, (data) => {
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