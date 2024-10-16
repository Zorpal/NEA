import {jwtDecode} from 'jwt-decode';
import api from '../api';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Authorisedroute({children}) {
    const [authorised, setAuthorised] = useState(null);
    useEffect(() => {
        auth().catch(() => setAuthorised(false));
    }, []);
    const refreshtoken = async () => {
        const refreshtoken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/user/token/refresh/', {refresh: refreshtoken});
            if (res.status === 200) {
                const {access} = res.data;
                localStorage.setItem(ACCESS_TOKEN, access);
                setAuthorised(true);
            } else {
                setAuthorised(false);
            }
        } catch {
            setAuthorised(false);
            console.log("Error refreshing token");
        }
    }
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setAuthorised(false);
            return;
        }
        const jwtdecode = jwtDecode(token);
        const expiryoftoken = jwtdecode.exp
        const now = Date.now() / 1000;

        if (expiryoftoken < now) {
            await refreshtoken();

        } else {
            setAuthorised(true);
        }

    }
    if (authorised === null) {
        return <div>Loading...</div>
    }
    return authorised ? children : <Navigate to="/login" />;
}

export default Authorisedroute;