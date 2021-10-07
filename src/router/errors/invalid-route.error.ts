import {SpaRouterError} from './spa-router.error';

export class InvalidRouteError extends SpaRouterError {
    public name = 'InvalidRouteError';
    constructor(message: string) {
        super(message);
    }
}
