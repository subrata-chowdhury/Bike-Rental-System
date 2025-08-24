import React from 'react'
import '../styles/Footer.css'
import githubIcon from '../assets/github.svg'
import linkedinIcon from '../assets/linkedin.svg'
import atIcon from '../assets/at.svg'

const Footer: React.FC = (): React.JSX.Element => {
    return (
        <div id='footer' className='footer mt-auto bg-white' style={{ borderTop: '1px solid rgba(0,0,0,0.175)' }}>
            <div className='container py-5 px-5 px-mid-auto'>
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
                            <img width={30} height={30} className='me-2' src={linkedinIcon} />
                        </a>
                        <a href='#'>
                            <img width={30} height={30} className='me-2' src={githubIcon} />
                        </a>
                        <a href='#'>
                            <img width={30} height={30} src={atIcon} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer