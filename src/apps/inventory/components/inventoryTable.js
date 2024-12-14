import { Grid, makeStyles } from '@material-ui/core';
import matchSorter from 'match-sorter';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import ReactTooltip from "react-tooltip";
import { Loader } from '../../../components';
import '../css/table.css';
import { deleteRecord } from '../util/endpoints';
import { dummyData, getName, wrapWithEmpty } from '../util/util';
import AddRecordModal from './addRecordModal';
import { DefaultColumnFilter, GlobalFilter } from './tableFilters';
import Pagination from './tablePagination';

// FOR DEV PURPOSE
// [
//     {
//       'repeat(20, 10)': {
//       "name": '{{lorem(1, "words")}}',
//       "category": {
//           "id":'{{random(1, 2)}}'
//       },
//       "priority": '{{integer(1, 5)}}',
//       "isHealthy": {
//           "id": '{{random(0, 1, 2)}}'
//       },
//       "quantityUnit": '{{random("KG", "PKT")}}',
//       "expiryDays": '{{integer(100, 999)}}',
//       "consumptionRatePerDay":'{{integer(100, 999)}}',
//       "availableQuantity": '{{integer(100, 999)}}',
//       "mfgDate": '{{moment(this.date(new Date()))}}',
//       "boughtOn": '{{moment(this.date(new Date()))}}'
//   }
//     }
//   ]

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const InventoryTable = ({ dataList, refresh, metaData }) => {

    const classes = useStyles();
    const [tableData, setTableData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false)

    // FOR DEV PURPOSE

    // useEffect(() => {

    //     data.forEach((each, i) => {

    //         each.mfgDate = new Date(each.mfgDate);
    //         each.boughtOn = new Date(each.boughtOn);

    //         saveRecord(each).then(res => console.log(`record #${i + 1} inserted successfully...`));
    //     })

    // }, [])

    useEffect(() => {

        if (dataList.length) {

            setTableData(dataList);
        }

    }, [dataList])

    const generateColumns = keys => {
        let columns = keys.map(key => {

            if (!['id', 'boughtOn', 'mfgDate', 'quantityUnit'].includes(key)) {

                let columnData = {
                    Header: getName(key),
                    accessor: key,
                    filter: 'fuzzyText',
                    Cell: ({ value }) => wrapWithEmpty(value)
                }

                if (['category', 'isHealthy'].includes(key)) {

                    columnData = {
                        ...columnData,
                        Cell: ({ value }) => wrapWithEmpty(value.name)
                    }
                }

                if (key === 'name') {
                    columnData = {
                        ...columnData,
                        Cell: renderNameCell
                    }
                }
                return columnData
            }
            return null
        }).filter(data => data)

        columns.push({
            Header: "Actions",
            accessor: 'id',
            Cell: ({ value }) => renderActions(value)
        })

        return columns;
    };

    const renderActions = (id) => {

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span onClick={() => removeRecord(id)} style={{ flex: 1, cursor: 'pointer' }}><i class="fa fa-trash-o" aria-hidden="true" /></span>
                <span onClick={() => editRecordData(id)} style={{ flex: 1, cursor: 'pointer' }}><i class="fa fa-pencil-square-o" aria-hidden="true" /></span>
            </div>
        )
    }

    const removeRecord = id => {
        setLoadingMsg(`Removing the record with id ${id}`)
        deleteRecord(id)
            .then(res => {
                setLoadingMsg('')
                refresh()
            })
    }

    const editRecordData = id => {
        let record = JSON.parse(JSON.stringify(tableData.filter(data => data.id === id)[0]));

        delete record.category.name
        delete record.isHealthy.name
        delete record.availableTillDays
        delete record.availableTillDate

        // setIsOpen(true);
    }

    const renderNameCell = ({ value }) => {

        let data = tableData.filter(data => data['name'] === value)[0];
        let dataID = `${value}-tooltip`;

        return (<span>
            <div data-tip data-for={dataID} >{`${value} ( ${data.quantityUnit} )`}</div>
            <ReactTooltip id={dataID} place="right" type="dark" effect="solid">
                <div>{wrapWithEmpty(`manufacture on : ${new Date(data.mfgDate).toDateString()}`)}</div>
                <div>{wrapWithEmpty(`bought on : ${new Date(data.boughtOn).toDateString()}`)}</div>
            </ReactTooltip>
        </span>)
    }

    const Table = ({ data }) => {

        let columns = React.useMemo(() => generateColumns(Object.keys(dummyData)), []);

        const defaultColumn = React.useMemo(
            () => ({
                // Let's set up our default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        )

        const fuzzyTextFilterFn = (rows, id, filterValue) => matchSorter(rows, filterValue, { keys: [row => row.values[id]] })

        // Let the table remove the filter if the string is empty
        fuzzyTextFilterFn.autoRemove = val => !val

        const filterTypes = React.useMemo(
            () => ({
                // Add a new fuzzyTextFilterFn filter type.
                fuzzyText: fuzzyTextFilterFn,
                // Or, override the default text filter to use
                // "startWith"
                text: (rows, id, filterValue) => {
                    return rows.filter(row => {
                        const rowValue = row.values[id]
                        return rowValue !== undefined
                            ? String(rowValue)
                                .toLowerCase()
                                .startsWith(String(filterValue).toLowerCase())
                            : true
                    })
                },
            }),
            []
        )

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            setGlobalFilter,
            page,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize, ...state },
        } = useTable({
            columns,
            data,
            initialState: { pageIndex: 0 },
            defaultColumn,
            filterTypes
        }, useGlobalFilter, useFilters, useSortBy, usePagination)

        return (
            <div className={classes.root}>
                <Grid container>
                    <Grid container item xs={12}>
                        <Grid item xs={12} md={12} lg={6}>
                            <GlobalFilter
                                rows={rows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </Grid>
                        <Grid item xs={12}  md={12}  lg={6}>
                            <Pagination
                                canPreviousPage={canPreviousPage}
                                canNextPage={canNextPage}
                                pageOptions={pageOptions}
                                pageCount={pageCount}
                                gotoPage={gotoPage}
                                nextPage={nextPage}
                                previousPage={previousPage}
                                setPageSize={setPageSize}
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div className='button-grp'>
                                <div class='add-record' onClick={openModal}>
                                    <i class="fa fa-plus-circle" aria-hidden="true" />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>

                        <Scrollbars
                            style={{ width: `100%` }}
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            autoHeight
                            autoHeightMin={0}
                            autoHeightMax={380}
                            universal={true}
                        >
                            <table {...getTableProps()} className='inventory-table'>

                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()}>
                                                    <span {...column.getSortByToggleProps()}>
                                                        {column.render('Header')}
                                                        <span>
                                                            {column.isSorted
                                                                ? column.isSortedDesc
                                                                    ? <span class="fa fa-sort-desc"></span>
                                                                    : <span class="fa fa-sort-asc"></span>
                                                                : <span class="fa fa-sort"></span>}
                                                        </span>
                                                    </span>
                                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>

                                    {page.map(row => {
                                        prepareRow(row)
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map(cell => {
                                                    return (
                                                        <td {...cell.getCellProps()}>
                                                            {cell.render('Cell')}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </Scrollbars>
                    </Grid>
                </Grid>
                <AddRecordModal
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    metaData={metaData}
                    onComplete={refresh} />
                {
                    loadingMsg ? (
                        <Loader msg={loadingMsg} />
                    ) : null
                }
            </div>
        );
    }

    return (
        <Table data={tableData} />
    )

}

export default InventoryTable;