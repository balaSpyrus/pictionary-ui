import React, { useEffect, useState } from 'react';
import { getItemList, getMetaData } from '../util/endpoints';
import InventoryTable from './inventoryTable';
import { Loader, Panel } from '../../../components';
import { Stocks } from '..';

const InventoryApp = ({ selectedMenuItem, sideBarMenu }) => {

    const [initialData, setInitialData] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [loadingMsg, setLoadingMsg] = useState('');

    useEffect(() => {
        setLoadingMsg('Fetching the Meta Data...');
        getMetaData().then(metaData => {
            setMetaData(metaData)
            setLoadingMsg('Fetching the Inventory Data...');
            getData()
        })

        return () => {
            setMetaData({});
            setInitialData([]);
        }

    }, [])

    const getData = () => {
        getItemList().then(data => {
            setInitialData(data)
            setLoadingMsg('');
        })
    }

    const getViewTitle = () => {

        switch (selectedMenuItem) {
            case 'stocks':
                return ''
            case 'table':
                return 'Inventory Items'
            default:
                return selectedMenuItem
        }
    }

    const getMenuView = () => {

        switch (selectedMenuItem) {
            case 'stocks':
                return <Stocks />
            case 'table':
                return <InventoryTable dataList={initialData} refresh={getData} metaData={metaData} />
            default:
                return selectedMenuItem ? <span>UNDER DEVELOPEMNT</span> : <Stocks />
        }
    }

    return (
        <>
            <Panel className="inv-panel" title={getViewTitle()}
                fullHeight={!selectedMenuItem || selectedMenuItem === 'stocks'}>
                {getMenuView()}
            </Panel>
            {
                loadingMsg ? (
                    <Loader msg={loadingMsg} />
                ) : null
            }
        </>
    )
}

export default InventoryApp;