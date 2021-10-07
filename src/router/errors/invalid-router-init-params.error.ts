import {SpaRouterError} from './spa-router.error';

export class InvalidRouterInitParamsError extends SpaRouterError {
    public name = 'InvalidRouterInitParamsError';
    constructor(message: string) {
        super(message);
    }
}
