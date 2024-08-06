import React, { useEffect, useState } from "react";
import { getTypes } from "../scripts/API Calls/bikeApiCalls";
import { FilterData } from "../Types";

interface FilterProp {
    onChange: (page: number, filterData?: FilterData, searchData?: string) => Promise<void>;
}

const Filter: React.FC<FilterProp> = ({ onChange }): JSX.Element => {
    const [searchData, setSearchData] = useState<string>('');
    const [filterData, setFilterData] = useState<FilterData>({
        brand: [],
        cc: [],
        type: [],
        horsePower: []
    });

    const [tags, setTags] = useState<FilterData>({
        brand: ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'],
        cc: [100, 150, 200, 250],
        type: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
        horsePower: [100, 150, 200, 250]
    })

    useEffect(() => {
        onChange(1, filterData, searchData);
    }, [filterData, searchData])

    useEffect(() => {
        getTypes().then((data) => {
            setTags(data);
        })
    }, [])

    return (
        <div className='filter card align-self-start bg-glass bg-mid-white' style={{ zIndex: 5 }}>
            <div className='card-body'>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control border-dark bg-deep-white' placeholder='Search by Bike Model' value={searchData} onChange={e => setSearchData(e.target.value)} />
                    <button className='btn btn-dark' type='button' id='button-addon2'>Search</button>
                </div>
                <div>
                    <div>Filter By</div>
                    <div className='contianer scroll d-flex flex-column' style={{ maxHeight: '50vh' }}>
                        {
                            Object.keys(tags).map((tag: string, index: number) => (
                                <div key={index}>
                                    <div className='dropdown me-3 p-2'>
                                        <div className='fw-bold fs-6 ms-1'>
                                            {tag}:
                                        </div>
                                        <div className='pb-2'>
                                            {
                                                tags[tag as keyof FilterData].map((value: string | number, index: number) => (
                                                    <span key={index} className="form-check m-1 cursor-pointer" style={{ display: 'inline-block' }}>
                                                        <label className="form-check-label">
                                                            {value}
                                                            <input type="checkbox" className='form-check-input border-2 border-dark bg-dark rounded-pill p-2 cursor-pointer' onChange={() => {
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
                                                    </span>
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