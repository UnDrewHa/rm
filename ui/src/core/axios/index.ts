import Axios from 'axios';
import {handleNetworkError, handleUnauthorized} from 'src/Core/axios/handlers';

const axios = Axios.create({
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
