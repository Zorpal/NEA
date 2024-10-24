import { useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../api'; 
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; 

//function to render a component in my html to ensure that only people who are authenticated can view that site, else they are redirected
function Authorisedroute({children}) {
    const [authorised, setAuthorised] = useState(null);

    const refreshtoken = useCallback(async () => {
        const refreshtoken = localStorage.getItem(REFRESH_TOKEN);
        try {
            //res is short for response
            const res = await api.post('/applicant/token/refresh/', {refresh: refreshtoken});
            if (res.status === 200) {
                //sets access const to the access token in the response data
                const {access} = res.data;
                localStorage.setItem(ACCESS_TOKEN, access);
                setAuthorised(true);
            } else {
                setAuthorised(false);
            }
        } catch {
            //a try except block to catch errors that may happen so that the whole component does not fail
            setAuthorised(false);
            console.log("Error refreshing token");
        }
    }, []);

    //auth function to check if an access token is in local storage
    const auth = useCallback(async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setAuthorised(false);
            return;
        }
        const jwtdecode = jwtDecode(token);
        const expiryoftoken = jwtdecode.exp;
        const now = Date.now() / 1000;
        //if the access token has expired, then it waits for the refresh token to generate a new access token
        if (expiryoftoken < now) {
            await refreshtoken();
        } else {
            setAuthorised(true);
        }
    }, [refreshtoken]);

    useEffect(() => {
        auth().catch(() => setAuthorised(false));
    }, [auth]);

    if (authorised === null) {
        return <div>Loading...</div>;
    }

    return authorised ? children : <div>Not authorised</div>;
}

export default Authorisedroute;