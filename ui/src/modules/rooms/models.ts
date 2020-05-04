import {IAsyncData} from 'core/reducer/model';
import {IBuildingModel} from 'modules/buildings/models';

export interface IGetAllRoomsData {
    filter: {
        building: string;
        floors?: number[];
        date?: string;
        from?: string;
        to?: string;
        tv?: boolean;
        projector?: boolean;
        whiteboard?: boolean;
        flipchart?: boolean;
        notReserved?: boolean;
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
    photos?: string[];
}

export interface IRoomFullModel extends Omit<IRoomModel, 'building'> {
    building: IBuildingModel;
}

export interface IRoomProp {
    item: any;
}

export interface IRoomCreateModel extends Omit<IRoomModel, '_id'> {}

export interface IMappedRoomsStore {
    rooms: {
        list: IAsyncData<IRoomModel[]>;
        details: IAsyncData<IRoomFullModel>;
    };
}
