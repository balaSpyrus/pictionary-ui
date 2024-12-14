import React from 'react';
import { useLocation } from 'react-router';
import '../../css/pageNotFound.css'

const PageNotFound = () => {
    let location = useLocation();

    return (
        <div className="page-not-found">
            <h1>
                404
            </h1>
            <h4>Page Not Found</h4>
            <h6>
                can't Redirect to <code>{location.pathname}</code>
            </h6>
        </div>
    );
}

export default PageNotFound;