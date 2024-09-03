import Axios from "axios";
import { getTokenFromLocal } from "../services/Authentication.service";

const { REACT_APP_SERVER_BASE_URL } = process.env
Axios.defaults.baseURL = REACT_APP_SERVER_BASE_URL;
Axios.defaults.headers.post['Content-Type'] = 'application/json';

Axios.interceptors.request.use(async (request) => {
    const token = await getTokenFromLocal()
    if (token)
        request.headers['token'] = token
    return request;
}, error => {
    // console.log(error);
    return Promise.reject(error);
});

Axios.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error);
});
