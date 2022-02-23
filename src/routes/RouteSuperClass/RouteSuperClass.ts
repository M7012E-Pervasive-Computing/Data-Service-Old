import express from 'express';
export abstract class RouteSuperClass {
    router: express.Router;
    name: string;

    constructor(router: express.Router, name: string) {
        this.router = router;
        this.name = name;
        this.configureRoutes();
        console.log(`> CREATING ROUTE ${this.name}`)
    }
    getName() {
        return this.name;
    }
    abstract configureRoutes(): void;
}