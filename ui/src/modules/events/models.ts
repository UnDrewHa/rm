import {IAsyncData} from 'src/core/reducer/model';

export interface IGetAllEventsData {
    filter: {
        date: string;
        room: string;
        owner?: string;
        canceled?: boolean;
    };
}

export interface IEventModel {
    _id: string;
    title: string;
    date: string;
    from: string;
    to: string;
    room: string;
    owner: string;
    members: string[];
    description: string;
    canceled: boolean;
}

export interface IEventCreateModel extends Omit<IEventModel, '_id'> {}

export interface IMappedEventsStore {
    events: {
        list: IAsyncData<IEventModel[]>;
        details: IAsyncData<IEventModel>;
    };
}
