/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { firebaseApp } from "./firebase";
import { Loader } from "../components";
import { getCookie, setCookie } from "../util/cookieHandler";
import { setInventoryHeader } from "../apps/inventory";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState('Signing In..');

    const setAuthId = token => {
        setInventoryHeader('auth-id', token);
    }
    useEffect(() => {
        let token = getCookie("token");

        firebaseApp().auth().onAuthStateChanged(async (user) => {

            setCurrentUser(user)

            if (token) {
                setAuthId(token);
            }
            else {
                if (user) {
                    setLoadingMsg("Generating Token...");

                    let token = await user.getIdToken(true);

                    setCookie("token", token, 50); // the token expires in 50 min
                    setAuthId(token);
                }
            }
            setLoadingMsg('')
        });
    }, []);

    if (loadingMsg) {
        return <Loader msg={loadingMsg} />
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};