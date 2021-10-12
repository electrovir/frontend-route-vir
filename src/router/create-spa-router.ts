import {consolidateWindowEvents, RouteChangeEventName} from './consolidate-window-events';
import {SpaRouterError} from './errors/spa-router.error';
import {getRoutes} from './get-routes';
import {routeChangeCallback} from './route-change-callback';
import {areRoutesEqual} from './route-equality';
import {assertValidRouteInitParams, RouterInitParams} from './router-init-params';
import {createPathString, setRoutes} from './set-route';
import {SpaRouter} from './spa-router';

export function createSpaRouter<ValidRoutes extends string[] = string[]>(
    init: Readonly<RouterInitParams<ValidRoutes>> = {},
): SpaRouter<ValidRoutes> {
    assertValidRouteInitParams(init);
    consolidateWindowEvents();
    const startsWithRouteBaseRegExp: RegExp | undefined = init.routeBase
        ? new RegExp(`^\\/${init.routeBase}`)
        : undefined;

    /** Only add one listener to the window event but only add it once addRouteListener has been called. */
    let windowListenerAdded = false;

    const router: SpaRouter<ValidRoutes> = {
        listeners: new Set(),
        initParams: init,
        sanitizeRoutes: (routes) => {
            return init.routeSanitizer
                ? init.routeSanitizer(routes)
                : (routes as Readonly<ValidRoutes>);
        },
        setRoutes: (routes, replace = false, force = false) => {
            const sanitizedRoutes = router.sanitizeRoutes(routes);

            if (!force && areRoutesEqual(router.getCurrentRawRoutes(), sanitizedRoutes)) {
                return;
            }
            return setRoutes(sanitizedRoutes, startsWithRouteBaseRegExp, init.routeBase, replace);
        },
        createRoutesUrl: (routes) => {
            return createPathString(routes, startsWithRouteBaseRegExp, init.routeBase);
        },
        getCurrentRawRoutes: () => {
            const rawRoutes = getRoutes(startsWithRouteBaseRegExp);
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
                window.addEventListener(RouteChangeEventName, () => routeChangeCallback(router));
                windowListenerAdded = true;
            }
            if (fireImmediately) {
                routeChangeCallback(router, listener);
            }
            return listener;
        },
        removeRouteListener: (listener) => {
            return router.listeners.delete(listener);
        },
        sanitizationDepth: 0,
    };

    return router;
}
