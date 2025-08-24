import { useState } from 'react';
import BikeForm from '../components/BikeForm'
import { Bike } from '../../Types';

const AddBikePage = () => {
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

    return (
        <BikeForm bikeDetails={bikeDetails} onChange={setBikeDetails} />
    )
}

export default AddBikePage