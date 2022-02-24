import { DataRoute } from './routes/DataRoute';
import express from 'express';
import dotenv from 'dotenv';
import { Database } from './Model/Database';
import morgan from 'morgan';
const cors = require('cors');

class Server {
    private port: number = 3000;
    private app: express.Application = express();
    private server: any;


    constructor() {
        dotenv.config();
        this.port = process.env.APP_PORT ?
            parseInt(process.env.APP_PORT, 10) : this.port;

        this.start();
    }

    start() {
        this.config();
        this.routes();

        this.server = this.app.listen(this.port, () => console.log(`Server started on port ${this.port}`));
    }

    public config(): void {
        // use json form parser middlware
        this.app.use(express.json());
        this.app.use(cors());

        this.app.use((
          err: any,
          req: express.Request,
          res: express.Response,
          next: express.NextFunction) => {
          err.status = 404;
          next(err);
        });

        Database.getInstance();

        morgan.token('statusColor', (req, res, args) => {
            // get the status code if response written
            let status;
            if (typeof res.headersSent === 'boolean') {
                status = res.headersSent;
            } if (status === true) {
                status = res.statusCode;
            }
            if (status === undefined) {
                status = 0;
            }

            // get status color
            let color = 0;
            if (status >= 500) {
                color = 31; // red
            } else if (status >= 400) {
                color = 33; // yellow
            } else if (status >= 300) {
                color = 36; // cyan
            } else if (status >= 200) {
                color = 32; // green
            }
            return '\x1b[' + color + 'm' + status + '\x1b[0m';
        });
        this.app.use(morgan(':date[iso] - :method :url - :statusColor - :response-time ms'));
    }

    public routes(): void {
    const router: express.Router = express.Router();

    // set up routes
    new DataRoute(router, 'Data route');

    // use router middleware
    this.app.use('/', router);
    }

    public shutdown(): void {
        this.server.close();
        console.log('Shutting down server');
    }
}

const server = new Server();

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    server.shutdown();
    Database.getInstance().close();
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    server.shutdown();
    Database.getInstance().close();
});
