import Axios from 'axios';
import {handleNetworkError, handleUnauthorized} from 'Core/axios/handlers';

export const BASE_URL = 'http://localhost:5000';

const axios = Axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    withCredentials: true,
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
