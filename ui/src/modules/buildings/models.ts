import {IAsyncData} from 'core/reducer/model';

/**
 * Интерфейс здания.
 */
export interface IBuildingModel {
    _id: string;
    name?: string;
    address: string;
    floors: number;
    floorsData: IFloorData;
}

export interface IGetFloorDataFilter {
    building: string;
    floor: number;
}

export interface IUpdateFloorDataFilter {
    building: string;
    _id: string;
    roomsData: IRoomData[];
}

export interface IBuildingCreateModel extends Omit<IBuildingModel, '_id'> {}

export interface IMappedBuildingsStore {
    buildings: {
        list: IAsyncData<IBuildingModel[]>;
        details: IAsyncData<IBuildingModel>;
        floorData: IAsyncData<IFloorData>;
    };
}

export interface IRoomData {
    room: string;
    coords: Array<{lat: number; lng: number}[]>;
}

export interface IFloorData {
    _id: string;
    floorNumber: number;
    floorPlan: string;
    roomsData: IRoomData[];
    width: number;
    height: number;
}
