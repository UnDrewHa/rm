import {IAsyncData} from 'core/reducer/model';
import {IUserModel} from 'modules/users/models';

export interface IGetAllEventsData {
    filter: IUserEventsFilter;
}

export interface IUserEventsFilter {
    owner?: string;
    canceled?: any;
    to?: any;
    date?: string;
    room?: string;
    populateOwner?: boolean;
    tab?: string;
    now?: string;
}

export interface IEventModel {
    _id: string;
    title: string;
    date: string;
    from: string;
    to: string;
    room: string | IUserModel;
    owner: any;
    members?: string[];
    description: string;
    canceled?: boolean;
}

export interface IEventCreateModel extends Omit<IEventModel, '_id'> {}

export interface IMappedEventsStore {
    events: {
        list: IAsyncData<IEventModel[]>;
        details: IAsyncData<IEventModel>;
    };
}
