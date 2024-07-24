import React, { useEffect, useState } from "react";
import { BikeCardProp as Bike } from './BikeCard';
import { getTypes } from "../scripts/API Calls/bikeApiCalls";

interface Tags {
    brand: string[];
    cc: number[];
    type: string[];
    horsePower: number[];
}

type FilterProp = {
    getBikesByPage: (page: number, filterData?: FilterData, searchData?: string | undefined) => Promise<void>;
}

export type FilterData = {
    brand: string[];
    cc: number[];
    type: string[];
    horsePower: number[];
}

const Filter: React.FC<FilterProp> = ({ getBikesByPage }): JSX.Element => {
    const [searchData, setSearchData] = useState<string | undefined>('');
    const [filterData, setFilterData] = useState<FilterData>({
        brand: [],
        cc: [],
        type: [],
        horsePower: []
    });

    const [tags, setTags] = useState<Tags>({
        brand: ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'],
        cc: [100, 150, 200, 250],
        type: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
        horsePower: [100, 150, 200, 250]
    })

    useEffect(() => {
        getBikesByPage(1, filterData, searchData);
        getTypes().then((data: Tags) => setTags(data))
    }, [filterData, searchData])

    return (
        <div className='filter card align-self-start bg-glass bg-mid-white' style={{ zIndex: 5 }}>
            <div className='card-body'>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control border-secondary bg-deep-white' placeholder='Search by Bike Model' value={searchData} onChange={e => setSearchData(e.target.value)} />
                    <button className='btn btn-secondary' type='button' id='button-addon2'>Search</button>
                </div>
                <div>
                    <div>Filter By</div>
                    <div className='contianer scroll' style={{ maxHeight: '50vh' }}>
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
                                                            <input type="checkbox" className='form-check-input border-2 border-secondary bg-secondary rounded-pill p-2 cursor-pointer' onChange={() => {
                                                                if (filterData[tag as keyof FilterData].includes(value as never)) {
                                                                    setFilterData({
                                                                        ...filterData,
                                                                        [tag]: filterData[tag as keyof FilterData].filter((data: string | number) => data !== value)
                                                                    })
                                                                } else {
                                                                    setFilterData({
                                                                        ...filterData,
                                                                        [tag]: [...filterData[tag as keyof FilterData], value]
                                                                    })
                                                                }
                                                            }}></input>
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