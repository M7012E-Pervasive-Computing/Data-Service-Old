import { DataPointInterface } from './../Interface/DataPointInterface';
import { DataInterface } from './../Interface/DataInterface';
import { Database } from '../Model/Database';
import express, { Router } from 'express';
import { RouteSuperClass } from './RouteSuperClass/RouteSuperClass';

export class DataRoute extends RouteSuperClass {

    constructor(router: express.Router, name: string) {
        super(router, name);
    }

    /**
     * Defines what routes are available, and calls the associated functions.
     */
    configureRoutes() {
        this.router.get('/names', (req, res, next) => this.getNames(req, res));
        this.router.get('/:id', (req, res, next) => this.getData(req, res));
        this.router.post('/', (req, res, next) => this.setData(req, res));
    }

    public getData(req: express.Request, res: express.Response) {
        Database.getInstance().getData(req.params.id).subscribe({
            next: (data) => {
                res.status(200).json(data);
            },
            error: (err) => {
                res.status(500).json(err);
            }
        });
    }

    public getNames(req: express.Request, res: express.Response) {
        Database.getInstance().getDataNames().subscribe({
            next: (data) => {
                res.status(200).json(data);
            },
            error: (err) => {
                res.status(500).json(err);
            }
        });
    }

    public setData(req: express.Request, res: express.Response) {
        const data = req.body.data;
        if (!data || data.length <= 0) {
            res.status(400).json({
                success: false,
                message: 'No data provided'
            });
            return;
        }
        const name = req.body.name;
        if (!name || name === '' || name === 'names') {
            res.status(400).json({
                success: false,
                message: 'No name provided'
            });
            return;
        }
        let dataPointInterface: DataPointInterface[];
        try {
            dataPointInterface = this.toDataPoint(data);
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
            return;
        }
        const dataInterface: DataInterface = {
            timestamp: new Date(),
            data: dataPointInterface,
            name,
        };
        Database.getInstance().setData(dataInterface).subscribe({
            next: () => {
                res.status(200).send({
                    success: true,
                    message: 'Data successfully saved'
                });
            },
            error: (err) => {
                console.log(err);
                res.status(500).json(err);
            }
        });
    }

    private toDataPoint(data: any): DataPointInterface[] {
        const returnData: DataPointInterface[] = [];
        for (const d of data) {
            if (d.x && d.y && d.z) {
                returnData.push({
                    x: parseFloat(d.x),
                    y: parseFloat(d.y),
                    z: parseFloat(d.z)
                });
            } else {
                throw new Error('Invalid data');
            }
        }
        return returnData;
    }

}