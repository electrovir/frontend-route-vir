import {SpaRouterError} from './spa-router.error.js';

/**
 * An instance fo this error is emitted if route sanitization gets stuck in a loop.
 *
 * @category Errors
 */
export class SanitizationDepthMaxed extends SpaRouterError {
    public override name = 'SanitizationDepthMaxed';
}
