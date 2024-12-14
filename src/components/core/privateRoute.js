import React, { useContext } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import MainView from "../mainView";
import { AuthContext } from "../../auth/Auth";

const PrivateRoute = ({ component:ChildComponent, ...rest }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={routeProps => {

                const { location } = routeProps;

                return !!currentUser ? (
                    <MainView {...routeProps} hasSideBar={location.pathname !== '/apps'} >
                        <ChildComponent/>
                    </MainView>
                ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: location }
                            }}
                        />
                    )
            }} />
    );
};

export default withRouter(PrivateRoute);