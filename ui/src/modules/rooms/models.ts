import {IAsyncData} from 'src/core/reducer/model';

export interface IGetAllRoomsData {
    filter: {
        building: string;
        floors?: number[];
        date: string;
        dateFrom: string;
        dateTo: string;
        tv?: boolean;
        projector?: boolean;
        whiteboard?: boolean;
        flipchart?: boolean;
        notReserved: boolean;
    };
}

export interface IRoomModel {
    _id: string;
    name: string;
    description: string;
    seats: number;
    floor: number;
    tv: boolean;
    projector: boolean;
    whiteboard: boolean;
    flipchart: boolean;
    building: string;
}

export interface IRoomCreateModel extends Omit<IRoomModel, '_id'> {}

export interface IMappedRoomsStore {
    rooms: {
        list: IAsyncData<IRoomModel[]>;
        details: IAsyncData<IRoomModel>;
    };
}
