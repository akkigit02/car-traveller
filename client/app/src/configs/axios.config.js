import Axios from "axios";
// const { SERVER_BASE_URL } = process.env
const SERVER_BASE_URL = 'http://127.0.0.1:5000'
Axios.defaults.baseURL = SERVER_BASE_URL;
Axios.defaults.headers.post['Content-Type'] = 'application/json';

Axios.interceptors.request.use(async (request) => {
    // const token = await getToken()
    // if (token)
    //     request.headers.common['token'] = token
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
