import React from 'react'
import './styles/Footer.css'

const Footer: React.FC = (): JSX.Element => {
    return (
        <div className='footer mt-4 bg-glass bg-deep-white'>
            <div className='container py-5'>
                <div className='row'>
                    <div className='col-12 col-md-4'>
                        <h5>Address</h5>
                        <p>123, ABC Street, XYZ City, Country</p>
                    </div>
                    <div className='col-12 col-md-4'>
                        <h5>Contact</h5>
                        <p>Phone: 1234567890</p>
                        <p>Email: subratachowdhury7000@gmail.com</p>
                    </div>
                    <div className='col-12 col-md-4'>
                        <h5>Follow Us</h5>
                        <p>Facebook</p>
                        <p>Instagram</p>
                        <p>Twitter</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer