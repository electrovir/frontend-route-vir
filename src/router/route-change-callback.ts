import {SanitizationDepthMaxed} from './errors/sanitization-depth-maxed.error';
import type {FullRoute} from './full-route';
import {areRoutesEqual} from './route-equality';
import {RouteListener, SpaRouter} from './spa-router';

// 2 sanitize depth allowed for each property: path, search, hash
const maxSanitizationStackDepth = 6;
export function routeChangeCallback<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> | undefined = Record<string, string> | undefined,
    ValidHash extends string | undefined = string | undefined,
>(
    router: SpaRouter<ValidRoutes, ValidSearch, ValidHash>,
    specificListenerOnly?: RouteListener<ValidRoutes, ValidSearch, ValidHash>,
): void {
    const currentRoutes = router.getCurrentRawRoutes();
    if (router.sanitizationDepth > maxSanitizationStackDepth) {
        throw new SanitizationDepthMaxed(
            `Route sanitization depth has exceed the max of ${maxSanitizationStackDepth} with ${JSON.stringify(
                currentRoutes,
            )}`,
        );
    }

    const sanitizedCurrentRoutes: Required<
        Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>
    > = router.sanitizeFullRoute(currentRoutes);

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
