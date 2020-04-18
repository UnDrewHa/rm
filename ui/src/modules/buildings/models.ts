import {IAsyncData} from 'src/core/reducer/model';

/**
 * Интерфейс здания.
 */
export interface IBuildingModel {
    _id: string;
    name?: string;
    address: string;
    floors?: number;
}

export interface IMappedBuildingsStore {
    buildings: IAsyncData<IBuildingModel[]>;
}
