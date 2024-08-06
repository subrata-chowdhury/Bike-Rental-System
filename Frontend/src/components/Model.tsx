import React from 'react';

interface Props {
    heading?: string;
    id: string;
    children: React.ReactNode;
}

const Model: React.FC<Props> = ({ heading = "MODEL", id, children }) => {
    return (
        <div className='modal' aria-labelledby="exampleModalLabel" aria-hidden="true" id={id}>
            <div className="modal-dialog">
                <div className="modal-content bg-glass bg-deep-white rounded rounded-2">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title" id="exampleModalLabel">{heading}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Model;