import React, { useEffect } from "react";
import { BikeCardProp as Bike } from './BikeCard';

interface Tags {
    brand: string[];
    cc: number[];
    type: string[];
    horsePower: number[];
}

type FilterProp = {
    bikeData: Bike[];
    setBikeData: (bikeData: Bike[]) => void;
}

const Filter: React.FC<FilterProp> = ({ bikeData, setBikeData }): JSX.Element => {
    const tags: Tags = {
        brand: ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'],
        cc: [100, 150, 200, 250],
        type: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
        horsePower: [100, 150, 200, 250]
    }

    function inputOnChangeHandler(event: React.ChangeEvent<HTMLInputElement>): void {
        const searchValue = event.target.value.trim();
        const filteredData = bikeData.filter((bike: Bike) => bike.bikeModel.toLowerCase().includes(searchValue.toLowerCase()));
        setBikeData(filteredData);
    }

    function checkboxOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        const filterKey = e.target.name;
        const filterValue = e.target.value;
        if (e.target.checked == false) setBikeData(bikeData)
        else {
            const filteredData = bikeData.filter((bike: Bike) => {
                if (filterKey == 'brand') {
                    return bike.brand == filterValue;
                } else if (filterKey == 'cc') {
                    return bike.cc === parseInt(filterValue);
                } else if (filterKey == 'type') {
                    return bike.type === filterValue;
                } else if (filterKey == 'horsePower') {
                    return bike.horsePower === parseInt(filterValue);
                }
                return true;
            });
            setBikeData(filteredData);
        }
    }

    useEffect(() => {
        setBikeData(bikeData)
    }, [bikeData])

    return (
        <div className='filter card align-self-start bg-glass bg-mid-white' style={{ zIndex: 5 }}>
            <div className='card-body'>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control border-secondary bg-deep-white' placeholder='Search by Bike Model' onChange={inputOnChangeHandler} />
                    <button className='btn btn-secondary' type='button' id='button-addon2'>Search</button>
                </div>
                <div>
                    <div>Filter By</div>
                    <div className='contianer'>
                        {
                            Object.keys(tags).map((tag: string, index: number) => (
                                <div style={{ display: 'inline-block' }} key={index}>
                                    <div className='dropdown me-3 p-2'>
                                        <div className='fw-bold fs-6 ms-1'>
                                            {tag}:
                                        </div>
                                        <div className='py-2 rounded'>
                                            {
                                                tags[tag as keyof Tags].map((value: string | number, index: number) => (
                                                    <div key={index} className="form-check mb-1 cursor-pointer">
                                                        <label className="form-check-label cursor-pointer">
                                                            {value}
                                                            <input type="checkbox" className='form-check-input border-2 border-secondary bg-secondary rounded-pill p-2 cursor-pointer' value={value} name={tag} onChange={checkboxOnChangeHandler}></input>
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter