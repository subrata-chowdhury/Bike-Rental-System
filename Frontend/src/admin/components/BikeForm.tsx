import { useEffect, useState } from "react";
import { createBike, deleteBike, getTypes, updateBike } from "../../scripts/API Calls/bikeApiCalls.ts";
import { Bike, FilterData } from "../../Types.ts";
import { AdminPanel } from "./AdminPanel.tsx";
import ImageInput from "./ImageInput.tsx";
import { useNavigate } from "react-router-dom";

const BikeForm = ({ bikeDetails, onChange }: { bikeDetails: Bike, onChange: (updatedBike: Bike) => void }) => {
    const [filterData, setFilterData] = useState<FilterData>({
        brand: [],
        cc: [],
        type: [],
        horsePower: []
    });
    const [showSuggestions, setShowSuggestions] = useState<{
        type: boolean;
        brand: boolean;
    }>({
        type: false,
        brand: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        getTypes().then((data) => {
            setFilterData(data);
        })
    }, [])

    function addBike(bikeData: Bike) {
        const formData = new FormData();

        // Append JSON data
        formData.append('bikeModel', bikeData.bikeModel || '');
        formData.append('pricePerHour', bikeData.pricePerHour?.toString() || '');
        formData.append('isAvailable', bikeData.isAvailable ? 'true' : 'false');
        formData.append('brand', bikeData.brand || '');
        formData.append('cc', bikeData.cc?.toString() || '');
        formData.append('horsePower', bikeData.horsePower?.toString() || '');
        formData.append('type', bikeData.type || '');
        createBike(formData).then(() => {
            alert("Bike Added Successfully");
        })
    }

    function updateBikeData(bikeData: Bike, _id: string) {
        const formData = new FormData();

        // Append JSON data
        formData.append('bikeModel', bikeData.bikeModel || '');
        formData.append('pricePerHour', bikeData.pricePerHour?.toString() || '');
        formData.append('isAvailable', bikeData.isAvailable ? 'true' : 'false');
        formData.append('brand', bikeData.brand || '');
        formData.append('cc', bikeData.cc?.toString() || '');
        formData.append('horsePower', bikeData.horsePower?.toString() || '');
        formData.append('type', bikeData.type || '');
        if (_id)
            updateBike(_id, formData).then(() => {
                alert("Bike updated Successfully");
            })
    }

    return (
        <div className="d-flex h-100">
            <AdminPanel />
            <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: '100vh', padding: '2rem' }}>
                <div className="bg-white p-5 rounded-1 shadow-sm">
                    <h4 className="mb-4">Bike Form</h4>
                    <form className="needs-validation d-flex flex-column" noValidate style={{ fontWeight: '500' }}>
                        <div className="mb-3">
                            <label htmlFor="bikeModel" className="form-label mb-1">Bike Model</label>
                            <input type="text" value={bikeDetails.bikeModel} onChange={(e) => onChange({ ...bikeDetails, bikeModel: e.target.value })} className="form-control" id="bikeModel" required />
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                            <div className="mb-3 flex-grow-1">
                                <label htmlFor="bikeType" className="form-label mb-1">Bike Type</label>
                                <div className="form-control position-relative">
                                    <input type="text" className="border-0 outline-0" style={{ fontSize: '0.9rem', outline: 0 }} placeholder="Enter Type" value={bikeDetails.type || ''} onChange={e => onChange({ ...bikeDetails, type: e.target.value })} onClick={() => setShowSuggestions({ ...showSuggestions, type: true })}></input>
                                    {showSuggestions.type && <div className="position-absolute end-0 mt-2 w-100 bg-white border rounded" style={{ maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
                                        {filterData.type.filter((type: string) => type.toLowerCase().includes(bikeDetails.type?.toLowerCase() || '')).map((type: string, index: number) => {
                                            return <div key={index} className="w-100 p-2 cursor-pointer" onClick={() => {
                                                setShowSuggestions({ ...showSuggestions, type: false });
                                                onChange({ ...bikeDetails, type: type });
                                            }}>{type}</div>
                                        })}
                                    </div>}
                                </div>
                            </div>
                            <div className="mb-3 flex-grow-1">
                                <label htmlFor="bikeBrand" className="form-label mb-1">Brand</label>
                                <div className="form-control position-relative">
                                    <input type="text" className="border-0 outline-0" style={{ fontSize: '0.9rem', outline: 0 }} placeholder="Enter Brand" value={bikeDetails.brand || ''} onChange={e => onChange({ ...bikeDetails, brand: e.target.value })} onClick={() => setShowSuggestions({ ...showSuggestions, brand: true })}></input>
                                    {showSuggestions.brand && <div className="position-absolute end-0 mt-2 w-100 bg-white border rounded" style={{ maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
                                        {filterData.brand.filter((brand: string) => brand.toLowerCase().includes(bikeDetails?.brand?.toLowerCase() || '')).map((brand: string, index: number) => {
                                            return <div key={index} className="w-100 p-2 cursor-pointer" onClick={() => {
                                                setShowSuggestions({ ...showSuggestions, brand: false });
                                                onChange({ ...bikeDetails, brand: brand });
                                            }}>{brand}</div>
                                        })}
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 flex-grow-1">
                            <label htmlFor="bikePrice" className="form-label mb-1">Price (₹/hour)</label>
                            <input type="number" value={bikeDetails.pricePerHour} onChange={(e) => onChange({ ...bikeDetails, pricePerHour: Number(e.target.value) })} className="form-control" id="bikePrice" required />
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                            <div className="mb-3 flex-grow-1">
                                <label htmlFor="bikeCC" className="form-label mb-1">CC</label>
                                <input type="number" value={bikeDetails.cc} onChange={(e) => onChange({ ...bikeDetails, cc: Number(e.target.value) })} className="form-control" id="bikeCC" required />
                            </div>
                            <div className="mb-3 flex-grow-1">
                                <label htmlFor="bikeHorsePower" className="form-label mb-1">Horse Power</label>
                                <input type="number" value={bikeDetails.horsePower} onChange={(e) => onChange({ ...bikeDetails, horsePower: Number(e.target.value) })} className="form-control" id="bikeHorsePower" required />
                            </div>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" checked={bikeDetails.isAvailable} onChange={(e) => onChange({ ...bikeDetails, isAvailable: e.target.checked })} className="form-check-input" id="bikeAvailability" />
                            <label className="form-check-label" htmlFor="bikeAvailability">Available</label>
                        </div>
                        <label htmlFor="bikeHorsePower" className="form-label mb-1">Horse Power</label>
                        <ImageInput values={bikeDetails.images} onChange={(images) => onChange({ ...bikeDetails, images })} />
                        <div className="mt-3 d-flex gap-2">
                            {bikeDetails?._id && <button type="button" className="me-auto btn btn-primary" onClick={() => navigate('/bike/' + bikeDetails._id)}>View Bike</button>}
                            {bikeDetails?._id && <button type="button" className="ms-auto btn btn-danger" onClick={() => deleteBike(bikeDetails._id || '')}>Delete</button>}
                            <button type="submit" className="btn btn-dark" onClick={bikeDetails._id ? () => updateBikeData(bikeDetails, bikeDetails._id || '') : () => addBike(bikeDetails)}>{bikeDetails._id ? 'Update Bike' : 'Add Bike'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BikeForm;