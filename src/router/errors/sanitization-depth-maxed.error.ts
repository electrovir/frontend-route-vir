import {SpaRouterError} from './spa-router.error';

export class SanitizationDepthMaxed extends SpaRouterError {
    public name = 'SanitizationDepthMaxed';
    constructor(message: string) {
        super(message);
    }
}
