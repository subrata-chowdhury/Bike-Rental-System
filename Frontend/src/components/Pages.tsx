import React, { useEffect, useState } from 'react';
import arrowIcon from '../assets/arrow-right.svg';

type PagesProp = {
    onPageChange?: (index: number) => void;
    noOfPages?: number;
}

const Pages: React.FC<PagesProp> = ({ onPageChange, noOfPages = 3 }): React.JSX.Element => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    let pages: React.JSX.Element[] = [];
    if (noOfPages < 12)
        for (let index = 1; index <= noOfPages; index++) {
            pages.push(
                <Page page={index} key={index} isActive={(currentPage === index ? true : false)} setCurrentPage={setCurrentPage} />
            )
        }
    else {
        if (currentPage < 5) {
            for (let index = 1; index <= 5; index++) {
                pages.push(
                    <Page page={index} key={index} isActive={(currentPage === index ? true : false)} setCurrentPage={setCurrentPage} />
                )
            }
            pages.push(
                <div className='rounded-circle pages mx-1 cursor-pointer bg-white text-dark'>...</div>
            )
            pages.push(
                <Page page={noOfPages} key={noOfPages} isActive={(currentPage === noOfPages ? true : false)} setCurrentPage={setCurrentPage} />
            )
        }
        else if (currentPage > noOfPages - 4) {
            pages.push(
                <Page page={1} key={1} isActive={(currentPage === 1 ? true : false)} setCurrentPage={setCurrentPage} />
            )
            pages.push(
                <div className='rounded-circle pages mx-1 cursor-pointer bg-white text-dark'>...</div>
            )
            for (let index = noOfPages - 4; index <= noOfPages; index++) {
                pages.push(
                    <Page page={index} key={index} isActive={(currentPage === index ? true : false)} setCurrentPage={setCurrentPage} />
                )
            }
        }
        else {
            pages.push(
                <Page page={1} key={1} isActive={(currentPage === 1 ? true : false)} setCurrentPage={setCurrentPage} />
            )
            pages.push(
                <div className='rounded-circle pages mx-1 cursor-pointer bg-white text-dark'>...</div>
            )
            for (let index = currentPage - 1; index <= currentPage + 1; index++) {
                pages.push(
                    <Page page={index} key={index} isActive={(currentPage === index ? true : false)} setCurrentPage={setCurrentPage} />
                )
            }
            pages.push(
                <div className='rounded-circle pages mx-1 cursor-pointer bg-white text-dark'>...</div>
            )
            pages.push(
                <Page page={noOfPages} key={noOfPages} isActive={(currentPage === noOfPages ? true : false)} setCurrentPage={setCurrentPage} />
            )
        }
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
            }}>
                <img src={arrowIcon} width={20} style={{ transform: 'rotate(-180deg)' }}></img>
            </div>
            {pages}
            <div className='rounded-circle bg-white pages mx-1 cursor-pointer' onClick={() => {
                let newPage = currentPage;
                newPage++
                if (newPage <= noOfPages)
                    setCurrentPage(newPage)
            }}>
                <img src={arrowIcon} width={20}></img>
            </div>
        </div>
    )
}

type PageProp = {
    page: number,
    isActive?: boolean,
    setCurrentPage: (val: number) => void,
}

const Page: React.FC<PageProp> = ({ page, isActive = false, setCurrentPage }): React.JSX.Element => {
    return (
        <div className={'rounded-circle pages mx-1 cursor-pointer' + (isActive ? ' bg-dark text-light' : ' bg-white text-dark')} onClick={() => {
            setCurrentPage(page)
        }}>{page}</div>
    )
}

export default Pages