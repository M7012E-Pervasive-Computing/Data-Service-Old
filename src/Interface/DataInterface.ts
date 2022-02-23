import { DataPointInterface } from "./DataPointInterface";

export interface DataInterface {
    timestamp: Date;
    data: DataPointInterface[];
    name: string;
}