import Axios from 'axios';
import {handleNetworkError, handleUnauthorized} from 'src/core/axios/handlers';

const axios = Axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 60000,
    withCredentials: true, //TODO: узнать что и зачем.
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const {status} = error?.response || {};

        if (error.message === 'Network Error') return handleNetworkError(error);
        if (status === 401) return handleUnauthorized(error);

        return Promise.reject(error);
    },
);

export {axios};
