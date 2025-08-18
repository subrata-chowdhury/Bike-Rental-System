function Plus({ size = 25 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none">
            <path d="M5.5 12H19.5" stroke={'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 5V19" stroke={'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default Plus