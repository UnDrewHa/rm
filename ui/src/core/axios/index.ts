import Axios from 'axios';
import {handleUnauthorized} from 'src/core/axios/handlers';

const axios = Axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 60000,
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const {status} = error.response;

        if (status === 401) handleUnauthorized(error);

        return Promise.reject(error);
    },
);

export {axios};
