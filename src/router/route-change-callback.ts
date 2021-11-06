import {SanitizationDepthMaxed} from './errors/sanitization-depth-maxed.error';
import type {FullRoute} from './full-route';
import {areRoutesEqual} from './route-equality';
import {RouteListener, SpaRouter} from './spa-router';

const maxSanitizationStackDepth = 2;
export function routeChangeCallback<ValidRoutes extends string[]>(
    router: SpaRouter<ValidRoutes>,
    specificListenerOnly?: RouteListener<ValidRoutes>,
): void {
    const currentRoutes = router.getCurrentRawRoutes();
    if (router.sanitizationDepth > maxSanitizationStackDepth) {
        throw new SanitizationDepthMaxed(
            `Route sanitization depth has exceed the max of ${maxSanitizationStackDepth} with ${JSON.stringify(
                currentRoutes,
            )}`,
        );
    }

    const sanitizedCurrentRoutes: Readonly<FullRoute<ValidRoutes>> =
        router.sanitizeFullRoute(currentRoutes);

    if (areRoutesEqual(sanitizedCurrentRoutes, currentRoutes)) {
        router.sanitizationDepth = 0;
        if (specificListenerOnly) {
            specificListenerOnly(sanitizedCurrentRoutes);
        } else {
            router.listeners.forEach((listener) => {
                listener(sanitizedCurrentRoutes);
            });
        }
    } else {
        router.sanitizationDepth++;
        // don't fire the callback cause this listener will get fired after updating the routes
        return router.setRoutes(sanitizedCurrentRoutes, true);
    }
}
