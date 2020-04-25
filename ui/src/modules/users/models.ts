import {IAsyncData} from 'Core/reducer/model';
import {ERoles} from 'Modules/auth/enums';

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
    building: string;
    role?: ERoles;
    active?: boolean;
    phone?: string;
    favouriteRooms?: string[];
    photo?: string;
    name?: string;
    surname?: string;
    patronymic?: string;
}

export interface IUpdateUser extends IUserModel, ICheckPasswordData {
    newPassword?: string;
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
