export enum ERoles {
    USER = 'user',
    ADMIN = 'admin',
}

export enum EUsersActions {
    GET_ALL = 'users:getAll',
    GET_BY_ID = 'users:getById',
    CREATE = 'users:create',
    UPDATE = 'users:update',
    DELETE = 'users:delete',
    UPDATE_ME = 'users:updateMe',
    CHANGE_PASSWORD = 'users:changePassword',
    DELETE_ME = 'users:deleteMe',
}

export enum ERoomsActions {
    CREATE = 'rooms:create',
    UPDATE = 'rooms:update',
    DELETE = 'rooms:delete',
    GET_ALL = 'rooms:getAll',
    GET_BY_ID = 'rooms:getById',
}

export enum EEventsActions {
    CREATE = 'events:create',
    UPDATE = 'events:update',
    DELETE = 'events:delete',
    GET_ALL = 'events:getAll',
    GET_BY_ID = 'events:getById',
}

export enum EBuildingsActions {
    GET_ALL = 'buildings:getAll',
    GET_BY_ID = 'buildings:getById',
    CREATE = 'buildings:create',
    UPDATE = 'buildings:update',
    DELETE = 'buildings:delete',
}
