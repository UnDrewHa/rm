export interface IDeleteMultipleItems {
    data: {
        ids: string[];
    };
}

export interface IDataResponse<T> {
    data: T;
}
