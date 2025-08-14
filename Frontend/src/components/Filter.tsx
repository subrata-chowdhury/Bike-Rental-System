import React, { useEffect, useState } from "react";
import { getTypes } from "../scripts/API Calls/bikeApiCalls";
import { FilterData } from "../Types";

interface FilterProp {
    onChange: (page: number, filterData?: FilterData, searchData?: string) => Promise<void>;
}

const Filter: React.FC<FilterProp> = ({ onChange }): React.JSX.Element => {
    const [searchData, setSearchData] = useState<string>('');
    const [filterData, setFilterData] = useState<FilterData>({
        brand: [],
        cc: [],
        type: [],
        horsePower: []
    });
    const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
    const [tags, setTags] = useState<FilterData>({
        brand: ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'],
        cc: [100, 150, 200, 250],
        type: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
        horsePower: [100, 150, 200, 250]
    })

    const [searchValues, setSearchValues] = useState<{
        brand: string | null,
        cc: string | null,
        type: string | null,
        horsePower: string | null,
    }>({
        brand: null,
        cc: null,
        type: null,
        horsePower: null,
    });

    useEffect(() => {
        onChange(1, filterData, searchData);
    }, [filterData, searchData])

    useEffect(() => {
        getTypes().then((data) => {
            setTags(data);
        })
    }, [])

    return (
        <div className='filter card px-2 mx-auto align-self-start' style={{ zIndex: 5 }}>
            <div className='card-body'>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control border-dark bg-deep-white' placeholder='Search by Bike Model' value={searchData} onChange={e => setSearchData(e.target.value)} style={{ fontSize: '14px' }} />
                    <button className='btn btn-dark' type='button' id='button-addon2'>Search</button>
                </div>
                <div style={{ fontWeight: 600 }}>
                    <div>Filter By</div>
                    <div className='contianer scroll d-flex flex-column' style={{ maxHeight: '70vh' }}>
                        <div>Brand:</div>
                        <div className="border rounded mt-1 px-2 py-1 position-relative">
                            {filterData.brand.map((brand: string, index: number) => (
                                <span key={index} className="badge bg-dark m-1 d-inline-block align-items-center">
                                    {brand}
                                    <span
                                        className="btn-close btn-close-white ms-2 cursor-pointer"
                                        onClick={() => {
                                            setFilterData({
                                                ...filterData,
                                                brand: filterData.brand.filter(b => b !== brand)
                                            });
                                        }}
                                    ></span>
                                </span>
                            ))}
                            <input type="text" className="border-0 outline-0" style={{ fontSize: '0.9rem', outline: 0 }} placeholder="Search by Brand" value={searchValues.brand || ''} onChange={e => setSearchValues({ ...searchValues, brand: e.target.value })} onClick={() => setSearchValues({ ...searchValues, brand: '' })}></input>
                            {searchValues.brand !== null && <div className="position-absolute end-0 mt-2 w-100 bg-white border rounded" style={{ maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
                                {tags.brand.filter((brand: string) => brand.toLowerCase().includes(searchValues?.brand?.toLowerCase() || '')).map((brand: string, index: number) => {
                                    return <div key={index} className="w-100 p-2 cursor-pointer" onClick={() => {
                                        setSearchValues({ ...searchValues, brand: null });
                                        setFilterData({
                                            ...filterData,
                                            brand: filterData.brand.includes(brand) ? filterData.brand.filter(b => b !== brand) : [...filterData.brand, brand]
                                        });
                                    }}>{brand}</div>
                                })}
                            </div>}
                        </div>
                        <div className="mt-1">Type:</div>
                        <div className="border rounded mt-1 px-2 py-1 position-relative">
                            {filterData.type.map((type: string, index: number) => (
                                <span key={index} className="badge bg-dark m-1 d-inline-block align-items-center">
                                    {type}
                                    <span
                                        className="btn-close btn-close-white ms-2 cursor-pointer"
                                        onClick={() => {
                                            setFilterData({
                                                ...filterData,
                                                type: filterData.type.filter(t => t !== type)
                                            });
                                        }}
                                    ></span>
                                </span>
                            ))}
                            <input type="text" className="border-0 outline-0" style={{ fontSize: '0.9rem', outline: 0 }} placeholder="Search by Type" value={searchValues.type || ''} onChange={e => setSearchValues({ ...searchValues, type: e.target.value })} onClick={() => setSearchValues({ ...searchValues, type: '' })}></input>
                            {searchValues.type !== null && <div className="position-absolute bottom-0 end-0 mb-4 w-100 bg-white border rounded" style={{ maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
                                {tags.type.filter((type: string) => type.toLowerCase().includes(searchValues.type?.toLowerCase() || '')).map((type: string, index: number) => {
                                    return <div key={index} className="w-100 p-2 cursor-pointer" onClick={() => {
                                        setSearchValues({ ...searchValues, type: null });
                                        setFilterData({
                                            ...filterData,
                                            type: filterData.type.includes(type) ? filterData.type.filter(t => t !== type) : [...filterData.type, type]
                                        });
                                    }}>{type}</div>
                                })}
                            </div>}
                        </div>
                        <div className="mt-3">
                            <input type="checkbox" className="form-check-input outline-0 border-black" id="availableOnly" style={{ outline: 'none' }} onChange={(e) => {
                                if (e.target.checked) {
                                    setFilterData({ ...filterData, isAvailable: true });
                                } else {
                                    const newSearchValues = { ...filterData };
                                    delete newSearchValues.isAvailable;
                                    setFilterData(newSearchValues);
                                }
                                onChange(1, { ...filterData, isAvailable: e.target.checked ? true : undefined }, searchData);
                            }} />
                            <label className="form-check-label ms-2" htmlFor="availableOnly">Available Only</label>
                        </div>
                        <div className="mt-2">Max Price / Hour ({filterData.maxPricePerHour || tags.maxPricePerHour}₹):</div>
                        <input type="range" className="border-0 outline-0 mt-1 my-2" min={tags.minPricePerHour} max={tags.maxPricePerHour} style={{ fontSize: '0.9rem', outline: 0, height: '5px' }} placeholder="Search by Max Price" value={filterData.maxPricePerHour || tags.maxPricePerHour} onChange={e => setFilterData({ ...filterData, maxPricePerHour: Number(e.target.value) })}></input>

                        <div className="text-primary mt-1 d-flex align-items-center cursor-pointer" onClick={() => setShowMoreFilters(!showMoreFilters)}>
                            View {showMoreFilters ? "fewer" : "more"} filters
                            <span className={`ms-1`} style={{ transition: 'transform 0.3s', transform: showMoreFilters ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </div>
                        {showMoreFilters && <>
                            <div className="mt-1">CC:</div>
                            <div className="border rounded mt-1 px-2 py-1 position-relative">
                                {filterData.cc.map((cc: number, index: number) => (
                                    <span key={index} className="badge bg-dark m-1 d-inline-block align-items-center">
                                        {cc}
                                        <span
                                            className="btn-close btn-close-white ms-2 cursor-pointer"
                                            onClick={() => {
                                                setFilterData({
                                                    ...filterData,
                                                    cc: filterData.cc.filter(c => c !== cc)
                                                });
                                            }}
                                        ></span>
                                    </span>
                                ))}
                                <input type="number" className="border-0 outline-0" style={{ fontSize: '0.9rem', outline: 0 }} placeholder="Search by CC" value={searchValues.cc || ''} onChange={e => setSearchValues({ ...searchValues, cc: (e.target.value) })} onClick={() => setSearchValues({ ...searchValues, cc: '' })}></input>
                                {searchValues.cc !== null && <div className="position-absolute bottom-0 end-0 mb-4 w-100 bg-white border rounded" style={{ maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
                                    {tags.cc.filter((cc: number) => cc.toString().includes(searchValues.cc || '')).map((cc: number, index: number) => {
                                        return <div key={index} className="w-100 p-2 cursor-pointer" onClick={() => {
                                            setSearchValues({ ...searchValues, cc: null });
                                            setFilterData({
                                                ...filterData,
                                                cc: filterData.cc.includes(cc) ? filterData.cc.filter(c => c !== cc) : [...filterData.cc, cc]
                                            });
                                        }}>{cc}</div>
                                    })}
                                </div>}
                            </div>
                            <div className="mt-1">Horse Power:</div>
                            <div className="border rounded mt-1 px-2 py-1 position-relative">
                                {filterData.horsePower.map((horsePower: number, index: number) => (
                                    <span key={index} className="badge bg-dark m-1 d-inline-block align-items-center">
                                        {horsePower}
                                        <span
                                            className="btn-close btn-close-white ms-2 cursor-pointer"
                                            onClick={() => {
                                                setFilterData({
                                                    ...filterData,
                                                    horsePower: filterData.horsePower.filter(hp => hp !== horsePower)
                                                });
                                            }}
                                        ></span>
                                    </span>
                                ))}
                                <input type="text" className="border-0 outline-0" style={{ fontSize: '0.9rem', outline: 0 }} placeholder="Search by Horse Power" value={searchValues.horsePower || ''} onChange={e => setSearchValues({ ...searchValues, horsePower: (e.target.value) })} onClick={() => setSearchValues({ ...searchValues, horsePower: '' })}></input>
                                {searchValues.horsePower !== null && <div className="position-absolute bottom-0 end-0 mb-4 w-100 bg-white border rounded" style={{ maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
                                    {tags.horsePower.filter((hp: number) => hp.toString().includes(searchValues.horsePower || '')).map((hp: number, index: number) => {
                                        return <div key={index} className="w-100 p-2 cursor-pointer" onClick={() => {
                                            setSearchValues({ ...searchValues, horsePower: null });
                                            setFilterData({
                                                ...filterData,
                                                horsePower: filterData.horsePower.includes(hp) ? filterData.horsePower.filter(hpValue => hpValue !== hp) : [...filterData.horsePower, hp]
                                            });
                                        }}>{hp}</div>
                                    })}
                                </div>}
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter