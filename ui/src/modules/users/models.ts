import {IAsyncData} from 'core/reducer/model';
import {IBuildingModel} from 'modules/buildings/models';
import {ERoles} from 'modules/permissions/enums';

/**
 * Данные для изменения пароля.
 */
export interface ICheckPasswordData {
    _id: string;
    password: string;
    passwordConfirm: string;
}

/**
 * Интерфейс пользователя.
 */
export interface IUserModel {
    _id: string;
    login: string;
    email: string;
    building: IBuildingModel;
    role?: ERoles;
    active?: boolean;
    phone?: string;
    favouriteRooms?: string[];
    photo?: string;
    name?: string;
    surname?: string;
    patronymic?: string;
    fullName?: string;
}

export interface IUserFilterModel {
    login?: string;
    email?: string;
    building: string;
    role?: ERoles;
    active?: boolean;
    phone?: string;
}

export interface IUpdateUser extends ICheckPasswordData {
    _id: string;
    newPassword?: string;
    login?: string;
    email?: string;
    building?: IBuildingModel;
    role?: ERoles;
    active?: boolean;
    phone?: string;
    favouriteRooms?: string[];
    name?: string;
    surname?: string;
    patronymic?: string;
    fullName?: string;
}

export interface IMappedUserStore {
    users: {
        list: IAsyncData<IUserModel[]>;
        details: IAsyncData<IUserModel>;
        profile: IAsyncData<IUserModel>;
    };
}
