import React, { useEffect, useState } from 'react'

type PagesProp = {
    onPageChange?: (index: number) => void;
    noOfPages?: number;
}

const Pages: React.FC<PagesProp> = ({ onPageChange, noOfPages = 3 }): JSX.Element => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    let pages: JSX.Element[] = [];
    for (let index = 1; index <= noOfPages; index++) {
        pages.push(
            <Page page={index} key={index} isActive={(currentPage === index ? true : false)} setCurrentPage={setCurrentPage} />
        )
    }
    function pageOnClickHanlder() {
        // console.log(currentPage)
    }
    useEffect(() => {
        pageOnClickHanlder()
        onPageChange && onPageChange(currentPage)
    }, [currentPage])
    return (
        <div className='d-flex justify-content-center mt-3'>
            <div className='rounded-circle bg-white pages mx-1 cursor-pointer' onClick={() => {
                let newPage = currentPage;
                newPage--
                if (newPage > 0)
                    setCurrentPage(newPage)
            }}>{'<'}</div>
            {pages}
            <div className='rounded-circle bg-white pages mx-1 cursor-pointer' onClick={() => {
                let newPage = currentPage;
                newPage++
                if (newPage <= noOfPages)
                    setCurrentPage(newPage)
            }}>{'>'}</div>
        </div>
    )
}

type PageProp = {
    page: number,
    isActive?: boolean,
    setCurrentPage: (val: number) => void,
}

const Page: React.FC<PageProp> = ({ page, isActive = false, setCurrentPage }): JSX.Element => {
    return (
        <div className={'rounded-circle pages mx-1 cursor-pointer' + (isActive ? ' bg-secondary text-light' : ' bg-white text-secondary')} onClick={() => {
            setCurrentPage(page)
        }}>{page}</div>
    )
}

export default Pages