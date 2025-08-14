import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Bike } from '../Types';
import { getBookingDetailsThatHasToReturnToday } from '../scripts/API Calls/bookingApiCalls';

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
        getBookingDetailsThatHasToReturnToday((bikesData: Bike[]) => {
            if (bikesData.length === 0) {
                return;
            }
            setOrderedBikes(bikesData);
        })
    }, [])

    return (
        <OrderdBikesContext.Provider value={{ orderedBikes, addBike, removeBike, clearBikes }}>
            {children}
        </OrderdBikesContext.Provider>
    );
};