import isExternal from 'is-url-external';
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/app-list.css';
import Scrollbars from 'react-custom-scrollbars';
import { Typography } from '@material-ui/core';
import { appCategories } from '../util/staticData';

const AppList = () => {
    return (
        <div className='app-list-container'>
            {
                appCategories.map((eachApp, i) => {

                    return (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {eachApp.type}
                            </Typography>

                            <Scrollbars style={{
                                width: '100%',
                                height: '140px',
                                background: ' #3a638238',
                                borderRadius: '10px',
                                marginBottom: '10px'
                            }}
                                renderThumbHorizontal={({ style, ...props }) =>
                                    <div {...props} style={{
                                        ...style, backgroundColor: 'white', width: '4px', borderRadius: '10px', opacity: '0.5'
                                    }} />
                                }
                                autoHide
                                autoHideTimeout={1000}
                                autoHideDuration={200}
                            >
                                <div className='app-list-panel' align="left">
                                    {
                                        eachApp.appList.map(appObj => {
                                            return (
                                                isExternal(appObj.url) ?
                                                    <a href={appObj.url} target="_target" rel="noopener noreferrer">
                                                        <AppName name={appObj.appName} />
                                                    </a>
                                                    :
                                                    <Link to={`/apps/${appObj.url}`}>
                                                        <AppName name={appObj.appName} />
                                                    </Link>
                                            )
                                        })
                                    }
                                </div>
                            </Scrollbars>
                        </>
                    )
                })
            }
        </div>

    )
}

const AppName = ({name}) => {

    return (
        <Typography variant="subtitle1" className={`app-${name}`}>
            {name}
        </Typography>
    )
}

export default AppList
