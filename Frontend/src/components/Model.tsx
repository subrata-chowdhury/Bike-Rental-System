import React from 'react';

interface Props {
    heading?: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Model: React.FC<Props> = ({ heading = "MODEL", onClose, children }) => {
    return (
        <div className='modal show' style={{ display: 'block', background: 'rgba(0,0,0,0.1)' }} onClick={onClose} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-glass bg-deep-white rounded rounded-2" onClick={e => e.stopPropagation()}>
                    <div className="modal-header border-2 mx-3">
                        <h5 className="modal-title" id="exampleModalLabel">{heading}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Model;