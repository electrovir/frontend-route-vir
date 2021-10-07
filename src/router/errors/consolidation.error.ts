import {SpaRouterError} from './spa-router.error';

export class WindowEventConsolidationError extends SpaRouterError {
    public name = 'WindowEventConsolidationError';
    constructor(message: string) {
        super(message);
    }
}
