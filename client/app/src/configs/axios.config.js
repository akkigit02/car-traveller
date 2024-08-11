import Axios from "axios";
console.log(333333,222)
const { REACT_APP_SERVER_BASE_URL } = process.env
console.log(333333,REACT_APP_SERVER_BASE_URL)
Axios.defaults.baseURL = REACT_APP_SERVER_BASE_URL;
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
