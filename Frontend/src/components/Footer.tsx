import React from 'react'
import './styles/Footer.css'

const Footer: React.FC = (): JSX.Element => {
    return (
        <div className='footer mt-auto bg-glass bg-deep-white'>
            <div className='container py-5'>
                <div className='row'>
                    <div className='col-12 col-md-4'>
                        <h5>Address</h5>
                        <p>123, ABC Street, XYZ City, Country</p>
                    </div>
                    <div className='col-12 col-md-4 mt-3 mt-md-0'>
                        <h5>Contact</h5>
                        <p>Phone: 1234567890</p>
                        <p>Email: subratachowdhury7000@gmail.com</p>
                    </div>
                    <div className='col-12 col-md-4 mt-3 mt-md-0'>
                        <h5>Follow Us</h5>
                        <a href='#'>
                            <img width={30} height={30} className='me-2' src='linkedin.svg' />
                        </a>
                        <a href='#'>
                            <img width={30} height={30} className='me-2' src='github.svg' />
                        </a>
                        <a href='#'>
                            <img width={30} height={30} src='at.svg' />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer