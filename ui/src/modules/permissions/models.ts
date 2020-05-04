import {IAsyncData} from 'src/Core/reducer/model';

export type TPermissionsList = string[];

export interface IMappedPermissionsStore {
    permissions: IAsyncData<TPermissionsList>;
}
