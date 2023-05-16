import type {FullRoute} from './full-route';
import {RouterInitParams} from './router-init-params';

export type RouteListener<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> | undefined = Record<string, string> | undefined,
    ValidHash extends string | undefined = string | undefined,
> = (routes: Required<Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>>) => void;

export type SpaRouter<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> | undefined = Record<string, string> | undefined,
    ValidHash extends string | undefined = string | undefined,
> = {
    addRouteListener: (
        /**
         * Immediately fire the listener callback once its attached. This prevents you from needing
         * to manually fire the callback to update all route-specific content on page load since
         * initial page load will not fire any listeners because the JavaScript hasn't loaded yet!
         */
        fireImmediately: boolean,
        listener: RouteListener<ValidRoutes, ValidSearch, ValidHash>,
    ) => RouteListener<ValidRoutes, ValidSearch, ValidHash>;
    createRoutesUrl: (routes: Readonly<FullRoute>) => string;
    getCurrentRawRoutes: () => Required<Readonly<FullRoute>>;
    initParams: Readonly<RouterInitParams<ValidRoutes, ValidSearch, ValidHash>>;
    listeners: Set<RouteListener<ValidRoutes, ValidSearch, ValidHash>>;
    /** Used to track route sanitization depth to prevent infinite sanitizing loops. */
    sanitizationDepth: number;
    removeRouteListener: (
        listenerToRemove: RouteListener<ValidRoutes, ValidSearch, ValidHash>,
    ) => boolean;
    removeAllRouteListeners: () => void;
    hasRouteListener: (
        listenerToCheck: RouteListener<ValidRoutes, ValidSearch, ValidHash>,
    ) => boolean;
    /**
     * Used to sanitize routes. Uses the user input sanitizer. If the user did not assign any input
     * sanitizer to the init parameters, this simply returns the inputs.
     */
    sanitizeFullRoute: (
        fullRoute: Readonly<FullRoute>,
    ) => Required<Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>>;
    /**
     * Manually update the current route. This will fire event listeners once the browser URL update
     * is finalized and the browser fires its relevant events.
     */
    setRoutes: (
        /**
         * Route to set. This is partial so that only parts can be applied. Any missing properties
         * from the FullRoute type will simply not be changed.
         */
        routes: Partial<Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>>,
        /**
         * Used for a back button or when replacing routes with sanitized routes. In every other
         * case, pass false here or leave it empty (it defaults to false).
         */
        replace?: boolean,
        /**
         * If set to true, the router will set the window location / URL even when the current URL
         * is equivalent to the new URL that will be set.
         */
        force?: boolean,
    ) => void;
};

// some actual JavaScript is needed so this file gets picked up in compilation lol
export function isSpaRouter(rawInput: unknown): rawInput is SpaRouter<any> {
    if (typeof rawInput !== 'object' || !rawInput) {
        return false;
    }
    const propsToCheck: Record<keyof SpaRouter<any>, string> = {
        addRouteListener: 'function',
        createRoutesUrl: 'function',
        getCurrentRawRoutes: 'function',
        hasRouteListener: 'function',
        initParams: 'object',
        listeners: 'object',
        removeAllRouteListeners: 'function',
        removeRouteListener: 'function',
        sanitizationDepth: 'number',
        sanitizeFullRoute: 'function',
        setRoutes: 'function',
    };

    const input = rawInput as SpaRouter<any>;

    const missingProperties = (Object.keys(propsToCheck) as (keyof SpaRouter<any>)[]).filter(
        (key) => {
            if (!input.hasOwnProperty(key) || !(typeof input[key] !== propsToCheck[key])) {
                return true;
            }

            return false;
        },
    );

    return !missingProperties.length;
}
