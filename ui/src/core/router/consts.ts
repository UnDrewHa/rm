export const ROUTER = {
    MAIN: {
        FULL_PATH: '/',
        PATH: '/',
        ROOMS: {
            DETAILS: {
                FULL_PATH: '/rooms/:id',
                PATH: '/rooms/',
            },
        },
        EVENTS: {
            DETAILS: {
                FULL_PATH: '/events/:id',
                PATH: '/events/',
            },
            CREATE: {
                FULL_PATH: '/events/create',
                PATH: '/events/create',
            },
        },
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
