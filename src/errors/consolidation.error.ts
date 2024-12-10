import {SpaRouterError} from './spa-router.error.js';

/**
 * An instance fo this error is emitted if `consolidateGlobalUrlEvents` fails.
 *
 * @category Errors
 */
export class GlobalUrlEventsConsolidationError extends SpaRouterError {
    public override name = 'GlobalUrlEventsConsolidationError';
}
