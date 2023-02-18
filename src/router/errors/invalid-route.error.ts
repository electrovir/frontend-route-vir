import {SpaRouterError} from './spa-router.error';

export class InvalidRouteError extends SpaRouterError {
    public override name = 'InvalidRouteError';
    constructor(message: string) {
        super(message);
    }
}
