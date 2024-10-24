import axios from "axios";
import {ACCESS_TOKEN} from "./constants";

//using axios, I created a function to create an api that is used as a shortcut, so I don't have to define the methods and manually define the access token to be sent each time i make a request to the backend
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); //This allows me to make do crud operations that require authentication, by sending the access token.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; //I made this function here so i dont have to repeat my logic it in the other parts of my program
    }
    return config;
},
(error) => {
    return Promise.reject(error);
});

export default api; //exports api to be used in my program