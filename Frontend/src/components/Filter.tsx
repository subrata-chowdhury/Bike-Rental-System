import React from "react";

interface Tags {
    brand: string[];
    cc: number[];
    type: string[];
    horsePower: number[];
}

const Filter: React.FC = (): JSX.Element => {

    const tags: Tags = {
        brand: ['Brand1', 'Brand2', 'Brand3', 'Brand4'],
        cc: [100, 150, 200, 250],
        type: ['Type1', 'Type2', 'Type3', 'Type4'],
        horsePower: [100, 150, 200, 250]
    }
    return (
        <div className='filter card align-self-start bg-glass bg-mid-white'>
            <div className='card-body'>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Search by Bike Model' />
                    <button className='btn btn-secondary' type='button' id='button-addon2'>Search</button>
                </div>
                <div>
                    <div className=''>Filter By</div>
                    <div className='contianer'>
                        {
                            Object.keys(tags).map((tag: string, index: number) => (
                                <div style={{ display: 'inline-block' }} key={index}>
                                    <div className='dropdown ms-1'>
                                        <button className='btn btn-secondary dropdown-toggle my-1' type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                            {tag}
                                        </button>
                                        <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                            {
                                                tags[tag as keyof Tags].map((value: string | number, index: number) => (
                                                    <li key={index}><a className='dropdown-item' href='#'>{value}</a></li>
                                                ))
                                            }
                                        </ul>
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