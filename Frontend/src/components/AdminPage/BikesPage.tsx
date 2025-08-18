import React, { useState } from 'react';
import { deleteBike, getBikesByIndex } from '../../scripts/API Calls/bikeApiCalls.ts';
import Filter from '../Filter';
import Pages from '../Pages';
import { Bike, FilterData } from '../../Types';
import tick from '../../assets/tick.svg';
import Plus from '../../assets/reactIcons/Plus';
import { AdminPanel } from "./component/AdminPanel";
import deleteIcon from '../../assets/delete.svg';
import { Link, useNavigate } from 'react-router-dom';

const BikesPage = () => {
    return (
        <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
            <AdminPanel />
            <div className='flex-grow-1'>
                <Bikes />
            </div>
        </div>
    )
}

export default BikesPage;

const Bikes: React.FC = (): React.JSX.Element => {
    const [bikeData, setBikeData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(3)
    const navigate = useNavigate();

    const getBikesByPage = async (page: number, filterData?: FilterData, searchData?: string | undefined): Promise<void> => {
        if (page <= 0) return;
        getBikesByIndex((page - 1) * 6, filterData, searchData, (data) => {
            setBikeData(data.bikes);
            setNoOfPages(Math.ceil(data.totalBikes / 6))
        })
    }

    return (
        <>
            <div className='d-flex justify-content-end p-2 px-3 align-items-center gap-4 bg-white'>
                <Link to={'/admin/bikes/new'} className='btn btn-dark d-flex justify-content-center align-items-center px-3 py-2 ps-2' style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <span className='me-2 ps-1'><Plus size={20} /></span>New Bike
                </Link>
            </div>
            <div className='p-3 d-flex'>
                <Filter onChange={getBikesByPage} />
                <div className='ms-2 ps-0 flex-grow-1'>
                    <div className='scroll flex-grow-1' style={{ maxHeight: '88vh' }}>
                        {bikeData ? bikeData.map((bike: Bike) => (
                            <AdminBikeCard
                                {...bike}
                                key={bike._id}
                                onClick={() => navigate(`/admin/bikes/${bike._id}`, { state: bike })}
                            />
                        )) : <h4 className='text-center'>Add a Bike First</h4>}
                    </div>
                    <Pages onPageChange={getBikesByPage} noOfPages={noOfPages} />
                </div>
            </div>
        </>
    );
};

const AdminBikeCard: React.FC<Bike & { onClick: () => void }> = ({
    _id,
    bikeModel,
    isAvailable,
    brand,
    images,
    onClick
}): React.JSX.Element => {
    images = images ? images.map(image => ("http://localhost:5000/uploads/" + image)) : ['bike.svg'];

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (_id)
            deleteBike(_id)
    }

    return (
        <>
            <div className='card bg-white mb-2 cursor-pointer' onClick={onClick}>
                <div className='card-body'>
                    <div className='d-flex flex-row'>
                        <div className='flex-grow-1'>
                            <h5 className='m-0 p-0'>{bikeModel}</h5>
                            <span className='m-0'>{brand}{isAvailable && <span><img width={15} height={15} className='ms-2' src={tick}></img></span>}</span>
                        </div>
                        <button className='btn p-0 cursor-pointer' onClick={onDeleteHandler}>
                            <img className='' src={deleteIcon}></img>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}