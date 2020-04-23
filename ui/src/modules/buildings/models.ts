import {IAsyncData} from 'Core/reducer/model';

/**
 * Интерфейс здания.
 */
export interface IBuildingModel {
    _id: string;
    name?: string;
    address: string;
    floors: number;
}

export interface IBuildingCreateModel extends Omit<IBuildingModel, '_id'> {}

export interface IMappedBuildingsStore {
    buildings: IAsyncData<IBuildingModel[]>;
}
