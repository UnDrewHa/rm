import {IAsyncData} from 'Core/reducer/model';
import {ERoles} from 'Modules/auth/enums';
import {IBuildingModel} from 'Modules/buildings/models';

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
    photo?: string;
    name?: string;
    surname?: string;
    patronymic?: string;
    fullName?: string;
}

export interface IMappedUserStore {
    user: IAsyncData<IUserModel>;
}

export interface IMappedUserStore2 {
    users: {
        list: IAsyncData<IUserModel[]>;
        item: IAsyncData<IUserModel>;
    };
}
