import {consolidateWindowEvents, RouteChangeEventName} from './consolidate-window-events';
import {SpaRouterError} from './errors/spa-router.error';
import type {FullRoute} from './full-route';
import {getFullRoute} from './get-route';
import {routeChangeCallback} from './route-change-callback';
import {areRoutesEqual} from './route-equality';
import {assertValidRouteInitParams, RouterInitParams} from './router-init-params';
import {createPathString, setRoutes} from './set-route';
import {SpaRouter} from './spa-router';

export function createSpaRouter<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> | undefined = Record<string, string> | undefined,
    ValidHash extends string | undefined = string | undefined,
>(
    init: Readonly<RouterInitParams<ValidRoutes, ValidSearch, ValidHash>> = {},
): Readonly<SpaRouter<ValidRoutes, ValidSearch, ValidHash>> {
    assertValidRouteInitParams(init);

    consolidateWindowEvents();

    const routeBase = init.routeBase?.replace(/\/+$/, '');

    const startsWithRouteBaseRegExp: RegExp | undefined = routeBase
        ? new RegExp(`^\\/${init.routeBase}`)
        : undefined;

    /**
     * Only add one listener to the window event but only add it once addRouteListener has been
     * called.
     */
    let windowListenerAdded = false;

    const router: SpaRouter<ValidRoutes, ValidSearch, ValidHash> = {
        listeners: new Set(),
        initParams: init,
        sanitizeFullRoute: (incomingRoute) => {
            const fullRoute: Required<Readonly<FullRoute>> = {
                hash: undefined,
                search: undefined,
                ...incomingRoute,
            };

            return init.routeSanitizer
                ? init.routeSanitizer(fullRoute)
                : (fullRoute as Required<Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>>);
        },
        setRoutes: (fullRoute, replace = false, force = false) => {
            const currentRoute = router.getCurrentRawRoutes();
            const completeRoute: Readonly<FullRoute> = {...currentRoute, ...fullRoute};
            const sanitizedRoute = router.sanitizeFullRoute(completeRoute);

            if (!force && areRoutesEqual(currentRoute, sanitizedRoute)) {
                return;
            }
            return setRoutes(sanitizedRoute, startsWithRouteBaseRegExp, routeBase, replace);
        },
        createRoutesUrl: (routes) => {
            return createPathString(routes, startsWithRouteBaseRegExp, routeBase);
        },
        getCurrentRawRoutes: () => {
            const rawRoutes = getFullRoute(startsWithRouteBaseRegExp);
            return rawRoutes;
        },
        addRouteListener: (fireImmediately, listener) => {
            if (init.maxListenerCount && router.listeners.size >= init.maxListenerCount) {
                throw new SpaRouterError(
                    `Tried to exceed route listener max of ${init.maxListenerCount}.`,
                );
            }
            router.listeners.add(listener);
            if (!windowListenerAdded) {
                globalThis.addEventListener(RouteChangeEventName, () => routeChangeCallback(router));
                windowListenerAdded = true;
            }
            if (fireImmediately) {
                routeChangeCallback(router, listener);
            }
            return listener;
        },
        hasRouteListener: (listener): boolean => {
            return router.listeners.has(listener);
        },
        removeRouteListener: (listener) => {
            return router.listeners.delete(listener);
        },
        sanitizationDepth: 0,
    };

    return router;
}
