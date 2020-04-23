import Axios from 'axios';
import {handleNetworkError, handleUnauthorized} from 'Core/axios/handlers';

const axios = Axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 60000,
    withCredentials: true, //TODO: узнать что и зачем.
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const {status} = error?.response || {};

        if (error.message === 'Network Error') handleNetworkError(error);
        if (status === 401) handleUnauthorized(error);

        return Promise.reject(error);
    },
);

export {axios};
