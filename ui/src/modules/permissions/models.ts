import {IAsyncData} from 'core/reducer/model';

export type TPermissionsList = string[];

export interface IMappedPermissionsStore {
    permissions: IAsyncData<TPermissionsList>;
}
