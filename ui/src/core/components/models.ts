export interface ITableConfig {
    keys: string[];
    getItems: (items) => {[name: string]: any}[];
}
