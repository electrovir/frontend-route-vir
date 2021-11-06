import {InvalidRouterInitParamsError} from './errors/invalid-router-init-params.error';
import type {FullRoute} from './full-route';

export type RouteSanitizerCallback<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> | undefined = Record<string, string> | undefined,
    ValidHash extends string | undefined = string | undefined,
> = (
    params: Required<Readonly<FullRoute>>,
) => Required<Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>>;

export type RouterInitParams<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> | undefined = Record<string, string> | undefined,
    ValidHash extends string | undefined = string | undefined,
> = {
    /**
     * RouteBase: this can used to provide a base route for the router to consider the root. This
     * must NOT also be a valid route or things will go totally screwy.
     *
     * Example: in GitHub Pages, the root of each page is a relative path:
     * "<user>.github.io/<repo-name>". To make this router work in GitHub pages as well as local
     * development, add <repo-name> here as the routeBase.
     *
     * Concrete example: in "electrovir.github.io/threejs-experiments", "threejs-experiments" is the
     * routeBase.
     */
    routeBase?: string | undefined;
    /**
     * RouteSanitizer: this can be used to rewrite invalid routes before any router listener
     * callbacks are fired.
     */
    routeSanitizer?: RouteSanitizerCallback<ValidRoutes, ValidSearch, ValidHash> | undefined;
    /**
     * Used mostly for debugging purposes to prevent yourself from accidentally adding tons of event
     * listeners. When left undefined or set to zero, this property isn't used at all and there is
     * no maximum listener count. When set to a truthy number, the maximum comes into effect.
     */
    maxListenerCount?: number | undefined;
};

// some actual JavaScript is needed so this file gets picked up in compilation lol
export function createRouteInitParams<
    ValidRoutes extends string[],
    ValidSearch extends Record<string, string> | undefined,
    ValidHash extends string | undefined,
>(
    routeBase?: string,
    routeSanitizer?: RouteSanitizerCallback<ValidRoutes, ValidSearch, ValidHash>,
    maxListenerCount?: number,
): RouterInitParams<ValidRoutes, ValidSearch, ValidHash> {
    const routerInitParams: RouterInitParams<ValidRoutes, ValidSearch, ValidHash> = {
        routeBase,
        maxListenerCount,
        routeSanitizer,
    };

    return routerInitParams;
}

export function assertValidRouteInitParams<
    ValidRoutes extends string[],
    ValidSearch extends Record<string, string> | undefined,
    ValidHash extends string | undefined,
>(
    input: RouterInitParams<ValidRoutes, ValidSearch, ValidHash>,
): asserts input is RouterInitParams<ValidRoutes, ValidSearch, ValidHash> {
    if (
        'routeBase' in input &&
        typeof input.routeBase !== 'string' &&
        input.routeBase != undefined
    ) {
        throw new InvalidRouterInitParamsError(
            `Invalid type for router init params "routeBase" property. Expected string or undefined but got "${
                input.routeBase
            }" with type "${typeof input.routeBase}".`,
        );
    }

    if (
        'routeSanitizer' in input &&
        typeof input.routeSanitizer !== 'function' &&
        input.routeSanitizer != undefined
    ) {
        throw new InvalidRouterInitParamsError(
            `Invalid type for router init params "routeSanitizer" property. Expected a function or undefined but got "${
                input.routeSanitizer
            }" with type "${typeof input.routeSanitizer}".`,
        );
    }

    if (
        'maxListenerCount' in input &&
        (typeof input.maxListenerCount !== 'number' || isNaN(input.maxListenerCount)) &&
        input.maxListenerCount != undefined
    ) {
        throw new InvalidRouterInitParamsError(
            `Invalid type for router init params "maxListenerCount" property. Expected a number or undefined but got "${
                input.maxListenerCount
            }" with type "${typeof input.maxListenerCount}".`,
        );
    }
}
