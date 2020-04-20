export const ROUTER = {
    MAIN: {
        FULL_PATH: '/',
        PATH: '/',
    },
    AUTH: {
        FULL_PATH: '/auth',
        PATH: 'auth',
        LOGIN: {
            FULL_PATH: '/auth/login',
            PATH: '/login',
        },
        SIGNUP: {
            FULL_PATH: '/auth/signup',
            PATH: '/signup',
        },
        FORGOT: {
            FULL_PATH: '/auth/forgot',
            PATH: '/forgot',
        },
        RESET: {
            FULL_PATH: '/auth/reset/:token',
            PATH: '/reset/:token',
        },
    },
};
