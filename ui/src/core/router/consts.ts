export const ROUTER = {
    MAIN: {
        FULL_PATH: '/',
        PATH: '/',
        MAP: {
            FULL_PATH: '/map',
            PATH: '/map',
        },
        ROOMS: {
            DETAILS: {
                FULL_PATH: '/rooms/:id',
                PATH: '/rooms/',
            },
            FAVOURITES: {
                FULL_PATH: '/favourites-rooms',
                PATH: '/favourites-rooms',
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
            OWNERS: {
                FULL_PATH: '/events-owners/:id',
                PATH: '/events-owners/',
            },
        },
        PROFILE: {
            FULL_PATH: '/profile',
            PATH: '/profile',
        },
        ADMIN: {
            FULL_PATH: '/admin',
            PATH: '/admin',
            USERS: {
                FULL_PATH: '/admin/users',
                PATH: '/admin/users',
                EDIT: {
                    FULL_PATH: '/admin/users/edit',
                    PATH: '/admin/users/edit',
                },
            },
            ROOMS: {
                FULL_PATH: '/admin/rooms',
                PATH: '/admin/rooms',
                EDIT: {
                    FULL_PATH: '/admin/rooms/edit',
                    PATH: '/admin/rooms/edit',
                },
            },
            BUILDINGS: {
                FULL_PATH: '/admin/buildings',
                PATH: '/admin/buildings',
                EDIT: {
                    FULL_PATH: '/admin/buildings/edit',
                    PATH: '/admin/buildings/edit',
                },
                FLOOR: {
                    FULL_PATH: '/admin/buildings/floor',
                    PATH: '/admin/buildings/floor',
                },
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
