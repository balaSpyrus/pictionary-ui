import React from 'react';

const PAGES_SET = [10, 20, 30, 40, 50];

const Pagination = (
    {
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        pageIndex,
        pageSize,
    }
) => {

    return (
        // <Grid container>
        //     <Grid item 
        // </Grid>
        <div className="pagination">
            <button className='page-nav-icons' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <i className="fa fa-fast-backward" aria-hidden="true" />
            </button>
            <button className='page-nav-icons' onClick={() => previousPage()} disabled={!canPreviousPage}>
                <i className="fa fa-backward" aria-hidden="true" />
            </button>
            <button className='page-nav-icons' onClick={() => nextPage()} disabled={!canNextPage}>
                <i className="fa fa-forward" aria-hidden="true" />
            </button>
            <button className='page-nav-icons' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                <i className="fa fa-fast-forward" aria-hidden="true" />
            </button>
            <span className='pages'>
                Page
                <strong>
                    {` ${pageIndex + 1} of ${pageOptions.length} `}
                </strong>
            </span>
            <span className='pages'>
                <i> Go to page : </i>
                <input className="form-control page-to" aria-label="..." type="number"
                    defaultValue={pageIndex + 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }} />
            </span>
            <span className='pages'>
                <i> Records Per Page : </i>
                <select
                    className="show-pages form-control"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {PAGES_SET.map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </span>
        </div>)
}

export default Pagination;