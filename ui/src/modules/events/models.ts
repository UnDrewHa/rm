import {IAsyncData} from 'core/reducer/model';
import {EApproveStatuses} from 'modules/events/enums';
import {IRoomModel} from 'modules/rooms/models';
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
    tab?: string;
    now?: string;
}

export interface IEventModel {
    _id: string;
    title: string;
    date: string;
    from: string;
    to: string;
    room: string | IRoomModel;
    owner: string | IUserModel;
    members?: string[];
    description: string;
    canceled?: boolean;
    approveStatus?: EApproveStatuses;
}

export interface IEventFullModel extends IEventModel {
    room: IRoomModel;
    owner: IUserModel;
}

export interface IEventCreateModel extends Omit<IEventModel, '_id'> {}

export interface IMappedEventsStore {
    events: {
        list: IAsyncData<IEventModel[]>;
        details: IAsyncData<IEventFullModel>;
    };
}
