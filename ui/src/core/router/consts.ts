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
            USER_EVENTS: {
                FULL_PATH: '/user-events',
                PATH: '/user-events',
            },
        },
        PROFILE: {
            FULL_PATH: '/profile',
            PATH: '/profile',
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
