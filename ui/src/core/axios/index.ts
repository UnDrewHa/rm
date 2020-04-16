import Axios from 'axios';

export const axios = Axios.create({
    baseURL: '',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'},
});
