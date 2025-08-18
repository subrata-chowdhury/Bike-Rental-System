import { useEffect, useState } from 'react';
import BikeForm from './BikeForm'
import { Bike } from '../../Types';
import { useLocation } from 'react-router-dom';

const EditBikePage = () => {
    const [bikeDetails, setBikeDetails] = useState<Bike>({
        bikeModel: '',
        pricePerHour: 0,
        isAvailable: true,
        brand: '',
        cc: 0,
        horsePower: 0,
        type: '',
        images: []
    });
    const location = useLocation();

    useEffect(() => {
        setBikeDetails(location.state)
    }, [location.state]);

    return (
        <BikeForm bikeDetails={bikeDetails} onChange={setBikeDetails} />
    )
}

export default EditBikePage