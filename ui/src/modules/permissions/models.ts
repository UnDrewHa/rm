import {IAsyncData} from 'src/core/reducer/model';

export type TPermissionsList = string[];

export interface IMappedPermissionsStore {
    permissions: IAsyncData<TPermissionsList>;
}
