import React from "react";
import { Route } from "react-router-dom";
import MainView from "./mainView";

const PrivateRoute = ({ component: ChildComponent, ...rest }) => {

    return (
        <Route
            {...rest}
            render={routeProps => {

                const { location } = routeProps;

                return (
                    <MainView {...routeProps} hasSideBar={location.pathname !== '/apps'} >
                        <ChildComponent />
                    </MainView>
                )
            }} />
    );
};

export default PrivateRoute;