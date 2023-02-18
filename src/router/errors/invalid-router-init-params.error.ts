import {SpaRouterError} from './spa-router.error';

export class InvalidRouterInitParamsError extends SpaRouterError {
    public override name = 'InvalidRouterInitParamsError';
    constructor(message: string) {
        super(message);
    }
}
