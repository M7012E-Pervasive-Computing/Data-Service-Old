import { DataPointInterface } from './../Interface/DataPointInterface';
'use strict'
import { DataInterface } from './../Interface/DataInterface';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import { model } from 'mongoose';
import * as Rx from 'rxjs';
import { dataSchema } from './Schemas/DataSchema';

export class Database {
    // create a singleton instance
    private static instance: Database;
    private dataModel = model<DataInterface>('Data', dataSchema, 'Data');

    // private constructor
    private constructor() {
        // connect to mongodb using mongoose
        mongoose.connect(process.env.MONGO_CONNECTION_STRING,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                auth: {
                    authSource: 'admin',
                },
                user: process.env.MONGO_USER.toString(),
                pass: process.env.MONGO_PASSWORD.toString(),
            })
            .catch((err: any) => console.log(err));
        const db = mongoose.connection;
        db.on('error', () => console.error('Connection to MongoDB failed'));
        db.once('open', () => {
            console.log('Connected to MongoDB');
        });
    }

    public getHealth(): boolean {
        return mongoose.connection._readyState === 1;
    }

    // get the singleton instance
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public close(): void {
        mongoose.connection.close().then(() => {
            console.log('Connection to MongoDB closed');
        }).catch((err: any) => console.log(err));
    }

    public getDataNames(): Rx.Observable<string[]> {
        return new Rx.Observable((observer: any) => {
            this.dataModel.find({}).distinct('name', (err: any, names: string[]) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(names);
                }
                observer.complete();
            });
        });
    }

    public getData(name: string): Rx.Observable<DataPointInterface[]> {
        return Rx.from(this.dataModel.find({ name }).sort({ timestamp: 1 }).then((result) => this.toDataArray(result)));
    }

    public setData(data: DataInterface): Rx.Observable<any> {
        return Rx.from(this.dataModel.create(data));
    }

    private toDataArray(data: DataInterface[]): DataPointInterface[] {
        const returnData: DataPointInterface[] = [];
        for (const d of data) {
            for (const points of d.data) {
                returnData.push({
                    x: points.x,
                    y: points.y,
                    z: points.z
                });
            }
        }
        return returnData;
    }
}