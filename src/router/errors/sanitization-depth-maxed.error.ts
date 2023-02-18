import {SpaRouterError} from './spa-router.error';

export class SanitizationDepthMaxed extends SpaRouterError {
    public override name = 'SanitizationDepthMaxed';
    constructor(message: string) {
        super(message);
    }
}
