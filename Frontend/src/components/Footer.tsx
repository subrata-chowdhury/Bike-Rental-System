import React from 'react'
import '../styles/Footer.css'
import githubIcon from '../assets/github.svg'
import linkedinIcon from '../assets/linkedin.svg'
import atIcon from '../assets/at.svg'
import { Link } from 'react-router-dom'

const Footer: React.FC = (): React.JSX.Element => {
    return (
        <footer className="bg-white px-5 py-6 pt-5" role="contentinfo">
            <div className="mx-auto px-7">
                <div className="d-flex">
                    <div className='col-12 col-md-6 mr-4'>
                        <h5 className="mb-1">Bike Rental System</h5>
                        <p>A trusted bike renting platform offering seamless bike rentals from accredited providers of your choice, with certified secure payment options.</p>
                        <h5 className='mt-1'>Contact Us</h5>
                        <div className='text-sm text-gray-600d font-medium mt-1'>
                            <p className='mb-0'><span>Phone:</span> +91 XXXXX XXXXX</p>
                            <p className='mb-0'><span>Email:</span> subratachowdhury7000@gmail.com</p>
                            <p className='mb-0'><span>Address:</span> Xxxxx, Xxxxx, <br />Pin. XXXXXX - Xxxx Xxxx</p>
                        </div>
                        <div className='d-flex gap-3 mt-4'>
                            <Link to='#' aria-label="Facebook">
                                <img src={linkedinIcon} width={25} height={25} />
                            </Link>
                            <Link to='https://github.com/subrata-chowdhury' aria-label="Github">
                                <img src={githubIcon} width={25} height={25} />
                            </Link>
                            <Link to='#' aria-label="Email">
                                <img src={atIcon} width={25} height={25} />
                            </Link>
                        </div>
                    </div>
                    {/* <div className='inline-flex flex-col'>
                        <h6 className="text-base font-semibold mb-2">Follow Us</h6>
                        <ul className='flex flex-col gap-1'>
                            {[{ label: 'Facebook', href: "#" },
                            { label: 'Instagram', href: "#" },
                            { label: 'LinkedIn', href: "#" },
                            { label: 'YouTube', href: "#" }].map((link, index) => (
                                <li key={index} className="mb-1 text-sm">
                                    <a href={link.href} className="text-decoration-none text-dark">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </div>

                <div className="d-flex mt-3 pt-3 justify-content-between" style={{ borderTop: '1px solid gray' }}>
                    <p><a href="#" className="text-decoration-none">Privacy Policy</a> | <a href="#" className="text-decoration-none">Terms of Service</a></p>
                    <p>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer