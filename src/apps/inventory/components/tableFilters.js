import React from 'react';
import { Grid } from '@material-ui/core';

const GlobalFilter = ({
    rows,
    globalFilter,
    setGlobalFilter,
}) => {

    const onGlobalFilterChange = e => {
        setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely

    }

    return (
        <span class="global-filter-container">
            <Grid container spacing={1}>
                <Grid item xs={11}>
                    <input type="text" class="form-control global-filter-input"
                        value={globalFilter || ''}
                        onChange={onGlobalFilterChange}
                        placeholder="Type to globally filter..." />
                </Grid>
                <Grid item xs={1} style={{display:'flex'}}>
                    <span class="close clear-global-filter" onClick={() => {
                        setGlobalFilter('');
                    }}>×</span>
                </Grid>
                <Grid item xs={12}>
                        <span class="total-records">
                            <span class="total-records-title">Total Record(s) </span>
                            <span class="total-records-value">{rows.length}</span>
                        </span>
                </Grid>
            </Grid>
        </span>
    )
}

const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
}) => {
    const count = preFilteredRows.length

    return (
        <input
            className='column-filter'
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                e.stopPropagation();
                e.preventDefault();
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

export { GlobalFilter, DefaultColumnFilter };